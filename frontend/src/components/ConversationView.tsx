import React, { useEffect, useState } from 'react';
import { Customer, Message, messageAPI } from '../services/api';
import './ConversationView.css';

interface ConversationViewProps {
  customer: Customer;
  onBack: () => void;
}

const ConversationView: React.FC<ConversationViewProps> = ({ customer, onBack }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMessages();
  }, [customer.id]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      setError(null);

      const conversation = await messageAPI.getCustomerMessages(customer.id);
      setMessages(conversation.messages);
    } catch (err: any) {
      setError(err.message || 'Failed to load messages');
      console.error('Error loading messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="conversation-view">
      <div className="conversation-header">
        <button className="back-button" onClick={onBack}>
          ← Back
        </button>
        <div className="customer-info">
          <h2>{customer.name || 'Unknown'}</h2>
          <p className="phone">{customer.phone}</p>
          <p className="season">Season: {customer.currentSeason || 'Not set'}</p>
        </div>
      </div>

      <div className="messages-container">
        {loading ? (
          <div className="loading">Loading messages...</div>
        ) : error ? (
          <div className="error">
            <p>Error: {error}</p>
            <button onClick={loadMessages}>Retry</button>
          </div>
        ) : messages.length === 0 ? (
          <div className="no-messages">No messages found</div>
        ) : (
          <div className="messages-list">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${message.direction}`}
              >
                <div className="message-header">
                  <span className="direction-badge">
                    {message.direction === 'inbound' ? '📥 Received' : '📤 Sent'}
                  </span>
                  <span className="timestamp">{formatTimestamp(message.timestamp)}</span>
                </div>

                <div className="message-content">
                  {message.content}
                </div>

                <div className="message-meta">
                  {message.messageType && (
                    <span className="message-type">{message.messageType}</span>
                  )}
                  {message.status && (
                    <span className={`status ${message.status}`}>{message.status}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationView;
