import { useState, type FormEvent } from "react";
import { useAdminChannels } from "../../../hooks/useAdminChannels";
import { adminService } from "../../../services/admin.service";
import type { ChannelKind, TelegramChannel, UpdateChannelPayload } from "../../../types/admin-type";

export const useAdminChannelsPageService = () => {
  const { channels, setChannels, isLoading, error, reload } = useAdminChannels();

  const [username, setUsername] = useState("");
  const [kind, setKind] = useState<ChannelKind>("board");
  const [isAdding, setIsAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const [busyId, setBusyId] = useState<string | null>(null);
  const [rowError, setRowError] = useState<{ id: string; message: string } | null>(null);

  const addChannel = async (event: FormEvent) => {
    event.preventDefault();
    if (isAdding) return;

    if (!username.trim()) {
      setAddError("Enter a channel username or t.me link.");
      return;
    }

    setIsAdding(true);
    setAddError(null);
    setNotice(null);

    try {
      const response = await adminService.createChannel({ username: username.trim(), kind });
      setChannels((previous) =>
        [...previous, response.channel].sort((a, b) => a.username.localeCompare(b.username))
      );
      setUsername("");
      setNotice(`Channel @${response.channel.username} added.`);
    } catch (err) {
      // Shows the backend's INVALID_USERNAME / DUPLICATE_CHANNEL message as-is.
      setAddError(err instanceof Error ? err.message : "Unable to add this channel.");
    } finally {
      setIsAdding(false);
    }
  };

  const updateChannel = async (channel: TelegramChannel, payload: UpdateChannelPayload) => {
    setBusyId(channel.id);
    setRowError(null);

    try {
      const response = await adminService.updateChannel(channel.id, payload);
      setChannels((previous) =>
        previous.map((item) => (item.id === channel.id ? response.channel : item))
      );
    } catch (err) {
      setRowError({
        id: channel.id,
        message: err instanceof Error ? err.message : "Unable to update this channel.",
      });
    } finally {
      setBusyId(null);
    }
  };

  return {
    channels,
    isLoading,
    error,
    reload,
    username,
    setUsername,
    kind,
    setKind,
    isAdding,
    addError,
    notice,
    busyId,
    rowError,
    addChannel,
    toggleActive: (channel: TelegramChannel) => updateChannel(channel, { active: !channel.active }),
    changeKind: (channel: TelegramChannel, next: ChannelKind) => updateChannel(channel, { kind: next }),
  };
};
