import { useCallback, useEffect, useState } from 'react';

import {
  DEFAULT_SUPPORT_SETTINGS,
  fetchSupportSettings,
  type SupportSettings,
} from '@/lib/support';

export function useSupportSettings() {
  const [settings, setSettings] = useState<SupportSettings>(
    DEFAULT_SUPPORT_SETTINGS,
  );
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async (force = false) => {
    setLoading(true);
    try {
      const next = await fetchSupportSettings({ force });
      setSettings(next);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { settings, loading, reload };
}
