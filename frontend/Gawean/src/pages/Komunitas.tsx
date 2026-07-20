import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Send, Trash2, Plus, Hash, Users, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import './Dashboard.css';
import './Komunitas.css';

interface ChannelData {
  id: number;
  name: string;
  description: string;
  icon: string;
  messages_count: number;
  creator?: { id: number; name: string };
}

interface MessageUser {
  id: number;
  name: string;
  profile_photo: string | null;
}

interface MessageData {
  id: number;
  channel_id: number;
  user_id: number;
  content: string;
  created_at: string;
  user: MessageUser;
}

const EMOJI_OPTIONS = ['💬', '💻', '🎨', '📝', '💼', '🎮', '📚', '🎵', '🔧', '🌍', '🚀', '⚡'];

// Dummy messages to populate channels
const DUMMY_MESSAGES: { channelName: string; messages: { user: string; content: string; time: string }[] }[] = [
  {
    channelName: 'Lounge',
    messages: [
      { user: 'Rangga D.', content: 'Halo semuanya! Ada yang lagi cari partner buat proyek akhir semester?', time: '08:15' },
      { user: 'Sinta A.', content: 'Halo Rangga! Aku lagi cari yang bisa bantu desain UI untuk aplikasi mobile 😊', time: '08:22' },
      { user: 'Farhan H.', content: 'Wah aku bisa bantu tuh, biasa pake Figma. DM aja ya!', time: '08:30' },
      { user: 'Dian P.', content: 'Guys ada yang tau workflow buat ngerjain freelance sambil kuliah biar ga keteteran?', time: '09:05' },
      { user: 'Rangga D.', content: 'Biasanya aku pake Notion buat atur jadwal, terus komunikasi sama klien lewat sini', time: '09:12' },
      { user: 'Budi S.', content: 'Kalau aku pakai Trello buat track progress, lumayan rapi sih', time: '09:18' },
      { user: 'Sinta A.', content: 'Setuju! Time management itu paling penting sih kalau mau freelance sambil kuliah 💪', time: '09:25' },
      { user: 'Mega L.', content: 'Halo semua, baru gabung nih. Salam kenal! Aku dari Teknik Informatika UGM 🙌', time: '10:00' },
      { user: 'Farhan H.', content: 'Welcome Mega! Salam kenal juga, aku dari SI Undip', time: '10:05' },
      { user: 'Dian P.', content: 'Salam kenal Mega! Disini pada ramah kok, jangan sungkan ya', time: '10:08' },
    ]
  },
  {
    channelName: 'Coding & Web',
    messages: [
      { user: 'Farhan H.', content: 'Ada yang pernah deploy Next.js ke Vercel? Aku dapet error pas build 😭', time: '07:30' },
      { user: 'Budi S.', content: 'Error-nya apa Farhan? Biasanya masalah environment variable tuh', time: '07:35' },
      { user: 'Farhan H.', content: 'Module not found: Can\'t resolve \'@/components/ui\'. Padahal di local jalan', time: '07:38' },
      { user: 'Rangga D.', content: 'Cek tsconfig.json nya, path alias kadang beda behavior di build vs dev', time: '07:42' },
      { user: 'Budi S.', content: 'Betul kata Rangga, tambahin juga di next.config.js kalau perlu. Aku pernah kena juga', time: '07:45' },
      { user: 'Mega L.', content: 'Guys, recommend stack buat portfolio website dong? Yang ringan tapi keren', time: '08:00' },
      { user: 'Farhan H.', content: 'Astro + Tailwind 👌 Static site jadi super cepet', time: '08:05' },
      { user: 'Rangga D.', content: 'Atau pakai Vite + React aja kalau mau interaktif. Deploy ke Netlify gratis', time: '08:10' },
      { user: 'Dian P.', content: 'Ada yang mau pair programming Laravel? Aku lagi belajar API authentication', time: '09:00' },
      { user: 'Budi S.', content: 'Aku bisa bantu! Sanctum atau Passport? Kalau SPA mending Sanctum', time: '09:08' },
      { user: 'Dian P.', content: 'Sanctum dong, ini buat proyek React + Laravel. Thanks Budi! 🙏', time: '09:12' },
    ]
  },
  {
    channelName: 'Desain & Kreatif',
    messages: [
      { user: 'Sinta A.', content: 'Baru selesai redesign landing page buat klien pertama aku! Seneng banget ✨', time: '10:00' },
      { user: 'Rangga D.', content: 'Congrats Sinta! Share dong hasilnya, pengen liat', time: '10:05' },
      { user: 'Mega L.', content: 'Keren! Pakai tools apa biasanya?', time: '10:08' },
      { user: 'Sinta A.', content: 'Figma buat wireframe & high-fi, terus Photoshop buat asset gambar', time: '10:12' },
      { user: 'Dian P.', content: 'Ada rekomendasi plugin Figma yang wajib punya ga?', time: '10:30' },
      { user: 'Sinta A.', content: 'Auto Layout, Iconify, dan Unsplash plugin itu must have sih 👍', time: '10:35' },
      { user: 'Rangga D.', content: 'Tambahin Stark buat accessibility check juga, klien suka banget', time: '10:40' },
      { user: 'Budi S.', content: 'Guys ada yang bisa bikin ilustrasi custom? Butuh buat proyek startup nih', time: '11:00' },
      { user: 'Mega L.', content: 'Aku bisa! Biasanya pakai Procreate + Illustrator. DM aku ya detailnya', time: '11:10' },
    ]
  },
  {
    channelName: 'Tulis & Translate',
    messages: [
      { user: 'Sinta A.', content: 'Ada yang berpengalaman translate jurnal akademik? Aku dapet proyek 20 halaman', time: '13:00' },
      { user: 'Dian P.', content: 'Aku pernah! Tips: jangan translate per kata, pahami konteks paragraf dulu baru tulis ulang', time: '13:10' },
      { user: 'Mega L.', content: 'Rate biasanya berapa ya buat translate akademik per halaman?', time: '13:15' },
      { user: 'Sinta A.', content: 'Di Gawean rata-rata Rp30-50rb per halaman, tergantung complexity', time: '13:20' },
      { user: 'Budi S.', content: 'Jangan lupa pakai Grammarly Premium buat quality check, worth it banget', time: '13:25' },
      { user: 'Dian P.', content: 'Atau QuillBot buat paraphrasing. Aku langganan yang premium, recommended!', time: '13:30' },
      { user: 'Rangga D.', content: 'Ada yang bisa proofreading proposal skripsi? Budget Rp100rb 🙏', time: '14:00' },
      { user: 'Sinta A.', content: 'Aku bisa Rangga! Berapa halaman dan deadline-nya kapan?', time: '14:05' },
    ]
  },
  {
    channelName: 'Lowongan Freelance',
    messages: [
      { user: 'Budi S.', content: '🔥 Ada proyek website company profile, budget Rp2jt. Stack bebas, deadline 2 minggu. Yang minat reply ya!', time: '09:00' },
      { user: 'Farhan H.', content: 'Minat! Aku bisa pakai Laravel + React. DM detail requirement-nya dong', time: '09:10' },
      { user: 'Rangga D.', content: 'Butuh desainer UI/UX buat redesign app mobile. Budget Rp1.5jt, timeline 10 hari. Ada yang available?', time: '10:00' },
      { user: 'Sinta A.', content: 'Aku available! Portfolio bisa dicek di profil Gawean aku ya', time: '10:15' },
      { user: 'Dian P.', content: 'Info: kampus aku buka lowongan asisten lab buat yang jago Python & Data Science. Rp500rb/bulan', time: '11:00' },
      { user: 'Mega L.', content: 'Wah menarik! Itu apply dimana Dian?', time: '11:10' },
      { user: 'Dian P.', content: 'Langsung ke lab Komputasi lantai 3, bawa CV + portfolio ya', time: '11:15' },
      { user: 'Budi S.', content: '💡 Tips: kalau mau dapet proyek freelance pertama, mulai dari harga terjangkau dulu buat bangun portofolio', time: '12:00' },
      { user: 'Farhan H.', content: 'Setuju! Aku dulu mulai dari Rp200rb per proyek, sekarang udah bisa charge Rp3jt++ 🚀', time: '12:10' },
      { user: 'Sinta A.', content: 'Konsistensi dan kualitas itu kunci ya. Keep grinding everyone! 💪', time: '12:15' },
    ]
  },
];

