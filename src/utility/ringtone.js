// Tiny synthesized ring tone (no audio asset needed) using the Web Audio API.
// A soft two-tone beep loops every couple of seconds while a call is ringing.

let audioCtx = null;
let timer = null;

const beep = () => {
  if (!audioCtx) return;
  try {
    const now = audioCtx.currentTime;
    [0, 0.18].forEach((offset, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.value = i === 0 ? 480 : 620;
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      const t = now + offset;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.18, t + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
      osc.start(t);
      osc.stop(t + 0.18);
    });
  } catch {
    /* ignore audio glitches */
  }
};

export const startRingtone = () => {
  if (timer) return;
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    audioCtx = new Ctx();
    audioCtx.resume?.();
    beep();
    timer = setInterval(beep, 2200);
  } catch {
    /* autoplay/permission issues — silently skip the ring */
  }
};

export const stopRingtone = () => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
  if (audioCtx) {
    audioCtx.close?.().catch(() => {});
    audioCtx = null;
  }
};
