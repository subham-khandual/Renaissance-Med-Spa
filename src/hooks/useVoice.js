import { useCallback, useRef, useState } from "react";
import { groqTranscribe } from "../lib/groqClient.js";
import { speakSweetVoice, stopSpeaking as stopSweetSpeaking } from "../lib/voice.js";

/**
 * useVoice — handles:
 *  • Microphone recording → Groq Whisper STT → transcript callback
 *  • Groq PlayAI TTS → audio playback with mute/unmute support
 */
export function useVoice({ onTranscript }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceError, setVoiceError] = useState(null);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const audioRef = useRef(null);

  // ── STT: Start microphone recording ──────────────────────────────────────
  const startRecording = useCallback(async () => {
    setVoiceError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunksRef.current = [];

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "audio/mp4";

      const recorder = new MediaRecorder(stream, { mimeType });

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: mimeType });

        if (blob.size < 1000) return; // ignore very short / empty clips

        setIsTranscribing(true);
        try {
          const text = await groqTranscribe(blob);
          if (text) onTranscript(text);
        } catch (err) {
          console.error("[Voice STT]", err);
          setVoiceError("Could not understand audio — please try again.");
        } finally {
          setIsTranscribing(false);
        }
      };

      mediaRecorderRef.current = recorder;
      recorder.start(200);
      setIsRecording(true);
    } catch (err) {
      console.error("[Voice Mic]", err);
      setVoiceError(
        err.name === "NotAllowedError"
          ? "Microphone access denied — please allow it in your browser settings."
          : "Could not start microphone. Please check your device."
      );
    }
  }, [onTranscript]);

  // ── STT: Stop and trigger transcription ──────────────────────────────────
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  }, []);

  // ── TTS: Speak text via Sayraa Sweet Female Voice Engine ─────────────────
  const speak = useCallback(async (text) => {
    setIsSpeaking(true);
    speakSweetVoice(text, {
      pitch: 1.12,
      rate: 0.98,
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
    });
  }, []);

  // ── TTS: Stop speaking ───────────────────────────────────────────────────
  const stopSpeaking = useCallback(() => {
    stopSweetSpeaking();
    setIsSpeaking(false);
  }, []);

  return {
    isRecording,
    isTranscribing,
    isSpeaking,
    voiceError,
    setVoiceError,
    startRecording,
    stopRecording,
    speak,
    stopSpeaking,
  };
}
