import { useCallback, useEffect, useState } from "react";
import { adminService } from "../services/admin.service";
import type { TelegramChannel } from "../types/admin-type";

interface ChannelsResult {
  version: number;
  error: string | null;
}

/** Loads the Telegram channel list (used by the channel page and the queue filter). */
export const useAdminChannels = () => {
  const [channels, setChannels] = useState<TelegramChannel[]>([]);
  const [version, setVersion] = useState(0);
  const [result, setResult] = useState<ChannelsResult | null>(null);

  useEffect(() => {
    let cancelled = false;

    adminService
      .listChannels()
      .then((response) => {
        if (cancelled) return;
        setChannels(response.channels);
        setResult({ version, error: null });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setResult({
          version,
          error: err instanceof Error ? err.message : "Unable to load channels.",
        });
      });

    return () => {
      cancelled = true;
    };
  }, [version]);

  const reload = useCallback(() => setVersion((current) => current + 1), []);

  const isLoading = result?.version !== version;

  return {
    channels,
    setChannels,
    isLoading,
    error: isLoading ? null : (result?.error ?? null),
    reload,
  };
};
