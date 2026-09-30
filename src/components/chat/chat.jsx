import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./chat.module.css";
import sayraaAvatar from "../../assets/sayraa_avatar.png";
import medspaLogo from "../../assets/medspa_logo.jpg";
import { groqChat, groqTranscribe } from "../../lib/groqClient";
import { speakSweetVoice, stopSpeaking as stopSweetSpeaking, ensureVoicesReady } from "../../lib/voice";

const clampTo3Lines = (text, userQuery = "") => {
  if (!text) return "";
  let cleaned = text.trim();

  // If the user didn't ask about booking, strip trailing generic consultation invites
  const asksToBook = /\b(book|booking|appointment|schedule|consultation|call|cost|price|phone|address|location|hours)\b/i.test(userQuery);
  if (!asksToBook) {
    cleaned = cleaned.replace(/\s*(?:(?:Book|Schedule)\s+(?:a\s+)?complimentary\s+consultation|Book\s+your\s+appointment|Call\s+us\s+at|Book\s+with\s+Dr\.\s*Maheshwari)[^.!?\n]*[.!?]?/gi, "").trim();
  }

  let rawLines = cleaned
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (rawLines.length === 3) {
    return rawLines.join("\n");
  }

  if (rawLines.length > 3) {
    return rawLines.slice(0, 3).join("\n");
  }

  // If fewer than 3 lines, split by sentences to form up to 3 clear lines
  const sentences = cleaned.match(/[^.!?]+[.!?]+/g);
  if (sentences && sentences.length >= 3) {
    return sentences.slice(0, 3).map((s) => s.trim()).join("\n");
  } else if (sentences && sentences.length > 0) {
    return sentences.map((s) => s.trim()).join("\n");
  }

  return cleaned;
};

// Non-English language detector (catches Hindi, Hinglish, Spanish, French, etc.)
const NON_ENGLISH_FALLBACK =
  "I apologize, but I can only understand and communicate in English. Please ask your question in English, and I will be delighted to assist you with Renaissance Med Spa treatments and appointments! ✨";

