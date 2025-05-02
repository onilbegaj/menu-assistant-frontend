import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./ChatWindow.css";

function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const res = await axios.post(
        "https://menu-assistant-backend.onrender.com/chat",
        {
          message: input,
        }
      );

      const botMessage = {
        sender: "bot",
        text: res.data.response || "Sorry, something went wrong.",
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Server error. Try again later." },
      ]);
    }

    setInput("");
  };

  return (
    <div className="chat-container">
      <div className="chat-header">🍽️ Menu Assistant</div>
      <div className="chat-box">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`chat-bubble ${msg.sender === "user" ? "user" : "bot"}`}
          >
            <div className="avatar">{msg.sender === "user" ? "🧑" : "🤖"}</div>
            <div className="text">{msg.text}</div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <div className="chat-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask about the menu..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default ChatWindow;
