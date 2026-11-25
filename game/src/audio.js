export function playSound(state, sound) {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  try {
    if (!state.audio) state.audio = new AudioContextClass();
    if (state.audio.state === "suspended") state.audio.resume();
    const context = state.audio;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const now = context.currentTime;
    const settings = {
      chop: [210, 110, 0.08, "square"],
      sizzle: [130, 260, 0.24, "sawtooth"],
      serve: [540, 880, 0.2, "triangle"],
      fail: [240, 95, 0.28, "square"]
    }[sound] ?? [440, 660, 0.1, "sine"];
    oscillator.type = settings[3];
    oscillator.frequency.setValueAtTime(settings[0], now);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(40, settings[1]), now + settings[2]);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.08, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + settings[2]);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(now);
    oscillator.stop(now + settings[2] + 0.02);
  } catch {
    // Audio is optional; gameplay continues if the browser blocks WebAudio.
  }
}