export default function Komunitas() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const currentUser = userStr ? JSON.parse(userStr) : null;

  const [channels, setChannels] = useState<ChannelData[]>([]);
  const [activeChannel, setActiveChannel] = useState<ChannelData | null>(null);
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelDesc, setNewChannelDesc] = useState('');
  const [newChannelIcon, setNewChannelIcon] = useState('💬');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [filter, setFilter] = useState<'all' | 'mine'>('all');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<number | null>(null);

  const userName = currentUser?.name || 'User';
  const initial = userName.charAt(0).toUpperCase();
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
  const storageUrl = baseUrl.replace('/api', '') + '/storage/';

  const photoUrl = currentUser?.profile_photo
    ? (currentUser.profile_photo.startsWith('http') ? currentUser.profile_photo : `${storageUrl}${currentUser.profile_photo}`)
    : null;

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchChannels();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (activeChannel) {
      if (pollRef.current) clearInterval(pollRef.current);
      pollRef.current = window.setInterval(() => {
        fetchMessages(activeChannel.id, true);
      }, 3000);
    }
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
    // eslint-disable-next-line
  }, [activeChannel?.id]);

  useEffect(() => {
    if (!activeChannel) return;
    // Bot otomatis yang ikut meramaikan komunitas (di semua tab)
    const botInterval = setInterval(() => {
      const botReplies = [
        'Wah, keren banget! Lanjutkan kawan! 🔥',
        'Ada yang lagi cari project freelance juga kah?',
        'Halo semuanya! Semangat ngoding/design ya!',
        'Gawean.io makin rame aja nih, mantap 👍',
        'Btw ada yang punya info loker WFH?',
        'Jangan lupa istirahat, kesehatan nomor satu ☕',
        'Gas terus sampai sukses! 🚀',
        'Siapa yang lagi begadang ngerjain project angkat tangan 🙋‍♂️',
        'Ada tips buat dapetin klien pertama nggak suhu?',
        'Komunitas yang supportif banget, thx all!'
      ];
      const randomReply = botReplies[Math.floor(Math.random() * botReplies.length)];
      
      fetch(`${baseUrl}/community/channels/${activeChannel.id}/bot-messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ content: randomReply })
      }).then(res => {
        if (res.ok) fetchMessages(activeChannel.id, true);
      }).catch(err => console.error('Failed to send bot message:', err));
    }, 15000);

    return () => clearInterval(botInterval);
  }, [activeChannel]);

  const fetchChannels = async () => {
    try {
      const res = await fetch(`${baseUrl}/community/channels`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      });
      if (res.ok) {
        const data = await res.json();
        setChannels(data);
        if (data.length > 0 && !activeChannel) {
          selectChannel(data[0]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch channels:', err);
    }
  };

  const selectChannel = (channel: ChannelData) => {
    setActiveChannel(channel);
    setMessages([]);
    fetchMessages(channel.id);
  };

  // Get dummy messages for a channel name
  const getDummyMessages = (channelName: string): MessageData[] => {
    const group = DUMMY_MESSAGES.find(g => g.channelName === channelName);
    if (!group) return [];
    const today = new Date();
    return group.messages.map((msg, i) => ({
      id: -(i + 1), // negative IDs to distinguish from real
      channel_id: 0,
      user_id: -(i + 1),
      content: msg.content,
      created_at: `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}T${msg.time}:00`,
      user: { id: -(i + 1), name: msg.user, profile_photo: null },
    }));
  };

  const fetchMessages = async (channelId: number, silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/community/channels/${channelId}/messages`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      });
      if (res.ok) {
        const data = await res.json();
        const realMessages: MessageData[] = data.messages;
        
        let shouldScroll = false;

        setMessages(prev => {
          if (realMessages.length > prev.length) {
             shouldScroll = true;
          }
          if (realMessages.length === 0 && data.channel) {
            return getDummyMessages(data.channel.name);
          }
          return realMessages;
        });

        setTimeout(() => {
          if (shouldScroll || !silent) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChannel) return;

    const content = newMessage.trim();
    setNewMessage('');

    try {
      const res = await fetch(`${baseUrl}/community/channels/${activeChannel.id}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ content })
      });
      if (res.ok) {
        // Refetch all messages (will now include real ones, removing dummies)
        fetchMessages(activeChannel.id, true);
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const handleDeleteChannel = async (channelId: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus komunitas ini?')) return;
    try {
      const res = await fetch(`${baseUrl}/community/channels/${channelId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      });
      if (res.ok) {
        setChannels(prev => prev.filter(c => c.id !== channelId));
        if (activeChannel?.id === channelId) {
          setActiveChannel(null);
          setMessages([]);
        }
      }
    } catch (err) {
      console.error('Failed to delete channel:', err);
    }
  };

  const handleDeleteMessage = async (msgId: number) => {
    if (msgId < 0) return; // Can't delete dummy messages
    try {
      const res = await fetch(`${baseUrl}/community/messages/${msgId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      });
      if (res.ok) {
        setMessages(prev => prev.filter(m => m.id !== msgId));
      }
    } catch (err) {
      console.error('Failed to delete message:', err);
    }
  };

  const handleCreateChannel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChannelName.trim()) return;

    try {
      const res = await fetch(`${baseUrl}/community/channels`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: newChannelName.trim(),
          description: newChannelDesc.trim(),
          icon: newChannelIcon,
        })
      });
      if (res.ok) {
        const channel = await res.json();
        setChannels(prev => [...prev, channel]);
        selectChannel(channel);
        setShowCreateModal(false);
        setNewChannelName('');
        setNewChannelDesc('');
        setNewChannelIcon('💬');
      }
    } catch (err) {
      console.error('Failed to create channel:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getColorClass = (userId: number) => {
    const idx = Math.abs(userId) % 7;
    return `color-${idx}`;
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (d.toDateString() === today.toDateString()) return 'Hari Ini';
    if (d.toDateString() === yesterday.toDateString()) return 'Kemarin';
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  // Group messages by date
  const groupedMessages: { date: string; msgs: MessageData[] }[] = [];
  messages.forEach(msg => {
    const dateKey = new Date(msg.created_at).toDateString();
    const lastGroup = groupedMessages[groupedMessages.length - 1];
    if (lastGroup && lastGroup.date === dateKey) {
      lastGroup.msgs.push(msg);
    } else {
      groupedMessages.push({ date: dateKey, msgs: [msg] });
    }
  });

  return (
    <div className={`pencari-wrapper ${isSidebarCollapsed ? 'collapsed' : ''}`} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--dash-bg)' }}>
      {/* Navbar — same as DashboardPencari */}
      <nav className="user-dash-nav">
        <div className="user-nav-brand">
          Gaw<span>ean</span>
        </div>
        <div className="user-nav-links">
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/dashboard-pencari'); }}>Cari Jasa</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/dashboard-pencari'); }}>Pesanan & Chat</a>
          <a href="#" className="active">Komunitas</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/dashboard-pencari'); }}>Profil Saya</a>
        </div>
        <div className="user-nav-right">
          <div className="notification-bell"></div>
          {photoUrl ? (
            <img src={photoUrl} alt="Profile" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            <div className="nav-user-avatar">{initial}</div>
          )}
          <span className="nav-user-name">{userName}</span>
          <button onClick={handleLogout} className="nav-logout-btn">
            <LogOut size={14} /> Keluar
          </button>
        </div>
      </nav>

      {/* Main Layout — same structure as DashboardPencari */}
      <div className="pencari-layout">
        {/* Sidebar — Channel List */}
        <aside className="pencari-sidebar">
          <div className="sidebar-header">
            <div className="sidebar-section-title">Channel</div>
            <button
              className="sidebar-toggle-btn"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              title={isSidebarCollapsed ? "Perlebar Sidebar" : "Persempit Sidebar"}
            >
              {isSidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          </div>
          <div className="sidebar-section-sub">Pilih channel diskusi</div>

          {!isSidebarCollapsed && (
            <div style={{ padding: '0 1rem', marginBottom: '1rem', display: 'flex', gap: '8px' }}>
              <button 
                onClick={() => setFilter('all')}
                style={{ flex: 1, padding: '6px', borderRadius: '6px', border: 'none', background: filter === 'all' ? 'var(--primary-color)' : 'transparent', color: filter === 'all' ? '#fff' : 'var(--dash-text-muted)', cursor: 'pointer', fontSize: '0.85rem' }}
              >
                Semua
              </button>
              <button 
                onClick={() => setFilter('mine')}
                style={{ flex: 1, padding: '6px', borderRadius: '6px', border: 'none', background: filter === 'mine' ? 'var(--primary-color)' : 'transparent', color: filter === 'mine' ? '#fff' : 'var(--dash-text-muted)', cursor: 'pointer', fontSize: '0.85rem' }}
              >
                Komunitasku
              </button>
            </div>
          )}

          <ul className="category-list">
            {channels.filter(ch => filter === 'all' || ch.creator?.id === currentUser?.id).map(ch => (
              <li
                key={ch.id}
                className={activeChannel?.id === ch.id ? 'active' : ''}
                onClick={() => selectChannel(ch)}
                title={isSidebarCollapsed ? ch.name : ch.description || ch.name}
              >
                <span className="cat-icon" style={{ fontSize: '1.1rem' }}>{ch.icon}</span>
                <span className="cat-label">{ch.name}</span>
                {ch.messages_count > 0 && !isSidebarCollapsed && (
                  <span className="kom-msg-count">{ch.messages_count}</span>
                )}
              </li>
            ))}
          </ul>

          <div className="sidebar-bottom">
            <button
              className="sidebar-cta"
              onClick={() => setShowCreateModal(true)}
              title={isSidebarCollapsed ? "Buat Channel" : ""}
            >
              <span className="cta-label"><Plus size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />Buat Channel Baru</span>
              {isSidebarCollapsed && <Plus size={16} />}
            </button>
          </div>
        </aside>

        {/* Main Content — Chat Area */}
        <main className="pencari-main" style={{ padding: 0, display: 'flex', flexDirection: 'column' }}>
          {activeChannel ? (
            <>
              {/* Chat Header */}
              <div className="kom-chat-header">
                <div className="kom-chat-header-left">
                  <span className="kom-header-icon">{activeChannel.icon}</span>
                  <h2>{activeChannel.name}</h2>
                  {activeChannel.description && (
                    <span className="kom-header-desc">{activeChannel.description}</span>
                  )}
                </div>
                <div className="kom-chat-header-right" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div className="kom-member-badge">
                    <Users size={14} />
                    <span>{messages.length} pesan</span>
                  </div>
                  {activeChannel.creator?.id === currentUser?.id && (
                    <button 
                      onClick={() => handleDeleteChannel(activeChannel.id)}
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px', borderRadius: '6px' }}
                      title="Hapus Komunitas"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>

              {/* Messages */}
              {loading ? (
                <div className="kom-loading"><div className="kom-spinner"></div></div>
              ) : messages.length === 0 ? (
                <div className="kom-welcome">
                  <div className="kom-welcome-icon">{activeChannel.icon}</div>
                  <h2>Selamat datang di #{activeChannel.name}!</h2>
                  <p>{activeChannel.description || 'Mulai diskusi dengan mengirim pesan pertama.'}</p>
                </div>
              ) : (
                <div className="kom-messages">
                  {groupedMessages.map(group => (
                    <div key={group.date}>
                      <div className="kom-date-divider">
                        <span>{formatDate(group.msgs[0].created_at)}</span>
                      </div>
                      {group.msgs.map(msg => {
                        const colorCls = getColorClass(msg.user_id);
                        const isMe = msg.user_id === currentUser?.id;
                        const isDummy = msg.id < 0;
                        const userPhoto = msg.user?.profile_photo
                          ? (msg.user.profile_photo.startsWith('http') ? msg.user.profile_photo : `${storageUrl}${msg.user.profile_photo}`)
                          : null;

                        return (
                          <div className={`kom-msg-row ${isMe ? 'msg-me' : 'msg-other'}`} key={msg.id}>
                            <div className={`kom-msg-avatar ${colorCls}`}>
                              {userPhoto ? (
                                <img src={userPhoto} alt={msg.user?.name} />
                              ) : (
                                (msg.user?.name || 'U').charAt(0).toUpperCase()
                              )}
                            </div>
                            <div className="kom-msg-body">
                              <div className="kom-msg-header">
                                <span className={`kom-msg-username ${colorCls}`}>{msg.user?.name || 'User'}</span>
                                <span className="kom-msg-time">{formatTime(msg.created_at)}</span>
                              </div>
                              <div className="kom-msg-content">{msg.content}</div>
                            </div>
                            {isMe && !isDummy && (
                              <button
                                className="kom-msg-delete"
                                onClick={() => handleDeleteMessage(msg.id)}
                                title="Hapus pesan"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}

              {/* Message Input */}
              <div className="kom-input-area">
                <form className="kom-input-form" onSubmit={handleSendMessage}>
                  <MessageCircle size={18} className="kom-input-icon" />
                  <input
                    type="text"
                    placeholder={`Kirim pesan di #${activeChannel.name}...`}
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    maxLength={2000}
                  />
                  <button type="submit" className="kom-send-btn" disabled={!newMessage.trim()}>
                    <Send size={18} />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="kom-welcome">
              <div className="kom-welcome-icon">💬</div>
              <h2>Pilih Channel</h2>
              <p>Pilih channel dari sidebar untuk mulai berdiskusi dengan sesama mahasiswa freelancer.</p>
            </div>
          )}
        </main>
      </div>

      {/* Footer removed for community page */}

      {/* Create Channel Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 440 }}>
            <h3 style={{ fontFamily: '"Space Grotesk", sans-serif', marginBottom: 4 }}>Buat Channel Baru</h3>
            <p style={{ color: 'var(--dash-text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Channel adalah tempat diskusi untuk topik tertentu.
            </p>

            <form onSubmit={handleCreateChannel}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label className="kom-modal-label">Icon</label>
                <div className="kom-emoji-row">
                  {EMOJI_OPTIONS.map(emoji => (
                    <button
                      type="button"
                      key={emoji}
                      className={`kom-emoji-btn ${newChannelIcon === emoji ? 'selected' : ''}`}
                      onClick={() => setNewChannelIcon(emoji)}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label className="kom-modal-label">Nama Channel</label>
                <input
                  type="text"
                  placeholder="contoh: React Discussion"
                  value={newChannelName}
                  onChange={e => setNewChannelName(e.target.value)}
                  maxLength={50}
                  required
                  className="kom-modal-input"
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label className="kom-modal-label">Deskripsi (opsional)</label>
                <textarea
                  placeholder="Jelaskan topik diskusi channel ini..."
                  value={newChannelDesc}
                  onChange={e => setNewChannelDesc(e.target.value)}
                  maxLength={255}
                  className="kom-modal-textarea"
                />
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button type="button" className="kom-btn-cancel" onClick={() => setShowCreateModal(false)}>
                  Batal
                </button>
                <button type="submit" className="btn-primary-dash" disabled={!newChannelName.trim()}>
                  <Hash size={16} /> Buat Channel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
