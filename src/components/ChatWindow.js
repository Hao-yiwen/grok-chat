// ChatWindow.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

function ChatWindow({ conversation, updateMessages }) {
  const [messages, setMessages] = useState(conversation.messages);
  const [isLoading, setIsLoading] = useState(false);
  const apiKey = process.env.REACT_APP_API_KEY;

  useEffect(() => {
    setMessages(conversation.messages);
  }, [conversation.messages]);

  const sendMessage = async (userMessage) => {
    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    updateMessages(conversation.id, newMessages);
    setIsLoading(true); // 开始加载

    try {
      const response = await axios.post(
        'https://api.x.ai/v1/chat/completions',
        {
          messages: [
            { role: 'system', content: 'You are Grok, a chatbot inspired by the Hitchhikers Guide to the Galaxy.' },
            ...newMessages.map(({ role, content }) => ({ role: role === 'bot' ? 'assistant' : role, content }))
          ],
          model: 'grok-beta',
          stream: false,
          temperature: 0
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          }
        }
      );

      const botMessage = response.data.choices[0].message.content;
      const updatedMessages = [...newMessages, { role: 'bot', content: botMessage }];
      setMessages(updatedMessages);
      updateMessages(conversation.id, updatedMessages);
    } catch (error) {
      console.error('与Grok通信时出错', error);
      const errorMessages = [...newMessages, { role: 'bot', content: '与Grok通信时出错，请重试。' }];
      setMessages(errorMessages);
      updateMessages(conversation.id, errorMessages);
    } finally {
      setIsLoading(false); // 加载结束
    }
  };

  return (
    <div className="chat-window">
      <MessageList messages={messages} isLoading={isLoading} />
      <MessageInput onSend={sendMessage} isLoading={isLoading} />
    </div>
  );
}

export default ChatWindow;