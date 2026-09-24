type ToastTone = 'error' | 'success' | 'info';

export type ToastItem = {
  id: string;
  title?: string;
  message: string;
  tone: ToastTone;
  durationMs: number;
};

type ToastListener = (toasts: ToastItem[]) => void;

let toasts: ToastItem[] = [];
const listeners = new Set<ToastListener>();
const timers = new Map<string, ReturnType<typeof setTimeout>>();

function emit() {
  listeners.forEach((listener) => listener(toasts));
}

function dismiss(id: string) {
  const timer = timers.get(id);
  if (timer) {
    clearTimeout(timer);
    timers.delete(id);
  }
  toasts = toasts.filter((toast) => toast.id !== id);
  emit();
}

function show(input: {
  message: string;
  title?: string;
  tone?: ToastTone;
  durationMs?: number;
}) {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const toast: ToastItem = {
    id,
    title: input.title,
    message: input.message,
    tone: input.tone ?? 'info',
    durationMs: input.durationMs ?? 3200,
  };

  // Keep at most 2 visible toasts
  toasts = [...toasts.slice(-1), toast];
  emit();

  const timer = setTimeout(() => dismiss(id), toast.durationMs);
  timers.set(id, timer);

  return id;
}

export function subscribeToasts(listener: ToastListener) {
  listeners.add(listener);
  listener(toasts);
  return () => {
    listeners.delete(listener);
  };
}

export function getToasts() {
  return toasts;
}

export function dismissToast(id: string) {
  dismiss(id);
}

export function toastError(message: string, title = 'Error') {
  return show({ message, title, tone: 'error' });
}

export function toastSuccess(message: string, title = 'Success') {
  return show({ message, title, tone: 'success' });
}

export function toastInfo(message: string, title?: string) {
  return show({ message, title, tone: 'info' });
}
