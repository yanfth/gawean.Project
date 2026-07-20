import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Trash2 } from 'lucide-react';
import './ChatModal.css';

interface User {
  id: number;
  name: string;
}

interface Message {
  id: number;
  order_id: number;
  sender_id: number;
  content: string;
  created_at: string;
  sender?: User;
}

interface Order {
  id: number;
  status: string;
  agreed_price: string | null;
  jasa: any; // Simplified for now
  pencari_jasa: any;
  messages: Message[];
}

interface ChatModalProps {
  order: Order;
  currentUser: any;
  token: string;
  baseUrl: string;
  onClose: () => void;
  onUpdateStatus?: (status: string) => void;
  isProvider?: boolean;
}

export default function ChatModal({ order, currentUser, token, baseUrl, onClose, onUpdateStatus, isProvider }: ChatModalProps) {
  const [messages, setMessages] = useState<Message[]>(order.messages || []);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchOrderDetails = async () => {
    try {
      const res = await fetch(`${baseUrl}/orders/${order.id}`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Poll for new messages every 5 seconds
    const interval = setInterval(() => {
      fetchOrderDetails();
    }, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [order.id]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/orders/${order.id}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ content: newMessage })
      });
      
      if (res.ok) {
        setNewMessage('');
        // Fetch order details again to instantly get any bot auto-replies
        fetchOrderDetails();
      }
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!isProvider || !onUpdateStatus) return;
    try {
      const res = await fetch(`${baseUrl}/orders/${order.id}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        onUpdateStatus(newStatus);
        alert(`Status diubah menjadi ${newStatus}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMessage = async (messageId: number) => {
    if (!confirm('Hapus pesan ini?')) return;
    
    try {
      const res = await fetch(`${baseUrl}/messages/${messageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      if (res.ok) {
        setMessages(prev => prev.filter(m => m.id !== messageId));
      } else {
        const data = await res.json();
        alert(data.message || 'Gagal menghapus pesan.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="chat-modal">
        <div className="chat-header">
          <div className="chat-title">
            <h3>{order.jasa?.title || 'Pesanan'}</h3>
            <span className={`status-badge status-${order.status}`}>
              {order.status === 'negotiating' ? 'Nego' : 
               order.status === 'accepted' ? 'Diterima' : 
               order.status === 'rejected' ? 'Ditolak' : 'Selesai'}
            </span>
          </div>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        {isProvider && order.status === 'negotiating' && (
          <div className="chat-actions">
            <button className="btn-accept" onClick={() => handleStatusChange('accepted')}>Terima Pesanan</button>
            <button className="btn-reject" onClick={() => handleStatusChange('rejected')}>Tolak</button>
          </div>
        )}
        
        {isProvider && order.status === 'accepted' && (
          <div className="chat-actions">
            <button className="btn-complete" onClick={() => handleStatusChange('completed')}>Tandai Selesai</button>
          </div>
        )}

        <div className="chat-messages">
          {messages.map((msg) => {
            let isMe = false;
            
            // Safe IDs
            const providerUserId = order.jasa?.penyedia?.user?.id;
            const seekerUserId = order.pencari_jasa?.user?.id;

            if (isProvider) {
              // Viewing as provider
              if (providerUserId) {
                isMe = msg.sender_id === providerUserId;
              } else {
                isMe = msg.sender_id === currentUser.id;
              }
            } else {
              // Viewing as seeker
              if (seekerUserId) {
                isMe = msg.sender_id === seekerUserId;
              } else {
                isMe = msg.sender_id === currentUser.id;
              }
            }
            
            // Format time
            const date = new Date(msg.created_at);
            const timeString = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

            return (
              <div key={msg.id} className={`chat-bubble-container ${isMe ? 'me' : 'them'}`}>
                {!isMe && <div className="chat-sender">{msg.sender?.name || 'User'}</div>}
                <div className="chat-bubble">
                  {msg.content}
                  <div className="chat-time">
                    {timeString}
                  </div>
                  {isMe && (
                    <button 
                      className="delete-msg-btn" 
                      onClick={() => handleDeleteMessage(msg.id)}
                      title="Hapus Pesan"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <form className="chat-input-area" onSubmit={handleSend}>
          <input 
            type="text" 
            placeholder="Ketik pesan..." 
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            disabled={loading || order.status === 'completed' || order.status === 'rejected'}
          />
          <button type="submit" disabled={loading || !newMessage.trim() || order.status === 'completed' || order.status === 'rejected'}>
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}
