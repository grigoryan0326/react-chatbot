import { useEffect, useRef, useState } from "react";
import ChatbotIcon from "./components/ChatbotIcon";
import ChatForm from "./components/ChatForm";
import ChatMessage from "./components/ChatMessage";

function App() {
  const [chatHistory, setChatHistory] = useState([]);
  const [showChatbot, setShowChatbot] = useState(true);
  const chatBodyRef = useRef(null);

  const generateBotResponse = async (history) => {
    const updateHistory = (text, isError = false) => {
      setChatHistory(prev => [...prev.filter(msg => msg.text !== 'Thinking...'), { role: 'model', text, isError }])
    }

    history = history.map(({ role, text }) => ({ role, parts: [{ text }] }));

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: history })
    };

    try {
      const response = await fetch(import.meta.env.VITE_API_URL, requestOptions);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error.message || 'Failed to generate bot response.');
      const apiResponse = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, '$1').trim();
      updateHistory(apiResponse)
    } catch (e) {
      updateHistory(e.message, true)
    }
  }

  useEffect(() => {
    chatBodyRef.current.scrollTo({ top: chatBodyRef.current.scrollHeight, behavior: 'smooth' });
  }, [chatHistory])

  return (<div className={`container ${showChatbot ? 'show-chatbot' : ''}`}>
    <button id="chatbot-toggler">
      {showChatbot ?
        <span className="material-symbols-outlined" onClick={() => setShowChatbot(false)}>close</span> :
        <span className="material-symbols-outlined" onClick={() => setShowChatbot(true)}>mode_comment</span>
      }
    </button>
    <div className="chatbot-popup">
      {/* chatbot header */}
      <div className="chat-header">
        <div className="header-info">
          <ChatbotIcon />
          <h2 className="logo-text">Hav<span>AI</span></h2>
        </div>
        <button className="material-symbols-outlined" onClick={() => setShowChatbot(false)}>
          keyboard_arrow_down
        </button>
      </div>

      {/* chatbot body */}
      <div className="chat-body" ref={chatBodyRef}>
        <div className="message bot-message">
          <ChatbotIcon />
          <p className="message-text">Hello! How can I help you?</p>
        </div>

        {chatHistory.map((chat, index) => <ChatMessage chat={chat} key={index} />)}

      </div>

      {/* chatbot footer */}
      <div className="chat-footer">
        <ChatForm chatHistory={chatHistory} setChatHistory={setChatHistory} generateBotResponse={generateBotResponse} />
      </div>
    </div>
  </div>);
}

export default App;