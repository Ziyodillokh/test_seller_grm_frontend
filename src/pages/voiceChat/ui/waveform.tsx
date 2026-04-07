import { useEffect, useRef, useCallback } from "react";

interface WaveformProps {
  isRecording: boolean;
  stream: MediaStream | null;
  isAiSpeaking?: boolean;
}

const PILL_COUNT = 4;
const PILL_WIDTH = 52;
const PILL_GAP = 16;
const PILL_MIN_H = 48;
const PILL_MAX_H = 110;
const PILL_RADIUS = 9999;

const IDLE_HEIGHTS = [0.55, 0.75, 0.7, 0.5];

export default function Waveform({
  isRecording,
  stream,
  isAiSpeaking = false,
}: WaveformProps) {
  const pillRefs = useRef<(HTMLDivElement | null)[]>([]);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number>(0);

  /* ---- Mic recording animation (AnalyserNode) ---- */
  const animateMic = useCallback(() => {
    const analyser = analyserRef.current;
    if (!analyser) return;

    const data = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(data);

    const chunkSize = Math.floor(data.length / PILL_COUNT);
    for (let i = 0; i < PILL_COUNT; i++) {
      let sum = 0;
      for (let j = 0; j < chunkSize; j++) {
        sum += data[i * chunkSize + j];
      }
      const avg = sum / chunkSize / 255;
      const h = PILL_MIN_H + avg * (PILL_MAX_H - PILL_MIN_H);
      const el = pillRefs.current[i];
      if (el) {
        el.style.height = `${h}px`;
        el.style.opacity = `${0.35 + avg * 0.65}`;
      }
    }

    rafRef.current = requestAnimationFrame(animateMic);
  }, []);

  /* ---- AI speaking animation (simulated sin-wave) ---- */
  const animateAi = useCallback(() => {
    const t = Date.now();
    for (let i = 0; i < PILL_COUNT; i++) {
      const phase = i * 1.4;
      const wave = 0.3 + 0.5 * Math.sin(t / 220 + phase);
      const h = PILL_MIN_H + wave * (PILL_MAX_H - PILL_MIN_H);
      const op = 0.45 + 0.45 * Math.sin(t / 260 + phase + 0.5);
      const el = pillRefs.current[i];
      if (el) {
        el.style.height = `${h}px`;
        el.style.opacity = `${op}`;
      }
    }
    rafRef.current = requestAnimationFrame(animateAi);
  }, []);

  /* ---- Reset pills to idle ---- */
  const resetToIdle = useCallback(() => {
    IDLE_HEIGHTS.forEach((h, i) => {
      const el = pillRefs.current[i];
      if (el) {
        el.style.height = `${PILL_MIN_H + h * (PILL_MAX_H - PILL_MIN_H)}px`;
        el.style.opacity = "0.25";
      }
    });
  }, []);

  /* ---- Mic recording effect ---- */
  useEffect(() => {
    if (!isRecording || !stream) {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
        analyserRef.current = null;
      }
      return;
    }

    const ctx = new AudioContext();
    audioCtxRef.current = ctx;

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.7;
    analyserRef.current = analyser;

    const source = ctx.createMediaStreamSource(stream);
    source.connect(analyser);

    rafRef.current = requestAnimationFrame(animateMic);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ctx.close().catch(() => {});
      audioCtxRef.current = null;
      analyserRef.current = null;
    };
  }, [isRecording, stream, animateMic]);

  /* ---- AI speaking effect ---- */
  useEffect(() => {
    if (isRecording) return; // mic takes priority
    if (!isAiSpeaking) {
      cancelAnimationFrame(rafRef.current);
      resetToIdle();
      return;
    }

    rafRef.current = requestAnimationFrame(animateAi);

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [isAiSpeaking, isRecording, animateAi, resetToIdle]);

  /* ---- Reset idle when nothing active ---- */
  useEffect(() => {
    if (!isRecording && !isAiSpeaking) {
      resetToIdle();
    }
  }, [isRecording, isAiSpeaking, resetToIdle]);

  const active = isRecording || isAiSpeaking;

  const getBackground = () => {
    if (isRecording)
      return "linear-gradient(180deg, #BDBDBD 0%, #E0E0E0 100%)";
    if (isAiSpeaking)
      return "linear-gradient(180deg, #A5D6A7 0%, #C8E6C9 100%)";
    return "#E8E8E8";
  };

  return (
    <div
      className="flex items-end justify-center"
      style={{ gap: PILL_GAP, height: PILL_MAX_H + 8 }}
    >
      {IDLE_HEIGHTS.map((h, i) => (
        <div
          key={i}
          ref={(el) => {
            pillRefs.current[i] = el;
          }}
          style={{
            width: PILL_WIDTH,
            height: PILL_MIN_H + h * (PILL_MAX_H - PILL_MIN_H),
            borderRadius: PILL_RADIUS,
            background: getBackground(),
            opacity: 0.25,
            transition: active
              ? "height 0.08s ease, opacity 0.08s ease"
              : "height 0.4s ease, opacity 0.4s ease",
          }}
        />
      ))}
    </div>
  );
}
