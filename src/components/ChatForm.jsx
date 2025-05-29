import { useRef } from "react";

function ChatForm({ chatHistory, setChatHistory, generateBotResponse }) {

  const inputRef = useRef(null)

  const handleFormSubmit = (e) => {
    e.preventDefault()
    const userMessage = inputRef.current.value.trim();
    if (!userMessage) return
    inputRef.current.value = ""

    setChatHistory(history => [...history, { role: 'user', text: userMessage }])
    // Generate bot response
    setTimeout(() => {
      setChatHistory(history => [...history, { role: 'model', text: 'Thinking...' }])
      generateBotResponse([...chatHistory, { role: 'user', text: userMessage }])
    }, 600)
  }

  return (
    <form action="#" className="chat-form" onSubmit={handleFormSubmit}>
      <input type="text" className="message-input"
        ref={inputRef} placeholder="Type your message..." required />
      <button className="material-symbols-outlined" type="submit">
        arrow_upward
      </button>
    </form>
  );
}

export default ChatForm;