import { useCallback, useRef, useState } from "react";
import { groqChat } from "../lib/groqClient.js";

const WELCOME_MESSAGE = {
  id: "welcome",
  role: "assistant",
  text: "Welcome to Renaissance Med Spa! ✨ I'm Sayraa, your personal aesthetic concierge. Whether you're exploring Botox, HydraFacial, laser therapies, or ready to book a consultation — I'm here to guide your glow-up journey. How can I help you today?",
  time: "Now",
};

function now() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function useChat() {
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  // Running conversation history sent to Groq (role/content only)
  const historyRef = useRef([]);
  const msgIdRef = useRef(1);

  const sendMessage = useCallback(
    async (customText) => {
      const text = (customText ?? input).trim();
      if (!text || isTyping) return null;

      msgIdRef.current += 1;
      const uid = `user-${msgIdRef.current}`;
      const aid = `assistant-${msgIdRef.current}`;

      // Push user message into UI + history
      historyRef.current = [...historyRef.current, { role: "user", content: text }];
      setMessages((prev) => [
        ...prev,
        { id: uid, role: "user", text, time: now() },
      ]);
      setInput("");
      setIsTyping(true);

      try {
        const reply = await groqChat(historyRef.current);
        historyRef.current = [
          ...historyRef.current,
          { role: "assistant", content: reply },
        ];
        setMessages((prev) => [
          ...prev,
          { id: aid, role: "assistant", text: reply, time: now() },
        ]);
        return reply; // caller (ChatPanel) uses this for TTS
      } catch (err) {
        console.error("[Chat]", err);
        const fallback =
          "I'm experiencing a brief connection hiccup. Please try again shortly, or contact Renaissance Med Spa directly — our team would love to assist you!";
        setMessages((prev) => [
          ...prev,
          { id: aid, role: "assistant", text: fallback, time: now() },
        ]);
        return null;
      } finally {
        setIsTyping(false);
      }
    },
    [input, isTyping]
  );

  return { input, isTyping, messages, sendMessage, setInput };
}
