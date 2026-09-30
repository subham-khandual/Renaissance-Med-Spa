import { useEffect } from "react";
import Chat from "../components/chat/chat.jsx";

export default function ChatPage({ onBackToHome }) {
  // Prevent page scroll when on the dedicated chat section page
  useEffect(() => {
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
    };
  }, []);

  return (
    <div
      className="chat-page-wrapper"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100dvh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        zIndex: 9999,
        background: "radial-gradient(circle at 50% 0%, #0c0f33 0%, #050516 70%)",
      }}
    >
      {/* Ambient background glows */}
      <div className="ambient-glow ambient-glow-left" aria-hidden="true" />
      <div className="ambient-glow ambient-glow-right" aria-hidden="true" />

      {/* Middle Center Container holding the Renaissance Med Spa Chat Component */}
      <main
        className="chat-page-main"
        style={{
          position: "fixed",
          inset: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "1rem",
          overflow: "hidden",
        }}
      >
        <Chat onBackToHome={onBackToHome} />
      </main>
    </div>
  );
}
