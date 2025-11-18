import React, { useContext, useState } from "react";
import { ChatContext } from "../context/ChatContext";

export default function ChatBoxComponent() {
  const { messages, addMessage } = useContext(ChatContext);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim() === "") return;
    addMessage({ text: input, time: new Date() });
    setInput("");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto mb-2">
        {messages.map((msg, idx) => (
          <div key={idx} className="p-2 bg-gray-200 dark:bg-gray-700 rounded my-1">
            {msg.text}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border border-gray-300 dark:border-gray-600 rounded px-3 py-2"
          placeholder="Type a message..."
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
