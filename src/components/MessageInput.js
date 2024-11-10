// MessageInput.js
import React, { useState } from 'react';

function MessageInput({ onSend, isLoading }) {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSend(input.trim());
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="input-container">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="请输入您的消息..."
        disabled={isLoading} // 在加载时禁用输入框
      />
      <button type="submit" disabled={isLoading}>发送</button>
    </form>
  );
}

export default MessageInput;