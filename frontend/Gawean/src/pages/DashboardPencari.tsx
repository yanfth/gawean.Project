import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, LogOut } from 'lucide-react';
import './Dashboard.css';

interface User {
  id: number;
  name: string;
}

interface Penyedia {
  id: number;
  user: User;
}

interface Jasa {
  id: number;
  title: string;
  category: string;
  description: string;
  price: string;
  penyedia: Penyedia;
}

export default function DashboardPencari() {
  const navigate = useNavigate();
  const [jasaList, setJasaList] = useState<Jasa[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchAllJasa(token);
    // eslint-disable-next-line
  }, []);

  const fetchAllJasa = async (token: string) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/all-jasa`, {
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
      console.error("Failed to fetch all jasa:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const filteredJasa = jasaList.filter(jasa => 
    jasa.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (jasa.category && jasa.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="dashboard-layout">
      <nav className="user-dash-nav">
        <div className="dash-brand" style={{ marginBottom: 0, paddingLeft: 0 }}>
          Gaw<span>ean</span>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ fontWeight: 600, color: 'var(--dash-sidebar-text)' }}>Mencari Jasa Mahasiswa</span>
          <button onClick={handleLogout} className="btn-secondary-dash" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: 'none', background: 'transparent', color: 'white' }}>
            <LogOut size={18} color="white" /> {localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!).name : 'User'}
          </button>
        </div>
      </nav>

      <main className="user-dash-main">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>Temukan Jasa yang Tepat</h1>
          <p style={{ color: 'var(--dash-text-muted)', fontSize: '1.125rem' }}>Eksplorasi ribuan jasa dari mahasiswa berbakat untuk tugas atau proyekmu.</p>
        </div>

        <div className="search-bar">
          <Search size={24} color="var(--dash-text-muted)" />
          <input 
            type="text" 
            className="search-input" 
            placeholder="Cari desain, koding, terjemahan..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="gig-grid">
          {filteredJasa.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--dash-text-muted)', padding: '3rem' }}>
              Tidak ada jasa yang ditemukan.
            </div>
          ) : (
            filteredJasa.map(jasa => (
              <div className="dash-card" key={jasa.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <span style={{ background: '#eef2ff', color: 'var(--dash-primary)', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 600 }}>
                    {jasa.category || 'Umum'}
                  </span>
                  <span style={{ fontWeight: 700, color: 'var(--dash-primary)' }}>Rp{Number(jasa.price).toLocaleString('id-ID')}</span>
                </div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>{jasa.title}</h3>
                <p style={{ color: 'var(--dash-text-muted)', fontSize: '0.875rem', lineHeight: 1.5, flex: 1, margin: 0 }}>
                  {jasa.description}
                </p>
                <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--dash-border)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.875rem', color: 'var(--dash-text-muted)' }}>
                    {jasa.penyedia?.user?.name ? jasa.penyedia.user.name.substring(0, 1).toUpperCase() : '?'}
                  </div>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                    {jasa.penyedia?.user?.name || 'Anonim'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
