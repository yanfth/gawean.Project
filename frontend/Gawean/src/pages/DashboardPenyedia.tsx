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
  Star
} from 'lucide-react';
import './Dashboard.css';

interface Jasa {
  id: number;
  title: string;
  category: string;
  description: string;
  price: string;
}

export default function DashboardPenyedia() {
  const navigate = useNavigate();
  const [jasaList, setJasaList] = useState<Jasa[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJasa, setEditingJasa] = useState<Jasa | null>(null);
  
  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchJasa();
    // eslint-disable-next-line
  }, []);

  const fetchJasa = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/jasa`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      if (res.ok) {
        const data = await res.json();
        setJasaList(data);
      } else {
        if (res.status === 401 || res.status === 403) {
           navigate('/login');
        }
      }
    } catch (error) {
      console.error("Failed to fetch jasa:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const openModal = (jasa: Jasa | null = null) => {
    if (jasa) {
      setEditingJasa(jasa);
      setTitle(jasa.title);
      setCategory(jasa.category || '');
      setDescription(jasa.description || '');
      setPrice(jasa.price || '');
    } else {
      setEditingJasa(null);
      setTitle('');
      setCategory('');
      setDescription('');
      setPrice('');
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingJasa ? 'PUT' : 'POST';
      const url = editingJasa 
        ? `${import.meta.env.VITE_API_BASE_URL}/jasa/${editingJasa.id}`
        : `${import.meta.env.VITE_API_BASE_URL}/jasa`;

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({ title, category, description, price })
      });

      if (res.ok) {
        fetchJasa();
        closeModal();
      } else {
        alert("Gagal menyimpan jasa.");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Yakin ingin menghapus jasa ini?')) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/jasa/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      if (res.ok) {
        fetchJasa();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="dash-sidebar">
        <div className="dash-brand">
          Gaw<span>ean</span>
        </div>
        <nav className="dash-nav">
          <a href="#" className="dash-nav-item active">
            <LayoutDashboard size={20} />
            Dashboard
          </a>
          <a href="#" className="dash-nav-item">
            <Briefcase size={20} />
            Kelola Jasa
          </a>
          <a href="#" className="dash-nav-item">
            <Settings size={20} />
            Pengaturan
          </a>
        </nav>
        <button onClick={handleLogout} className="dash-nav-item" style={{ marginTop: 'auto', border: 'none', background: 'none', width: '100%', textAlign: 'left' }}>
          <LogOut size={20} />
          Keluar
        </button>
      </aside>

      {/* Main Content */}
      <main className="dash-main">
        <header className="dash-header">
          <h1>Dashboard Penyedia</h1>
          <div className="user-profile" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontWeight: 600 }}>Halo, Penyedia!</span>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--dash-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>P</div>
          </div>
        </header>

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
            <button className="btn-primary-dash" onClick={() => openModal()}>
              <Plus size={20} /> Tambah Jasa
            </button>
          </div>

          <div className="dash-table-wrapper">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Judul Jasa</th>
                  <th>Kategori</th>
                  <th>Harga</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {jasaList.length === 0 ? (
                  <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--dash-text-muted)' }}>Belum ada jasa. Yuk, tambah jasamu!</td></tr>
                ) : (
                  jasaList.map(jasa => (
                    <tr key={jasa.id}>
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
      </main>

      {/* Modal CRUD */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>{editingJasa ? 'Edit Jasa' : 'Tambah Jasa Baru'}</h2>
            <form onSubmit={handleSave} style={{ marginTop: '1.5rem' }}>
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
    </div>
  );
}
