import React from "react";
import { useState, useEffect, useRef } from "react";
import "./Main.css";

export default function Main() {
  const [input, setInput] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [previousChats, setPreviousChats] = useState([]);

  const messagesEndRef = useRef(null);

  function clearChat() {
    setPreviousChats([...previousChats, chatLog]);
    setChatLog([]);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    let chatLogNew = [...chatLog, { user: "me", message: `${input}` }];

    setInput("");
    await setChatLog(chatLogNew);

    const messages = chatLogNew.map((message) => message.message).join("\n");
    const response = await fetch("https://duopenai.onrender.com/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: messages,
      }),
    });

    const data = await response.json();
    setChatLog([...chatLogNew, { user: "gpt", message: `${data.message}` }]);
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatLog]);

  function handleLogout() {
    // Clear any user data and redirect to login page
    localStorage.removeItem("user");
    window.location.href = "/login";
  }

  return (
    <>
      <div className="App">
        {/* ASIDE */}
        <aside className="sidemenu">
          <div className="new-chat-button" onClick={clearChat}>
            New Chat
          </div>

          <div className="previous-chats">
            <h2>Previous Chats</h2>
            {previousChats.map((chat, index) => (
              <div key={index}>
                {chat.map((message, index) => (
                  <p key={index}>{message.message}</p>
                ))}
              </div>
            ))}
          </div>
          <div className="logout-button" onClick={handleLogout}>
            Logout
          </div>
        </aside>

        {/* CHAT FIELD */}
        <section className="chatfield">
          {/* HEADER */}
          <div className="header">
            <h1 className="header-text">RealAssist.AI</h1>
            <small className="header-small-text">
              This is private message, between you and Assistant.
            </small>
          </div>

          {/* CHAT */}
          <div className="chat-log">
            {/* AI ANSWER */}
            {chatLog.map((message, index) => (
              <ChatMessage key={index} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* CHAT INPUT */}
          <div className="chat-input-field fixed-input-field">
            <form onSubmit={handleSubmit}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="chat-input-field__textarea"
                placeholder="Ask RealAssist Something"
              ></input>
            </form>
            <div className="sumbit" onClick={handleSubmit}>
              <img src="https://res.cloudinary.com/dulasau/image/upload/v1680220055/send_gj5njc.svg"></img>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

const ChatMessage = ({ message }) => {
  const today = new Date();
  const timestamp = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    let time = `${hours} : ${minutes} ${ampm}`;

    return time;
  };

  const [copied, setCopied] = useState(false);
  const handleCopyClick = () => {
    navigator.clipboard.writeText(message.message);
    setCopied(true);
  };

  const messageRef = useRef(null);

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [message]);

  return (
    <div
      ref={messageRef}
      className={`chat-message ${message.user === "gpt" && "chatopenai"}`}
    >
      <div className="chat-message-center">
        <div className="message-box">
          <div className="message">{message.message}</div>
          <div
            className={`copy-icon ${message.user === "gpt" && "chatopenai"} ${
              copied && "copied"
            }`}
            onClick={handleCopyClick}
          >
            {copied ? (
              "COPIED!"
            ) : (
              <img
                className="copy-img"
                src="https://res.cloudinary.com/dulasau/image/upload/v1680143815/copy_mufbez.png"
                alt="copy"
              />
            )}
          </div>
        </div>

        <small className="timestamp">{timestamp(today)}</small>
      </div>
    </div>
  );
};
