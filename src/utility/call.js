// Helpers for rendering CALL-type chat messages (the inline call log shown in
// a direct thread) and their short conversation-list previews.

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

/** Seconds → "m:ss" (or "h:mm:ss" for long calls). */
export const formatCallDuration = (sec = 0) => {
  const total = Math.max(0, Math.floor(sec));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
};

/**
 * Describe a CALL message from the viewer's perspective. `mine` is true when
 * the viewer placed the call (they are the sender/caller).
 * Returns { isVideo, missed, text }.
 */
export const describeCall = (message, mine) => {
  const isVideo = message.callType === "VIDEO";
  const kind = isVideo ? "video" : "voice";
  const status = message.callStatus;

  if (status === "COMPLETED") {
    const base = `${mine ? "Outgoing" : "Incoming"} ${kind} call`;
    const text = message.callDurationSec
      ? `${base} · ${formatCallDuration(message.callDurationSec)}`
      : base;
    return { isVideo, missed: false, text };
  }
  if (status === "DECLINED") {
    return {
      isVideo,
      missed: false,
      text: mine ? `${cap(kind)} call declined` : "You declined the call",
    };
  }
  // CANCELLED or MISSED — a call that never connected.
  if (mine) return { isVideo, missed: false, text: `${cap(kind)} call cancelled` };
  return { isVideo, missed: true, text: `Missed ${kind} call` };
};

/** Compact preview for the conversation list, e.g. "📞 Missed voice call". */
export const callPreview = (message, mine) => {
  const { isVideo, text } = describeCall(message, mine);
  return `${isVideo ? "📹" : "📞"} ${text}`;
};
