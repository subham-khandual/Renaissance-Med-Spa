import { useEffect, useState } from "react";
import HomePage from "../pages/HomePage.jsx";
import ChatPage from "../pages/ChatPage.jsx";

export default function App() {
  const [currentPage, setCurrentPage] = useState(() => {
    return window.location.hash === "#chat" ? "chat" : "home";
  });

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === "#chat") {
        setCurrentPage("chat");
      } else {
        setCurrentPage("home");
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const navigateToChat = () => {
    window.location.hash = "chat";
    setCurrentPage("chat");
    window.scrollTo(0, 0);
  };

  const navigateToHome = () => {
    window.location.hash = "";
    setCurrentPage("home");
    window.scrollTo(0, 0);
  };

  if (currentPage === "chat") {
    return <ChatPage onBackToHome={navigateToHome} />;
  }

  return <HomePage onStartChat={navigateToChat} />;
}

