'use client';

import { Suspense, useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { chatApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface Conversation {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  sender: { id: string; fullName: string };
  receiver: { id: string; fullName: string };
}

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

function ChatContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, token } = useAuth();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserName, setSelectedUserName] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!token) router.push('/auth/login');
  }, [token, router]);

  useEffect(() => {
    if (!token) return;
    const fetch = async () => {
      try {
        const res: any = await chatApi.getConversations(token);
        setConversations(res);
      } catch { /* ignore */ }
      finally { setLoading(false); }
    };
    fetch();
  }, [token]);

  useEffect(() => {
    const to = searchParams.get('to');
    const name = searchParams.get('name');
    if (to) {
      setSelectedUserId(to);
      if (name) setSelectedUserName(name);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!token || !selectedUserId) return;
    const fetchMessages = async () => {
      try {
        const res: any = await chatApi.getMessages(selectedUserId, token);
        setMessages(res.data || res);
      } catch { /* ignore */ }
    };
    fetchMessages();
    pollRef.current = setInterval(fetchMessages, 5000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [token, selectedUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSelectConversation = (conv: Conversation) => {
    const otherId = conv.senderId === user?.id ? conv.receiverId : conv.senderId;
    const otherName = conv.senderId === user?.id ? conv.receiver?.fullName : conv.sender?.fullName;
    setSelectedUserId(otherId);
    setSelectedUserName(otherName || 'User');
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedUserId || !token || sending) return;
    setSending(true);
    try {
      const productId = searchParams.get('product') || undefined;
      await chatApi.sendMessage({ receiverId: selectedUserId, message: newMessage.trim(), productId }, token);
      setNewMessage('');
      const res: any = await chatApi.getMessages(selectedUserId, token);
      setMessages(res.data || res);
    } catch { /* ignore */ }
    finally { setSending(false); }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const isToday = d.toDateString() === new Date().toDateString();
    if (isToday) return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) + ' ' + d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  if (!token) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-6">
        <span className="inline-block bg-ocean-100 text-ocean-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-3">Chat</span>
        <h1 className="text-2xl font-bold text-ocean-950">Pesan</h1>
        <p className="text-slate-400 text-sm mt-1">Chat langsung dengan buyer atau seller</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex" style={{ height: 'calc(100vh - 260px)', minHeight: '500px' }}>
        {/* Conversation List */}
        <div className="w-80 border-r border-slate-100 flex flex-col flex-shrink-0">
          <div className="p-4 border-b border-slate-100">
            <h2 className="font-semibold text-ocean-950 text-sm">Percakapan</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="text-center py-10">
                <div className="inline-block w-6 h-6 border-2 border-ocean-200 border-t-ocean-600 rounded-full animate-spin" />
              </div>
            ) : conversations.length === 0 ? (
              <div className="text-center py-10 px-4">
                <div className="text-3xl mb-2">💬</div>
                <p className="text-slate-400 text-sm">Belum ada percakapan</p>
              </div>
            ) : (
              conversations.map((conv) => {
                const otherId = conv.senderId === user?.id ? conv.receiverId : conv.senderId;
                const otherName = conv.senderId === user?.id ? conv.receiver?.fullName : conv.sender?.fullName;
                const isActive = selectedUserId === otherId;
                const isUnread = !conv.isRead && conv.receiverId === user?.id;
                return (
                  <button
                    key={conv.conversationId}
                    onClick={() => handleSelectConversation(conv)}
                    className={`w-full text-left px-4 py-3.5 border-b border-slate-50 transition hover:bg-ocean-50/50 ${isActive ? 'bg-ocean-50 border-l-2 border-l-ocean-500' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ocean-400 to-teal-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {otherName?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={`text-sm truncate ${isUnread ? 'font-bold text-ocean-950' : 'font-medium text-slate-700'}`}>
                            {otherName || 'User'}
                          </p>
                          <span className="text-xs text-slate-400 flex-shrink-0 ml-2">{formatTime(conv.createdAt)}</span>
                        </div>
                        <p className={`text-xs truncate mt-0.5 ${isUnread ? 'text-ocean-700 font-medium' : 'text-slate-400'}`}>
                          {conv.senderId === user?.id ? 'Anda: ' : ''}{conv.message}
                        </p>
                      </div>
                      {isUnread && <div className="w-2.5 h-2.5 rounded-full bg-ocean-500 flex-shrink-0" />}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Message Panel */}
        <div className="flex-1 flex flex-col">
          {selectedUserId ? (
            <>
              <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-ocean-400 to-teal-400 flex items-center justify-center text-white font-bold text-sm">
                  {selectedUserName?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <p className="font-semibold text-ocean-950">{selectedUserName || 'User'}</p>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
                {messages.length === 0 ? (
                  <div className="text-center py-10">
                    <div className="text-3xl mb-2">👋</div>
                    <p className="text-slate-400 text-sm">Mulai percakapan</p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMine = msg.senderId === user?.id;
                    return (
                      <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                          isMine
                            ? 'bg-gradient-to-r from-ocean-500 to-teal-500 text-white rounded-br-md'
                            : 'bg-slate-100 text-slate-700 rounded-bl-md'
                        }`}>
                          <p className="whitespace-pre-wrap break-words">{msg.message}</p>
                          <p className={`text-[10px] mt-1 ${isMine ? 'text-white/60' : 'text-slate-400'}`}>
                            {formatTime(msg.createdAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="px-6 py-4 border-t border-slate-100">
                <div className="flex items-end gap-3">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Tulis pesan..."
                    rows={1}
                    className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-ocean-400 focus:border-transparent outline-none transition text-sm resize-none"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!newMessage.trim() || sending}
                    className="px-5 py-2.5 bg-gradient-to-r from-ocean-500 to-teal-500 text-white rounded-xl font-medium text-sm hover:from-ocean-400 hover:to-teal-400 transition-all disabled:opacity-50 shadow-md shadow-ocean-500/20"
                  >
                    {sending ? '...' : 'Kirim'}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="text-5xl mb-4">💬</div>
                <p className="text-slate-400 text-lg font-medium">Pilih percakapan</p>
                <p className="text-slate-400 text-sm mt-1">atau mulai chat dari halaman marketplace</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="text-center py-20">
        <div className="inline-block w-8 h-8 border-3 border-ocean-200 border-t-ocean-600 rounded-full animate-spin mb-4" />
        <p className="text-slate-400">Memuat chat...</p>
      </div>
    }>
      <ChatContent />
    </Suspense>
  );
}