const isNonEnglish = (text) => {
  if (!text) return false;
  if (/[\u0900-\u097F\u0600-\u06FF\u0400-\u04FF\u4E00-\u9FFF\u3040-\u30FF\uAC00-\uD7AF\u0B80-\u0BFF\u0C00-\u0C7F]/.test(text)) {
    return true;
  }
  const hinglishRegex = /\b(kya|kyaa|kyun|kyu|kaise|kese|kaisi|kaisa|kaun|kaunsa|kab|kahan|kaha|kidhar|kitna|kitni|kitne|koi|kuch|kuchh|batao|bataiye|bataye|bolo|chahiye|chaiye|hai|hain|hoga|hogi|tum|aap|aapka|aapki|aapko|hum|hamare|mera|meri|mere|mujhe|mujhko|nahi|nahin|nhi|haan|han|karo|karna|karun|kare|dena|dijiye|lena|milega|milegi|shukriya|dhanyawad|namaste|theek|thik|achha|accha|baare|bare|bat|baat|sun|suno|suniye|samjhao|yahan|vahan|idhar|udhar|paas|dur|pehle|baad|raha|rahi|rahe|kripya)\b/i;
  if (hinglishRegex.test(text)) {
    return true;
  }
  const foreignRegex = /\b(hola|como\s+estas|por\s+favor|gracias|buenos\s+dias|buenas\s+tardes|bonjour|merci|comment|s'il\s+vous\s+plait|hallo|danke|bitte|guten\s+tag|ciao|grazie)\b/i;
  return foreignRegex.test(text);
};

const formatDisplayText = (s) =>
  String(s || "")
    .replace(/```(?:[a-z]+)?\s*([\s\S]*?)```/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .trim();

const SPA_EMOJIS = ["✨", "🌸", "💆‍♀️", "🧖‍♀️", "💖", "🌿", "💄", "🧴", "💎", "⭐", "😊", "🪄"];

const QUICK_INQUIRIES = [
  "What services do you offer? ✨",
  "Tell me about Botox & Fillers 💉",
  "HydraFacial & Skin Glow 🧖‍♀️",
  "Medical Weight Loss programs ⚖️",
  "Where are you located? 📍",
  "How do I book a consultation? 📅",
];

const WELCOME_MESSAGE =
  "Welcome to Renaissance Med Spa! ✨ I'm Sayraa, your personal aesthetic concierge. How can I help you achieve your skincare and beauty goals today?";

const Chat = ({ onBackToHome }) => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [interimText, setInterimText] = useState("");
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [speakingIndex, setSpeakingIndex] = useState(null);

  const chatEndRef = useRef(null);
  const isListeningRef = useRef(false);
  const speakSeqRef = useRef(0);
  const welcomeSpokenRef = useRef(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const handleNavigateHome = () => {
    stopSpeaking();
    if (onBackToHome) {
      onBackToHome();
    } else {
      window.location.hash = "";
    }
  };

  const stopSpeaking = useCallback(() => {
    speakSeqRef.current++;
    setSpeakingIndex(null);
    stopSweetSpeaking();
  }, []);

  // Primary speech player: Groq TTS (canopylabs/orpheus-v1-english) -> EduSkill/Sayraa Sweet Female Voice Engine
  const speakText = useCallback(
    async (text, msgIndex = null) => {
      if (typeof window === "undefined" || !autoSpeak) return;

      stopSpeaking();
      const seq = ++speakSeqRef.current;
      setSpeakingIndex(msgIndex);

      // Unpause browser speech synthesis
      if (window.speechSynthesis && window.speechSynthesis.paused) {
        try { window.speechSynthesis.resume(); } catch (_) {}
      }

      // The signature sweet, cute, catchy female voice from EduSkill / Sayraa
      speakSweetVoice(text, {
        pitch: 1.12, // signature cute, sweet melodic feminine pitch
        rate: 0.98,  // warm, gentle, catchy concierge pace
        onStart: () => {
          if (seq === speakSeqRef.current) setSpeakingIndex(msgIndex);
        },
        onEnd: () => {
          if (seq === speakSeqRef.current) setSpeakingIndex(null);
        },
      });
    },
    [autoSpeak, stopSpeaking]
  );

  // Initialize messages, pre-warm voices, and attach unblock listener for Greeting speech
  useEffect(() => {
    ensureVoicesReady();

    const initial = [
      {
        text: WELCOME_MESSAGE,
        sender: "ai",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ];
    setMessages(initial);
    setConversationHistory([{ role: "assistant", content: WELCOME_MESSAGE }]);

    // Try speaking greeting on mount (will succeed if user previously interacted)
    speakText(WELCOME_MESSAGE, 0);

    // Browser Autoplay unblock listener: on first click/tap/keypress anywhere, unlock audio and speak greeting
    const handleFirstUserInteraction = () => {
      if (typeof window !== "undefined") {
        if (window.speechSynthesis && window.speechSynthesis.paused) {
          try { window.speechSynthesis.resume(); } catch (_) {}
        }
        ensureVoicesReady().then(() => {
          if (!welcomeSpokenRef.current) {
            welcomeSpokenRef.current = true;
            speakText(WELCOME_MESSAGE, 0);
          }
        });
      }
      window.removeEventListener("click", handleFirstUserInteraction);
      window.removeEventListener("touchstart", handleFirstUserInteraction);
      window.removeEventListener("keydown", handleFirstUserInteraction);
    };

    window.addEventListener("click", handleFirstUserInteraction, { once: true });
    window.addEventListener("touchstart", handleFirstUserInteraction, { once: true });
    window.addEventListener("keydown", handleFirstUserInteraction, { once: true });

    return () => {
      window.removeEventListener("click", handleFirstUserInteraction);
      window.removeEventListener("touchstart", handleFirstUserInteraction);
      window.removeEventListener("keydown", handleFirstUserInteraction);
      stopSpeaking();
    };
  }, [speakText, stopSpeaking]);

  // Auto-scroll chat box
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Stop recording helper
  const stopListening = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      try {
        mediaRecorderRef.current.stop();
      } catch (_) {}
    }
    setIsListening(false);
    isListeningRef.current = false;
  }, []);

  // Web Speech Recognition fallback for STT
  const startWebSpeechFallback = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setMessages((prev) => [
        ...prev,
        {
          text: "Speech recognition is not supported in this browser. Please use Chrome, Edge, or type your message in English! 🎙️",
          sender: "ai",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      isListeningRef.current = true;
      setIsListening(true);
      setInterimText("Listening... Speak in English ✨");
      playListenTone();
    };

    recognition.onresult = (event) => {
      let currentText = "";
      for (let i = 0; i < event.results.length; i++) {
        currentText += event.results[i][0].transcript;
      }
      setInterimText(currentText);
      if (event.results[0].isFinal) {
        setIsListening(false);
        isListeningRef.current = false;
        setInterimText("");
        sendMessage(currentText);
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
      isListeningRef.current = false;
      setInterimText("");
    };

    recognition.onend = () => {
      setIsListening(false);
      isListeningRef.current = false;
      setInterimText("");
    };

    recognition.start();
  }, []);

  // Groq Whisper STT (whisper-large-v3-turbo) with MediaRecorder
  const startListening = async () => {
    if (isListeningRef.current) {
      stopListening();
      return;
    }

    stopSpeaking();

    // Check if getUserMedia is supported
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      startWebSpeechFallback();
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : MediaRecorder.isTypeSupported("audio/mp4")
        ? "audio/mp4"
        : "";

      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType || "audio/webm" });

        if (audioBlob.size < 500) {
          setIsListening(false);
          isListeningRef.current = false;
          setInterimText("");
          return;
        }

        setInterimText("Transcribing audio with Groq Whisper... ✨");
        try {
          const transcript = await groqTranscribe(audioBlob);
          setInterimText("");
          setIsListening(false);
          isListeningRef.current = false;

          if (transcript && transcript.trim()) {
            sendMessage(transcript.trim());
          }
        } catch (sttErr) {
          console.warn("Groq STT transcription error:", sttErr);
          setInterimText("");
          setIsListening(false);
          isListeningRef.current = false;
          // If Groq STT failed, advise user or fallback
          startWebSpeechFallback();
        }
      };

      recorder.start(250);
      isListeningRef.current = true;
      setIsListening(true);
      setInterimText("Recording... Speak in English ✨ (Click mic to finish)");
      playListenTone();
    } catch (err) {
      console.warn("Microphone access failed, falling back to Web Speech:", err);
      startWebSpeechFallback();
    }
  };

  const deleteAllMessages = () => {
    if (window.confirm("Would you like to clear the conversation history?")) {
      stopSpeaking();
      const resetMsg =
        "Conversation cleared! I'm here whenever you're ready to explore Renaissance Med Spa treatments and bookings! ✨";
      setMessages([
        {
          text: resetMsg,
          sender: "ai",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      setConversationHistory([]);
      speakText(resetMsg, 0);
    }
  };

  const sendMessage = async (customInput) => {
    const textToSend = (customInput || userInput).trim();
    if (!textToSend || isTyping) return;

    stopSpeaking();
    welcomeSpokenRef.current = true;

    if (typeof window !== "undefined" && window.speechSynthesis) {
      try { if (window.speechSynthesis.paused) window.speechSynthesis.resume(); } catch (_) {}
    }

    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg = { text: textToSend, sender: "user", timestamp };
    const newMsgList = [...messages, userMsg];
    setMessages(newMsgList);
    setUserInput("");
    setIsTyping(true);

    // Intercept Hindi, Hinglish, or any other non-English language immediately
    if (isNonEnglish(textToSend)) {
      const refusalMsg = {
        text: NON_ENGLISH_FALLBACK,
        sender: "ai",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages([...newMsgList, refusalMsg]);
      setConversationHistory((prev) => [
        ...prev,
        { role: "user", content: textToSend },
        { role: "assistant", content: NON_ENGLISH_FALLBACK },
      ]);
      setIsTyping(false);
      speakText(NON_ENGLISH_FALLBACK, newMsgList.length);
      return;
    }

    const updatedHistory = [...conversationHistory, { role: "user", content: textToSend }];

    try {
      const rawReply = await groqChat(updatedHistory.slice(-8));
      const displayReply = formatDisplayText(rawReply) || rawReply;
      const clampedReply = clampTo3Lines(displayReply, textToSend);

      // Double-check if reply was non-English
      const finalReply = isNonEnglish(clampedReply) ? NON_ENGLISH_FALLBACK : clampedReply;

      const aiMsg = {
        text: finalReply,
        sender: "ai",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setConversationHistory([...updatedHistory, { role: "assistant", content: finalReply }]);
      setMessages([...newMsgList, aiMsg]);
      speakText(finalReply, newMsgList.length);
    } catch (err) {
      console.error("Groq Chat Error:", err);
      const fallback =
        "Renaissance Med Spa in Colorado Springs offers customized Botox, dermal fillers, HydraFacial, and laser skin treatments.\nDr. Parul Maheshwari, MD and our expert team personalize each protocol to enhance your skin's natural radiance and tone.\nEvery treatment utilizes cutting-edge medical aesthetic technology for transformative and lasting results. ✨";

      const fallbackMsg = {
        text: fallback,
        sender: "ai",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages([...newMsgList, fallbackMsg]);
      speakText(fallback, newMsgList.length);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className={styles.chatContainer}>
      {/* Header */}
      <div className={styles.header}>
        <img src={sayraaAvatar} alt="Sayraa Concierge" className={styles.avatar} />
        <div className={styles.headerInfo} onClick={handleNavigateHome} style={{ cursor: "pointer", flex: 1 }}>
          <span className={styles.headerTitle}>Sayraa</span>
          <span className={styles.headerSubtitle}>Renaissance Med Spa • Colorado Springs</span>
        </div>

        <div className={styles.headerActions}>
          {/* TTS Audio toggle */}
          <button
            onClick={() => {
              if (autoSpeak) stopSpeaking();
              setAutoSpeak((v) => !v);
            }}
            className={styles.headerBtn}
            title={autoSpeak ? "Mute Sayraa Voice" : "Enable Sayraa Voice"}
            aria-label="Toggle voice"
          >
            {autoSpeak ? "🔊" : "🔇"}
          </button>

          {/* Clear history */}
          <button onClick={deleteAllMessages} className={styles.deleteButton} title="Clear Chat" aria-label="Clear chat">
            🗑️
          </button>

          {/* Close/Back button */}
          <button onClick={handleNavigateHome} className={styles.headerBtn} title="Back to Home" aria-label="Back to Home">
            ✕
          </button>
        </div>
      </div>

      {/* Chat Messages Box */}
      <div
        id="chatBox"
        className={styles.chatBox}
        style={{
          backgroundImage: `linear-gradient(rgba(7, 9, 34, 0.9), rgba(11, 14, 45, 0.92)), url(${medspaLogo})`,
        }}
      >
        {messages.map((msg, index) => (
          <div key={index} className={styles[`${msg.sender}-message`]}>
            <div>{msg.text}</div>
            <div className={styles.msgActions}>
              <span className={styles.timestamp}>{msg.timestamp}</span>
              {msg.sender === "ai" && (
                <button
                  type="button"
                  className={styles.listenBtn}
                  onClick={() => {
                    if (speakingIndex === index) {
                      stopSpeaking();
                    } else {
                      speakText(msg.text, index);
                    }
                  }}
                  title={speakingIndex === index ? "Stop voice" : "Listen to Sayraa speak this aloud"}
                >
                  {speakingIndex === index ? "⏹️ Stop" : "🔊 Listen"}
                </button>
              )}
              {speakingIndex === index && (
                <span className={styles.speakingIndicator}>
                  <span>Speaking...</span>
                </span>
              )}
            </div>
          </div>
        ))}

        {isTyping && <div className={styles.typing}>Sayraa is thinking... ✨</div>}
        {isListening && <div className={styles.typing}>🎙️ {interimText || "Recording... speak now"}</div>}

        {/* Quick Inquiry Chips (displayed before user starts chatting) */}
        {messages.length <= 2 && (
          <div className={styles.quickPrompts}>
            {QUICK_INQUIRIES.map((q, idx) => (
              <button key={idx} className={styles.quickPromptBtn} onClick={() => sendMessage(q)}>
                {q}
              </button>
            ))}
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Footer / Input Composer */}
      <div className={styles.footer}>
        <div className={styles.inputWrapper}>
          <span
            className={styles.smileyIcon}
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            title="Add emoji"
          >
            ✨
          </span>

          {showEmojiPicker && (
            <div className={styles.emojiPicker}>
              {SPA_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  className={styles.emojiItem}
                  onClick={() => {
                    setUserInput((prev) => prev + emoji);
                    setShowEmojiPicker(false);
                  }}
                  type="button"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          <input
            id="userInput"
            type="text"
            placeholder="Ask about Botox, facials, weight loss, booking (English only)..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className={styles.inputField}
            disabled={isTyping}
          />

          {userInput.trim() ? (
            <button
              id="sendButton"
              onClick={() => sendMessage()}
              className={styles.sendButton}
              title="Send message"
              type="button"
            >
              <span>➔</span>
            </button>
          ) : (
            <button
              id="micButton"
              onClick={startListening}
              className={`${styles.micButton} ${isListening ? styles.micButtonListening : ""}`}
              title={isListening ? "Recording... click to finish & send" : "Speak with Sayraa (English only)"}
              type="button"
            >
              {isListening ? "⏹️" : "🎤"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
