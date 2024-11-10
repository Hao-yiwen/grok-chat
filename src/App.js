import React, { useState, useEffect } from 'react';
import './App.css';
import ConversationList from './components/ConversationList';
import ChatWindow from './components/ChatWindow';

function App() {
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);

  // 从 localStorage 加载会话数据
  // 从 localStorage 加载会话数据
useEffect(() => {
  const storedConversations = localStorage.getItem('conversations');
  console.log('Loaded conversations:', storedConversations);
  if (storedConversations) {
    try {
      const parsedConversations = JSON.parse(storedConversations);
      console.log('Parsed conversations:', parsedConversations);
      setConversations(parsedConversations);
      if (parsedConversations.length > 0) {
        setCurrentConversationId(parsedConversations[0].id);
      }
    } catch (error) {
      console.error('Error parsing conversations:', error);
    }
  }
}, []);

  // 当 conversations 变化时，将其保存到 localStorage
  useEffect(() => {
    localStorage.setItem('conversations', JSON.stringify(conversations));
  }, [conversations]);

  const handleNewConversation = () => {
    const newConversation = {
      id: Date.now(),
      messages: []
    };
    const updatedConversations = [newConversation, ...conversations];
    setConversations(updatedConversations);
    setCurrentConversationId(newConversation.id);
  };

  const handleSelectConversation = (id) => {
    setCurrentConversationId(id);
  };

  const updateConversationMessages = (id, messages) => {
    setConversations(
      conversations.map((conv) =>
        conv.id === id ? { ...conv, messages } : conv
      )
    );
  };

  const deleteConversation = (id) => {
    const updatedConversations = conversations.filter(conv => conv.id !== id);
    setConversations(updatedConversations);
    if (updatedConversations.length > 0) {
      setCurrentConversationId(updatedConversations[0].id);
    } else {
      setCurrentConversationId(null);
    }
  };

  const currentConversation = conversations.find(
    (conv) => conv.id === currentConversationId
  );

  return (
    <div className="app-container">
      <ConversationList
        conversations={conversations}
        onSelect={handleSelectConversation}
        onNewConversation={handleNewConversation}
        onDeleteConversation={deleteConversation}
        currentConversationId={currentConversationId}
      />
      {currentConversation ? (
        <ChatWindow
          conversation={currentConversation}
          updateMessages={updateConversationMessages}
        />
      ) : (
        <div className="welcome-message">
          <h2>欢迎使用 Grok 聊天</h2>
          <button onClick={handleNewConversation}>开始新会话</button>
        </div>
      )}
    </div>
  );
}

export default App;