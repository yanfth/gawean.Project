import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, LogOut, Briefcase, Code, Palette, GraduationCap, PenTool, X, MessageCircle, ShoppingCart, Handshake, Star, ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import './Dashboard.css';

interface User {
  id: number;
  name: string;
}

interface Testimonial {
  id: number;
  client_name: string;
  content: string;
  rating: number;
}

interface PenyediaJasa {
  id: number;
  is_verified: boolean;
  user: User;
  testimonials: Testimonial[];
}

interface Jasa {
  id: number;
  title: string;
  category: string;
  description: string;
  price: string;
  image: string | null;
  penyedia: PenyediaJasa;
}

const CATEGORIES = [
  { key: 'all', label: 'Semua Jasa', icon: Briefcase },
  { key: 'Coding & Web', label: 'Coding', icon: Code },
  { key: 'Desain & UI/UX', label: 'Design', icon: Palette },
  { key: 'Tulis & Edit', label: 'Writing', icon: PenTool },
  { key: 'Video & Konten', label: 'Tutoring', icon: GraduationCap },
];

export default function DashboardPencari() {
  const navigate = useNavigate();
  const [jasaList, setJasaList] = useState<Jasa[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedJasa, setSelectedJasa] = useState<Jasa | null>(null);
  const [activeTab, setActiveTab] = useState<'detail' | 'testimoni'>('detail');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const currentUser = userStr ? JSON.parse(userStr) : null;
  const userName = currentUser?.name || 'User';
  const initial = userName.charAt(0).toUpperCase();
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
  const storageUrl = baseUrl.replace('/api', '') + '/storage/';

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchAllJasa();
    // eslint-disable-next-line
  }, []);

  const fetchAllJasa = async () => {
    try {
      const res = await fetch(`${baseUrl}/all-jasa`, {
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

  const filteredJasa = jasaList.filter(jasa => {
    const matchesSearch = jasa.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (jasa.category && jasa.category.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || jasa.category === selectedCategory;
    const matchesVerified = !verifiedOnly || jasa.penyedia?.is_verified;
    const price = Number(jasa.price);
    const matchesMinPrice = !minPrice || price >= Number(minPrice);
    const matchesMaxPrice = !maxPrice || price <= Number(maxPrice);
    return matchesSearch && matchesCategory && matchesVerified && matchesMinPrice && matchesMaxPrice;
  });

  const getAvgRating = (testimonials: Testimonial[] | undefined) => {
    if (!testimonials || testimonials.length === 0) return null;
    const avg = testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length;
    return avg.toFixed(1);
  };

  const openDetail = (jasa: Jasa) => {
    setSelectedJasa(jasa);
    setActiveTab('detail');
  };

  return (
    <div className={`pencari-wrapper ${isSidebarCollapsed ? 'collapsed' : ''}`} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--dash-bg)' }}>
      {/* Navbar */}
      <nav className="user-dash-nav">
        <div className="user-nav-brand">
          Gaw<span>ean</span>
        </div>
        <div className="user-nav-links">
          <a href="#" className="active">Cari Jasa</a>
          <a href="#">Buka Jasa</a>
          <a href="#">Forum</a>
          <a href="#">Cara Kerja</a>
        </div>
        <div className="user-nav-right">
          <span className="nav-user-name">{userName}</span>
          <div className="nav-user-avatar">{initial}</div>
          <button onClick={handleLogout} className="nav-logout-btn">
            <LogOut size={14} /> Keluar
          </button>
        </div>
      </nav>

      <div className="pencari-layout">
        {/* Sidebar */}
        <aside className="pencari-sidebar">
          <div className="sidebar-header">
            <div className="sidebar-section-title">Kategori</div>
            <button 
              className="sidebar-toggle-btn" 
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              title={isSidebarCollapsed ? "Perlebar Sidebar" : "Persempit Sidebar"}
            >
              {isSidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          </div>
          <div className="sidebar-section-sub">Filter berdasarkan keahlian</div>
          <ul className="category-list">
            {CATEGORIES.map(cat => {
              const Icon = cat.icon;
              return (
                <li
                  key={cat.key}
                  className={selectedCategory === cat.key ? 'active' : ''}
                  onClick={() => setSelectedCategory(cat.key)}
                  title={isSidebarCollapsed ? cat.label : ""}
                >
                  <span className="cat-icon"><Icon size={16} /></span>
                  <span className="cat-label">{cat.label}</span>
                </li>
              );
            })}
          </ul>

          <div className="sidebar-bottom">
            <div className="price-filter-title">Rentang Harga</div>
            <div className="price-filter-inputs">
              <input type="number" placeholder="Min" value={minPrice} onChange={e => setMinPrice(e.target.value)} />
              <span>-</span>
              <input type="number" placeholder="Max" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} />
            </div>

            <div className="price-filter-title">Verifikasi</div>
            <div className="verification-filter">
              <label title={isSidebarCollapsed ? "Mahasiswa Terverifikasi" : ""}>
                <input type="checkbox" checked={verifiedOnly} onChange={e => setVerifiedOnly(e.target.checked)} />
                <span className="verif-label">🎓 Mahasiswa Terverifikasi</span>
              </label>
            </div>

            <button className="sidebar-cta" onClick={() => navigate('/dashboard-penyedia')} title={isSidebarCollapsed ? "Buka Jasa Sendiri" : ""}>
              <span className="cta-label">Buka Jasa Sendiri</span>
              {isSidebarCollapsed && <Briefcase size={16} />}
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="pencari-main">
          <div className="pencari-header">
            <h1>Temukan Jasa yang Tepat</h1>
            <p>Temukan freelancer mahasiswa terbaik untuk proyekmu.</p>
          </div>

          {/* Category Tags */}
          <div className="category-tags">
            {CATEGORIES.filter(c => c.key !== 'all').map(cat => (
              <button
                key={cat.key}
                className={`category-tag ${selectedCategory === cat.key ? 'active' : ''}`}
                onClick={() => setSelectedCategory(selectedCategory === cat.key ? 'all' : cat.key)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Bar */}
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

          {/* Cards Grid */}
          <div className="gig-grid">
            {filteredJasa.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--dash-text-muted)', padding: '3rem' }}>
                Tidak ada jasa yang ditemukan.
              </div>
            ) : (
              filteredJasa.map(jasa => {
                const rating = getAvgRating(jasa.penyedia?.testimonials);
                const providerName = jasa.penyedia?.user?.name || 'Anonim';
                return (
                  <div className="jasa-card" key={jasa.id} onClick={() => openDetail(jasa)}>
                    {/* Card Image */}
                    <div className="jasa-card-image">
                      {jasa.image ? (
                        <img src={storageUrl + jasa.image} alt={jasa.title} />
                      ) : (
                        <div className="no-image">
                          <ImageIcon size={32} />
                          <span>Tidak ada gambar</span>
                        </div>
                      )}
                      <div className="jasa-card-price-badge">
                        Rp{Number(jasa.price).toLocaleString('id-ID')}
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="jasa-card-body">
                      <div className="jasa-card-provider">
                        <div className="jasa-card-provider-avatar">
                          {providerName.charAt(0).toUpperCase()}
                        </div>
                        <div className="jasa-card-provider-info">
                          <h4>{providerName}</h4>
                          <span>{jasa.category || 'Freelancer'}</span>
                        </div>
                      </div>

                      <div className="jasa-card-tags">
                        <span className="jasa-card-tag">{jasa.category || 'Umum'}</span>
                      </div>

                      <p className="jasa-card-desc">
                        {jasa.description || 'Tidak ada deskripsi.'}
                      </p>

                      <div className="jasa-card-footer">
                        {jasa.penyedia?.is_verified ? (
                          <div className="jasa-card-verified">
                            <span className="verified-dot"></span>
                            Verified Student
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.8rem', color: 'var(--dash-text-muted)' }}>Belum Terverifikasi</span>
                        )}
                        {rating && (
                          <div className="jasa-card-rating">
                            <Star size={14} className="star" fill="var(--dash-primary)" stroke="var(--dash-primary)" />
                            {rating}
                          </div>
                        )}
                      </div>

                      <button className="jasa-card-view-btn" onClick={(e) => { e.stopPropagation(); openDetail(jasa); }}>
                        Lihat Profil
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="dash-footer">
        <div className="foot-grid">
          <div>
            <div className="foot-brand">
              Gaw<span>ean</span>
            </div>
            <p className="foot-desc">
              Platform jasa mahasiswa untuk mahasiswa. Kerja lebih dekat, harga lebih masuk akal.
            </p>
          </div>
          <div className="foot-col">
            <h4>Produk</h4>
            <a href="#">Cari Jasa</a>
            <a href="#">Buka Jasa</a>
            <a href="#">Forum Diskusi</a>
          </div>
          <div className="foot-col">
            <h4>Bantuan</h4>
            <a href="#">FAQ</a>
            <a href="#">Kontak</a>
            <a href="#">Panduan</a>
          </div>
          <div className="foot-col">
            <h4>Perusahaan</h4>
            <a href="#">Tentang Kami</a>
            <a href="#">Keamanan & Privasi</a>
            <a href="#">Syarat Layanan</a>
          </div>
        </div>
        <div className="foot-bottom">
          © 2026 Gawean. Dibuat oleh mahasiswa, untuk mahasiswa.
        </div>
      </footer>

      {/* Detail Modal */}
      {selectedJasa && (
        <div className="modal-overlay" onClick={() => setSelectedJasa(null)}>
          <div className="modal-content detail-modal" onClick={e => e.stopPropagation()}>
            {/* Modal Image */}
            <div className="detail-modal-image">
              {selectedJasa.image ? (
                <img src={storageUrl + selectedJasa.image} alt={selectedJasa.title} />
              ) : (
                <div className="no-image">Tidak ada gambar</div>
              )}
              <button className="detail-modal-close" onClick={() => setSelectedJasa(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="detail-modal-body">
              {/* Provider Info */}
              <div className="detail-modal-provider">
                <div className="detail-modal-provider-avatar">
                  {(selectedJasa.penyedia?.user?.name || 'A').charAt(0).toUpperCase()}
                </div>
                <div className="detail-modal-provider-info">
                  <h3>{selectedJasa.penyedia?.user?.name || 'Anonim'}</h3>
                  <span>
                    {selectedJasa.penyedia?.is_verified ? '🎓 Verified Student' : 'Mahasiswa'}
                    {' · '}
                    {selectedJasa.category || 'Freelancer'}
                  </span>
                </div>
              </div>

              <h2 className="detail-modal-title">{selectedJasa.title}</h2>
              <div className="detail-modal-price">
                Rp{Number(selectedJasa.price).toLocaleString('id-ID')}
              </div>

              {/* Action Buttons */}
              <div className="detail-modal-actions">
                <button className="detail-btn detail-btn-chat" onClick={() => alert('Fitur Chat akan segera hadir!')}>
                  <MessageCircle size={16} /> Chat
                </button>
                <button className="detail-btn detail-btn-checkout" onClick={() => alert('Fitur Checkout akan segera hadir!')}>
                  <ShoppingCart size={16} /> Checkout
                </button>
                <button className="detail-btn detail-btn-nego" onClick={() => alert('Fitur Nego akan segera hadir!')}>
                  <Handshake size={16} /> Nego
                </button>
              </div>

              {/* Tabs */}
              <div className="detail-tabs">
                <button
                  className={`detail-tab ${activeTab === 'detail' ? 'active' : ''}`}
                  onClick={() => setActiveTab('detail')}
                >
                  Deskripsi
                </button>
                <button
                  className={`detail-tab ${activeTab === 'testimoni' ? 'active' : ''}`}
                  onClick={() => setActiveTab('testimoni')}
                >
                  Testimoni ({selectedJasa.penyedia?.testimonials?.length || 0})
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === 'detail' ? (
                <div className="detail-modal-desc">
                  {selectedJasa.description || 'Belum ada deskripsi untuk jasa ini.'}
                </div>
              ) : (
                <div className="testimonial-list">
                  {(!selectedJasa.penyedia?.testimonials || selectedJasa.penyedia.testimonials.length === 0) ? (
                    <div className="no-testimonials">Belum ada testimoni untuk penyedia ini.</div>
                  ) : (
                    selectedJasa.penyedia.testimonials.map(testi => (
                      <div className="testimonial-item" key={testi.id}>
                        <div className="testimonial-header">
                          <span className="client-name">{testi.client_name}</span>
                          <span className="testi-rating">
                            {'★'.repeat(testi.rating)}{'☆'.repeat(5 - testi.rating)}
                          </span>
                        </div>
                        <p className="testi-content">{testi.content}</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
