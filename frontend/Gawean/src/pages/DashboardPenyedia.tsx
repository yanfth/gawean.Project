import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  Settings,
  LogOut,
  Plus,
  Edit,
  Trash2,
  TrendingUp,
  Users,
  Star,
  Upload,
  ShieldCheck,
  AlertTriangle,

  ImageIcon,
  FileText,
  ChevronLeft,
  MessageSquare,
  ShoppingCart
} from 'lucide-react';
import ChatModal from '../components/ChatModal';
import './Dashboard.css';

interface Jasa {
  id: number;
  title: string;
  category: string;
  description: string;
  price: string;
  image: string | null;
}

interface Testimonial {
  id: number;
  client_name: string;
  content: string;
  rating: number;
}

type ActiveView = 'dashboard' | 'settings' | 'orders';

export default function DashboardPenyedia() {
  const navigate = useNavigate();
  const [jasaList, setJasaList] = useState<Jasa[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJasa, setEditingJasa] = useState<Jasa | null>(null);
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');

  const [orders, setOrders] = useState<any[]>([]);
  const [activeOrder, setActiveOrder] = useState<any>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Verification — initialize from cached user data
  const [isVerified, setIsVerified] = useState(() => {
    try {
      const cached = localStorage.getItem('user');
      if (cached) {
        const parsed = JSON.parse(cached);
        return parsed?.penyedia_jasa?.is_verified || parsed?.is_verified || false;
      }
    } catch { /* ignore */ }
    return false;
  });
  const [, setVerificationDoc] = useState<string | null>(null);
  const [verifyFile, setVerifyFile] = useState<File | null>(null);
  const [verifyUploading, setVerifyUploading] = useState(false);

  // Testimonials
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [testiModalOpen, setTestiModalOpen] = useState(false);
  const [editingTesti, setEditingTesti] = useState<Testimonial | null>(null);
  const [testiClientName, setTestiClientName] = useState('');
  const [testiContent, setTestiContent] = useState('');
  const [testiRating, setTestiRating] = useState(5);

  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const userName = user?.name || 'Penyedia';
  const initial = userName.charAt(0).toUpperCase();
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
  const storageUrl = baseUrl.replace('/api', '') + '/storage/';

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    fetchJasa();
    fetchVerificationStatus();
    fetchTestimonials();
    fetchOrders();
    // eslint-disable-next-line
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${baseUrl}/orders`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data.as_penyedia);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  const handleDeleteOrder = async (orderId: number) => {
    if (!confirm('Hapus seluruh chat dan pesanan ini?')) return;
    try {
      const res = await fetch(`${baseUrl}/orders/${orderId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      if (res.ok) {
        setOrders(prev => prev.filter(o => o.id !== orderId));
      } else {
        const data = await res.json();
        alert(data.message || 'Gagal menghapus chat.');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan pada server.');
    }
  };

  // ---- Data Fetching ----
  const fetchJasa = async () => {
    try {
      const res = await fetch(`${baseUrl}/jasa`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      });
      if (res.ok) {
        const data = await res.json();
        setJasaList(data);
      } else if (res.status === 401 || res.status === 403) {
        navigate('/login');
      }
    } catch (error) {
      console.error("Failed to fetch jasa:", error);
    }
  };

  const fetchVerificationStatus = async () => {
    try {
      const res = await fetch(`${baseUrl}/verification/status`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      });
      if (res.ok) {
        const data = await res.json();
        setIsVerified(data.is_verified);
        setVerificationDoc(data.verification_doc);
        // Sync to localStorage so it persists across page reloads
        updateLocalStorageVerification(data.is_verified);
      }
    } catch (error) {
      console.error("Failed to fetch verification:", error);
    }
  };

  const updateLocalStorageVerification = (verified: boolean) => {
    try {
      const cached = localStorage.getItem('user');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.penyedia_jasa) {
          parsed.penyedia_jasa.is_verified = verified;
        }
        parsed.is_verified = verified;
        localStorage.setItem('user', JSON.stringify(parsed));
      }
    } catch { /* ignore */ }
  };

  const fetchTestimonials = async () => {
    try {
      const res = await fetch(`${baseUrl}/testimonials`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      });
      if (res.ok) {
        const data = await res.json();
        setTestimonials(data);
      }
    } catch (error) {
      console.error("Failed to fetch testimonials:", error);
    }
  };

  // ---- Auth ----
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // ---- Jasa CRUD ----
  const openModal = (jasa: Jasa | null = null) => {
    if (jasa) {
      setEditingJasa(jasa);
      setTitle(jasa.title);
      setCategory(jasa.category || '');
      setDescription(jasa.description || '');
      setPrice(jasa.price || '');
      setImagePreview(jasa.image ? storageUrl + jasa.image : null);
      setImageFile(null);
    } else {
      setEditingJasa(null);
      setTitle('');
      setCategory('');
      setDescription('');
      setPrice('');
      setImageFile(null);
      setImagePreview(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setImageFile(null);
    setImagePreview(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingJasa ? 'POST' : 'POST';
      const url = editingJasa
        ? `${baseUrl}/jasa/${editingJasa.id}`
        : `${baseUrl}/jasa`;

      const formData = new FormData();
      formData.append('title', title);
      formData.append('category', category);
      formData.append('description', description);
      formData.append('price', price);
      if (imageFile) {
        formData.append('image', imageFile);
      }
      if (editingJasa) {
        formData.append('_method', 'PUT');
      }

      const res = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: formData
      });

      if (res.ok) {
        fetchJasa();
        closeModal();
      } else {
        const data = await res.json().catch(() => null);
        alert(data?.message || "Gagal menyimpan jasa.");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Yakin ingin menghapus jasa ini?')) return;
    try {
      const res = await fetch(`${baseUrl}/jasa/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      });
      if (res.ok) fetchJasa();
    } catch (error) {
      console.error(error);
    }
  };

  // ---- Verification ----
  const handleVerificationUpload = async () => {
    if (!verifyFile) return;
    setVerifyUploading(true);
    try {
      const formData = new FormData();
      formData.append('document', verifyFile);
      const res = await fetch(`${baseUrl}/verification/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        setIsVerified(data.is_verified);
        setVerificationDoc(data.verification_doc);
        setVerifyFile(null);
        // Persist verification to localStorage
        updateLocalStorageVerification(data.is_verified);
        alert('Verifikasi berhasil! Anda sekarang bisa posting jasa.');
      } else {
        const data = await res.json().catch(() => null);
        alert(data?.message || 'Gagal upload dokumen.');
      }
    } catch (error) {
      console.error(error);
      alert('Terjadi kesalahan saat upload.');
    } finally {
      setVerifyUploading(false);
    }
  };

  // ---- Testimonials CRUD ----
  const openTestiModal = (testi: Testimonial | null = null) => {
    if (testi) {
      setEditingTesti(testi);
      setTestiClientName(testi.client_name);
      setTestiContent(testi.content);
      setTestiRating(testi.rating);
    } else {
      setEditingTesti(null);
      setTestiClientName('');
      setTestiContent('');
      setTestiRating(5);
    }
    setTestiModalOpen(true);
  };

  const handleSaveTesti = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingTesti ? 'PUT' : 'POST';
      const url = editingTesti
        ? `${baseUrl}/testimonials/${editingTesti.id}`
        : `${baseUrl}/testimonials`;

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          client_name: testiClientName,
          content: testiContent,
          rating: testiRating
        })
      });

      if (res.ok) {
        fetchTestimonials();
        setTestiModalOpen(false);
      } else {
        alert("Gagal menyimpan testimoni.");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan.");
    }
  };

  const handleDeleteTesti = async (id: number) => {
    if (!window.confirm('Yakin ingin menghapus testimoni ini?')) return;
    try {
      const res = await fetch(`${baseUrl}/testimonials/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      });
      if (res.ok) fetchTestimonials();
    } catch (error) {
      console.error(error);
    }
  };

  // ---- Render ----
  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="dash-sidebar">
        <div className="dash-brand">
          Gaw<span>ean</span>
        </div>
        <nav className="dash-nav">
          <a
            href="#"
            className={`dash-nav-item ${activeView === 'dashboard' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); setActiveView('dashboard'); }}
          >
            <LayoutDashboard size={20} />
            Dashboard
          </a>
          <a
            href="#"
            className={`dash-nav-item ${activeView === 'orders' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); setActiveView('orders'); fetchOrders(); }}
          >
            <ShoppingCart size={20} />
            Pesanan & Chat
          </a>
          <a
            href="#"
            className={`dash-nav-item ${activeView === 'settings' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); setActiveView('settings'); }}
          >
            <Settings size={20} />
            Pengaturan & Verifikasi
          </a>
        </nav>
        <button onClick={handleLogout} className="dash-nav-item" style={{ marginTop: 'auto', border: 'none', background: 'none', width: '100%', textAlign: 'left' }}>
          <LogOut size={20} />
          Keluar
        </button>
      </aside>

      {/* Main Content */}
      <main className="dash-main">
        {activeView === 'dashboard' ? (
          <>
            <header className="dash-header">
              <h1>Dashboard Penyedia</h1>
              <div className="user-profile" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {isVerified && (
                  <span className="verified-badge"><ShieldCheck size={14} /> Terverifikasi</span>
                )}
                <span style={{ fontWeight: 600 }}>Halo, {userName}!</span>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--dash-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{initial}</div>
              </div>
            </header>

            {/* Verification Banner */}
            {!isVerified && (
              <div className="verification-banner warning">
                <div className="banner-icon"><AlertTriangle size={24} color="#e8a93b" /></div>
                <div className="banner-text">
                  <h4>Verifikasi Diperlukan</h4>
                  <p>Anda harus upload dokumen verifikasi (KTM / Surat Keterangan Mahasiswa) sebelum bisa posting jasa. Buka menu <strong>Pengaturan</strong> untuk upload.</p>
                </div>
                <div className="banner-action">
                  <button className="btn-primary-dash" onClick={() => setActiveView('settings')} style={{ whiteSpace: 'nowrap' }}>
                    <Upload size={16} /> Verifikasi Sekarang
                  </button>
                </div>
              </div>
            )}

            {/* Insights */}
            <div className="dash-insights">
              <div className="dash-card">
                <div className="dash-card-title">Total Klik Profil <TrendingUp size={16} /></div>
                <div className="dash-card-value">1,245</div>
              </div>
              <div className="dash-card">
                <div className="dash-card-title">Jasa Aktif <Briefcase size={16} /></div>
                <div className="dash-card-value">{jasaList.length}</div>
              </div>
              <div className="dash-card">
                <div className="dash-card-title">Klien Menghubungi <Users size={16} /></div>
                <div className="dash-card-value">32</div>
              </div>
              <div className="dash-card">
                <div className="dash-card-title">Rating <Star size={16} /></div>
                <div className="dash-card-value">4.9</div>
              </div>
            </div>

            {/* Jasa Table */}
            <section>
              <div className="dash-section-header">
                <h2>Jasa yang Saya Tawarkan</h2>
                <button
                  className="btn-primary-dash"
                  onClick={() => openModal()}
                  disabled={!isVerified}
                  title={!isVerified ? 'Verifikasi dulu untuk posting jasa' : ''}
                >
                  <Plus size={20} /> Tambah Jasa
                </button>
              </div>

              <div className="dash-table-wrapper">
                <table className="dash-table">
                  <thead>
                    <tr>
                      <th>Gambar</th>
                      <th>Judul Jasa</th>
                      <th>Kategori</th>
                      <th>Harga</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jasaList.length === 0 ? (
                      <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--dash-text-muted)' }}>Belum ada jasa. Yuk, tambah jasamu!</td></tr>
                    ) : (
                      jasaList.map(jasa => (
                        <tr key={jasa.id}>
                          <td>
                            {jasa.image ? (
                              <img src={storageUrl + jasa.image} alt={jasa.title} className="jasa-table-image" />
                            ) : (
                              <div className="jasa-table-image" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <ImageIcon size={18} color="var(--dash-text-muted)" />
                              </div>
                            )}
                          </td>
                          <td style={{ fontWeight: 500, color: 'var(--dash-text-main)' }}>{jasa.title}</td>
                          <td>
                            <span style={{ background: '#e0e7ff', color: '#4f46e5', padding: '0.25rem 0.5rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 600 }}>
                              {jasa.category || 'Umum'}
                            </span>
                          </td>
                          <td style={{ fontWeight: 600 }}>Rp{Number(jasa.price).toLocaleString('id-ID')}</td>
                          <td>
                            <div className="action-btns">
                              <button className="btn-icon edit" onClick={() => openModal(jasa)}><Edit size={18} /></button>
                              <button className="btn-icon delete" onClick={() => handleDelete(jasa.id)}><Trash2 size={18} /></button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        ) : activeView === 'orders' ? (
            <div className="orders-section animate-fade-in" style={{ padding: '20px' }}>
              <h2>Pesanan & Chat Masuk</h2>
              <p style={{ color: 'var(--dash-text-muted)', marginBottom: '20px' }}>Kelola pesanan dan negosiasi dari pelanggan Anda.</p>
              
              {orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
                  <MessageSquare size={40} style={{ color: 'var(--dash-text-muted)', marginBottom: '10px' }} />
                  <p style={{ color: 'var(--dash-text-muted)' }}>Belum ada pesanan masuk.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {orders.map(order => (
                    <div key={order.id} style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '12px', border: '1px solid var(--dash-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4 style={{ margin: '0 0 5px 0', fontSize: '1.1rem' }}>{order.jasa?.title}</h4>
                        <span style={{ fontSize: '0.85rem', color: 'var(--dash-text-muted)' }}>Pemesan: {order.pencari_jasa?.user?.name || 'Anonim'}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <span className={`status-badge status-${order.status}`}>
                          {order.status === 'negotiating' ? 'Nego' : order.status === 'accepted' ? 'Diterima' : order.status === 'rejected' ? 'Ditolak' : 'Selesai'}
                        </span>
                        <button onClick={() => setActiveOrder(order)} style={{ background: 'var(--dash-primary)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 500 }}>
                          <MessageSquare size={16} /> Buka Chat
                        </button>
                        <button onClick={() => handleDeleteOrder(order.id)} title="Hapus Semua Chat" style={{ background: 'rgba(220, 38, 38, 0.1)', color: '#dc2626', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
        ) : (
          /* Settings View */
          <div className="settings-panel">
            <header className="dash-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button
                  onClick={() => setActiveView('dashboard')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--dash-text-muted)', display: 'flex', alignItems: 'center' }}
                >
                  <ChevronLeft size={24} />
                </button>
                <h1>Pengaturan</h1>
              </div>
            </header>

            {/* Verification Section */}
            <div className="settings-section">
              <h3><FileText size={18} style={{ marginRight: '0.5rem', verticalAlign: 'text-bottom' }} /> Verifikasi Mahasiswa</h3>
              {isVerified ? (
                <div className="verification-banner success" style={{ marginBottom: 0 }}>
                  <div className="banner-icon"><ShieldCheck size={24} color="var(--dash-success)" /></div>
                  <div className="banner-text">
                    <h4>Anda Sudah Terverifikasi ✓</h4>
                    <p>Dokumen Anda telah berhasil diverifikasi. Anda bisa memposting jasa.</p>
                  </div>
                </div>
              ) : (
                <>
                  <p style={{ color: 'var(--dash-text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                    Upload KTM atau Surat Keterangan Mahasiswa Aktif untuk memverifikasi akun Anda. Format: PDF, JPG, PNG (max 5MB).
                  </p>
                  <div className="doc-upload-area">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={e => setVerifyFile(e.target.files?.[0] || null)}
                    />
                    <div className="upload-icon"><Upload size={32} color="var(--dash-text-muted)" /></div>
                    <div className="upload-label">
                      {verifyFile ? verifyFile.name : 'Klik atau seret file ke sini'}
                    </div>
                    <div className="upload-hint">PDF, JPG, PNG — Maks 5MB</div>
                  </div>
                  {verifyFile && (
                    <button
                      className="btn-primary-dash"
                      style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }}
                      onClick={handleVerificationUpload}
                      disabled={verifyUploading}
                    >
                      {verifyUploading ? 'Mengupload...' : 'Upload & Verifikasi'}
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Testimonials Management */}
            <div className="settings-section">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0 }}><Star size={18} style={{ marginRight: '0.5rem', verticalAlign: 'text-bottom' }} /> Kelola Testimoni</h3>
                <button className="btn-primary-dash" onClick={() => openTestiModal()} style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
                  <Plus size={16} /> Tambah
                </button>
              </div>
              <p style={{ color: 'var(--dash-text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                Tambahkan testimoni dari klien sebelumnya untuk memperkuat profil Anda.
              </p>

              {testimonials.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--dash-text-muted)', padding: '2rem', background: 'var(--dash-bg)', borderRadius: '10px' }}>
                  Belum ada testimoni. Tambahkan testimoni dari klien Anda!
                </div>
              ) : (
                <div className="testi-manage-list">
                  {testimonials.map(testi => (
                    <div className="testi-manage-item" key={testi.id}>
                      <div className="testi-info">
                        <div className="client">{testi.client_name}</div>
                        <div className="rating-stars">{'★'.repeat(testi.rating)}{'☆'.repeat(5 - testi.rating)}</div>
                        <div className="content-preview">{testi.content}</div>
                      </div>
                      <div className="testi-actions">
                        <button className="btn-icon edit" onClick={() => openTestiModal(testi)}><Edit size={16} /></button>
                        <button className="btn-icon delete" onClick={() => handleDeleteTesti(testi.id)}><Trash2 size={16} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Modal Tambah/Edit Jasa */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>{editingJasa ? 'Edit Jasa' : 'Tambah Jasa Baru'}</h2>
            <form onSubmit={handleSave} style={{ marginTop: '1.5rem' }}>
              {/* Image Upload */}
              <div className="form-group">
                <label>Gambar Jasa</label>
                <div className="image-upload-area">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageChange}
                  />
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="image-preview" />
                  ) : (
                    <div className="upload-text">
                      <ImageIcon size={24} color="var(--dash-text-muted)" style={{ marginBottom: '0.5rem' }} /><br />
                      <strong>Klik untuk upload gambar</strong><br />
                      JPG, PNG, WebP — Maks 2MB
                    </div>
                  )}
                </div>
              </div>
              <div className="form-group">
                <label>Judul Jasa</label>
                <input type="text" className="form-control" value={title} onChange={e => setTitle(e.target.value)} required placeholder="Contoh: Pembuatan Website Landing Page" />
              </div>
              <div className="form-group">
                <label>Kategori</label>
                <select className="form-control" value={category} onChange={e => setCategory(e.target.value)}>
                  <option value="">Pilih Kategori</option>
                  <option value="Coding & Web">Coding & Web</option>
                  <option value="Desain & UI/UX">Desain & UI/UX</option>
                  <option value="Tulis & Edit">Tulis & Edit</option>
                  <option value="Video & Konten">Video & Konten</option>
                </select>
              </div>
              <div className="form-group">
                <label>Harga Dasar (Rp)</label>
                <input type="number" className="form-control" value={price} onChange={e => setPrice(e.target.value)} required placeholder="300000" />
              </div>
              <div className="form-group">
                <label>Deskripsi Layanan</label>
                <textarea className="form-control" value={description} onChange={e => setDescription(e.target.value)} rows={4} placeholder="Jelaskan detail layanan yang akan kamu berikan..."></textarea>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary-dash" onClick={closeModal}>Batal</button>
                <button type="submit" className="btn-primary-dash">Simpan Jasa</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Tambah/Edit Testimoni */}
      {testiModalOpen && (
        <div className="modal-overlay" onClick={() => setTestiModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>{editingTesti ? 'Edit Testimoni' : 'Tambah Testimoni'}</h2>
            <form onSubmit={handleSaveTesti} style={{ marginTop: '1.5rem' }}>
              <div className="form-group">
                <label>Nama Klien</label>
                <input type="text" className="form-control" value={testiClientName} onChange={e => setTestiClientName(e.target.value)} required placeholder="Nama klien atau perusahaan" />
              </div>
              <div className="form-group">
                <label>Rating (1-5)</label>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                  {[1, 2, 3, 4, 5].map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setTestiRating(r)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '1.5rem',
                        color: r <= testiRating ? 'var(--dash-primary)' : 'var(--dash-border)',
                        transition: 'color 0.15s'
                      }}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label>Isi Testimoni</label>
                <textarea className="form-control" value={testiContent} onChange={e => setTestiContent(e.target.value)} rows={3} required placeholder="Tuliskan testimoni dari klien..." />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary-dash" onClick={() => setTestiModalOpen(false)}>Batal</button>
                <button type="submit" className="btn-primary-dash">Simpan Testimoni</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Chat Modal */}
      {activeOrder && (
        <ChatModal 
          order={activeOrder}
          currentUser={user}
          token={token!}
          baseUrl={baseUrl}
          isProvider={true}
          onClose={() => { setActiveOrder(null); fetchOrders(); }}
          onUpdateStatus={(newStatus) => {
            fetchOrders();
            // Automatically close modal if rejected or completed
            if (newStatus === 'rejected' || newStatus === 'completed') {
              setActiveOrder(null);
            } else {
              // Update local state to reflect change without re-fetching immediately inside modal
              setActiveOrder({...activeOrder, status: newStatus});
            }
          }}
        />
      )}
    </div>
  );
}
