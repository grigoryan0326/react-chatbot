import ChatbotIcon from "./ChatbotIcon";

function ChatMessage({ chat }) {

  return (
    <div className={`message ${chat.role === 'user' ? 'user' : 'bot'}-message ${chat.isError ? 'error' : ''}`}>
      {chat.role === 'model' && <ChatbotIcon />}
      <p className="message-text">{chat.text}</p>
    </div>
  );
}

export default ChatMessage;