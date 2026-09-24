import { File, UploadType } from 'expo-file-system';
import { copyAsync, cacheDirectory } from 'expo-file-system/legacy';
import { Platform } from 'react-native';

import { API_BASE_URL } from './config';
import { clearSession, getAccessToken } from '@/lib/session';

export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

type RequestOptions = {
  method?: string;
  body?: unknown;
  auth?: boolean;
  headers?: Record<string, string>;
};

const UPLOAD_TIMEOUT_MS = 60_000;

function buildApiUrl(path: string) {
  return path.startsWith('http')
    ? path
    : `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
}

function networkErrorMessage(url: string, error: unknown) {
  const detail =
    error instanceof Error && error.message ? ` (${error.message})` : '';
  return `Unable to reach the server at ${url}${detail}. Check EXPO_PUBLIC_API_URL (currently ${API_BASE_URL}) and restart with npx expo start -c.`;
}

function parseResponseText(text: string) {
  if (!text) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

function messageFromBody(body: unknown, fallback: string) {
  if (!body || typeof body !== 'object') return fallback;
  const record = body as Record<string, unknown>;
  if (typeof record.message === 'string') return record.message;
  if (Array.isArray(record.message)) return record.message.join(', ');
  return fallback;
}

/** Copy picker/camera URIs into app cache so uploads always use a stable file:// path. */
async function resolveNativeUploadUri(uri: string, name: string) {
  const cache = cacheDirectory;
  if (!cache) return uri;

  const safeName = name.replace(/[^\w.-]/g, '_') || 'upload.bin';
  const dest = `${cache}api-upload-${Date.now()}-${safeName}`;

  // Camera / gallery often return content://, ph://, or ephemeral file:// paths.
  await copyAsync({ from: uri, to: dest });
  return dest;
}

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`${label} timed out after ${Math.round(ms / 1000)}s`));
    }, ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = 'GET', body, auth = false, headers = {} } = options;
  const url = buildApiUrl(path);

  const requestHeaders: Record<string, string> = {
    Accept: 'application/json',
    ...headers,
  };

  if (body !== undefined && !(body instanceof FormData)) {
    requestHeaders['Content-Type'] = 'application/json';
  }

  if (auth) {
    const token = await getAccessToken();
    if (!token) {
      throw new ApiError('You need to sign in again.', 401);
    }
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(url, {
      method,
      headers: requestHeaders,
      body:
        body === undefined
          ? undefined
          : body instanceof FormData
            ? body
            : JSON.stringify(body),
    });
  } catch (error) {
    throw new ApiError(networkErrorMessage(url, error), 0);
  }

  const text = await response.text();
  const parsed = parseResponseText(text);

  if (!response.ok) {
    if (auth && response.status === 401) {
      await clearSession();
    }
    throw new ApiError(
      messageFromBody(parsed, `Request failed (${response.status})`),
      response.status,
      parsed,
    );
  }

  return parsed as T;
}

async function uploadWithFetchFormData<T>(
  url: string,
  file: { uri: string; name: string; type: string },
  token: string,
): Promise<T> {
  const form = new FormData();
  form.append('file', {
    uri: file.uri,
    name: file.name,
    type: file.type || 'application/octet-stream',
  } as unknown as Blob);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), UPLOAD_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        // Do not set Content-Type — RN sets multipart boundary.
      },
      body: form,
      signal: controller.signal,
    });

    const text = await response.text();
    const parsed = parseResponseText(text);

    if (response.status === 401) {
      await clearSession();
    }
    if (!response.ok) {
      throw new ApiError(
        messageFromBody(parsed, `Request failed (${response.status})`),
        response.status,
        parsed,
      );
    }
    return parsed as T;
  } finally {
    clearTimeout(timer);
  }
}

async function uploadWithExpoFile<T>(
  url: string,
  file: { uri: string; name: string; type: string },
  token: string,
): Promise<T> {
  const uploadFile = new File(file.uri);
  const result = await withTimeout(
    uploadFile.upload(url, {
      uploadType: UploadType.MULTIPART,
      fieldName: 'file',
      mimeType: file.type || 'application/octet-stream',
      // Camera returns while app was backgrounded; background sessions often never resolve.
      sessionType: 'foreground',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    }),
    UPLOAD_TIMEOUT_MS,
    'Upload',
  );

  const parsed = parseResponseText(result.body);
  if (result.status === 401) {
    await clearSession();
  }
  if (result.status < 200 || result.status >= 300) {
    throw new ApiError(
      messageFromBody(parsed, `Request failed (${result.status})`),
      result.status,
      parsed,
    );
  }
  return parsed as T;
}

export async function apiUpload<T>(
  path: string,
  file: {
    uri: string;
    name: string;
    type: string;
  },
): Promise<T> {
  const url = buildApiUrl(path);

  if (Platform.OS === 'web') {
    const form = new FormData();
    form.append('file', {
      uri: file.uri,
      name: file.name,
      type: file.type,
    } as unknown as Blob);

    return apiRequest<T>(path, {
      method: 'POST',
      body: form,
      auth: true,
    });
  }

  const token = await getAccessToken();
  if (!token) {
    throw new ApiError('You need to sign in again.', 401);
  }

  try {
    const uploadUri = await resolveNativeUploadUri(file.uri, file.name);
    const normalized = {
      uri: uploadUri,
      name: file.name,
      type: file.type || 'image/jpeg',
    };

    try {
      return await uploadWithFetchFormData<T>(url, normalized, token);
    } catch (fetchError) {
      if (fetchError instanceof ApiError && fetchError.status > 0) {
        throw fetchError;
      }
      // Fallback for environments where FormData + file URI fails.
      return await uploadWithExpoFile<T>(url, normalized, token);
    }
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(networkErrorMessage(url, error), 0);
  }
}
