// ConversationList.js
import React from 'react';

function ConversationList({
  conversations,
  onSelect,
  onNewConversation,
  onDeleteConversation,
  currentConversationId
}) {
  return (
    <div className="conversation-list">
      <div className="header">
        <h3>会话列表</h3>
        <button onClick={onNewConversation}>+ 新会话</button>
      </div>
      <ul>
        {conversations.map((conv) => (
          <li
            key={conv.id}
            className={conv.id === currentConversationId ? 'active' : ''}
            onClick={() => onSelect(conv.id)}
          >
            <div className="conversation-title">
              会话 {new Date(conv.id).toLocaleString()}
            </div>
            <button
              className="delete-button"
              onClick={(e) => {
                e.stopPropagation(); // 防止触发 onSelect
                onDeleteConversation(conv.id);
              }}
            >
              删除
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ConversationList;