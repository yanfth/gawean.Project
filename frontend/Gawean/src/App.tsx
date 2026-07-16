import { Link } from "react-router-dom";
import "./App.css";

const kategori = [
  { ic: "UI", title: "Desain & UI/UX", count: "210 jasa" },
  { ic: "</>", title: "Coding & Web", count: "340 jasa" },
  { ic: "Aa", title: "Tulis & Edit", count: "180 jasa" },
  { ic: "▶", title: "Video & Konten", count: "150 jasa" },
];

const gigs = [
  {
    initials: "RD",
    name: "Rangga D.",
    role: "Teknik Informatika",
    tag: "Desain",
    title: "Desain UI/UX untuk aplikasi web & mobile",
    price: "Rp150rb",
    rating: "★ 4.9 (32)",
  },
  {
    initials: "SA",
    name: "Sinta A.",
    role: "Sastra Inggris",
    tag: "Tulisan",
    title: "Proofread & terjemahan skripsi Indo-Inggris",
    price: "Rp75rb",
    rating: "★ 5.0 (48)",
  },
  {
    initials: "FH",
    name: "Farhan H.",
    role: "Sistem Informasi",
    tag: "Coding",
    title: "Bikin website Laravel + database dari nol",
    price: "Rp350rb",
    rating: "★ 4.7 (19)",
  },
];

const steps = [
  {
    num: "01",
    title: "Cari atau posting jasa",
    text: "Cari mahasiswa dengan skill yang kamu butuhkan, atau tawarkan jasamu sendiri.",
  },
  {
    num: "02",
    title: "Diskusi lewat forum",
    text: "Ngobrolin detail kerjaan, harga, dan deadline langsung di forum diskusi.",
  },
  {
    num: "03",
    title: "Bayar & selesai",
    text: "Bayar setelah hasil sesuai, kasih rating buat bantu mahasiswa lain.",
  },
];

const testimoni = [
  {
    text: '"Butuh poster acara himpunan mendadak, ketemu jasa desain dari anak DKV kampus sebelah. Harganya jauh lebih ramah dompet."',
    initials: "NA",
    name: "Nadia A.",
    role: "Manajemen, Univ. X",
  },
  {
    text: '"Jadi bisa dapat uang jajan tambahan dari skill ngoding yang selama ini cuma dipakai buat tugas."',
    initials: "BP",
    name: "Bayu P.",
    role: "Informatika, Univ. Y",
  },
];

export default function App() {
  return (
      <>
        <nav className="navbar">
          <div className="nav-left">
            <a href="#">Tentang</a>
            <a href="#">Layanan</a>
            <a href="#">Cari Jasa</a>
          </div>
          <div className="nav-brand">
            Gaw<span>ean</span>
          </div>
          <div className="nav-right">
            <a href="#">Testimoni</a>
            <a href="#">FAQ</a>
            <a href="#">Kontak</a>
            <Link to="/login" className="btn-masuk" style={{ background: 'var(--mustard)', color: 'var(--indigo)', fontWeight: '700', padding: '0.5rem 1.25rem', borderRadius: '0.5rem', textDecoration: 'none', marginLeft: '0.5rem' }}>Masuk</Link>
          </div>
        </nav>

        <section className="hero">
          <span className="eyebrow">khusus mahasiswa se-Indonesia</span>
          <h1>
            Jasa Mahasiswa Asli,<br /><em>Harga Mahasiswa</em>
          </h1>
          <p>
            Gawean menghubungkan mahasiswa yang butuh jasa desain, coding,
            tulisan, sampai edit video, dengan mahasiswa lain yang punya skill
            dan waktu luang.
          </p>
          <div className="hero-cta">
            <button className="btn-primary">Cari Jasa</button>
            <button className="btn-secondary">Buka Jasa Sendiri</button>
          </div>
        </section>

        <div className="stats">
          <div className="stat">
            <b>1.200+</b>
            <span>Jasa aktif</span>
          </div>
          <div className="stat">
            <b>85+</b>
            <span>Kampus terdaftar</span>
          </div>
          <div className="stat">
            <b>4.8</b>
            <span>Rating rata-rata</span>
          </div>
          <div className="stat">
            <b>Rp0</b>
            <span>Biaya daftar</span>
          </div>
        </div>

        <section className="section">
          <div className="section-head">
            <h2>Kategori paling dicari</h2>
            <p>Dari tugas kuliah sampai proyek freelance kecil-kecilan</p>
          </div>
          <div className="kategori-grid">
            {kategori.map((k) => (
              <div className="kategori-item" key={k.title}>
                <div className="ic">{k.ic}</div>
                <h3>{k.title}</h3>
                <span>{k.count}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="section section-tinted">
          <div className="section-head">
            <h2>Jasa yang lagi rame</h2>
            <p>
              Setiap kartu ini punya identitas mahasiswanya sendiri, kayak KTM
            </p>
          </div>
          <div className="gig-grid">
            {gigs.map((g) => (
              <div className="gig-card" key={g.title}>
                <div className="gig-top">
                  <div className="gig-avatar">{g.initials}</div>
                  <div>
                    <div className="gig-name">{g.name}</div>
                    <div className="gig-role">{g.role}</div>
                  </div>
                </div>
                <span className="gig-tag">{g.tag}</span>
                <div className="gig-title">{g.title}</div>
                <div className="gig-foot">
                  <span className="gig-price">{g.price}</span>
                  <span className="gig-rating">{g.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="section-head">
            <h2>Cara kerjanya</h2>
            <p>Tiga langkah, tanpa ribet</p>
          </div>
          <div className="steps">
            {steps.map((s) => (
              <div className="step" key={s.num}>
                <div className="num">{s.num}</div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="section-head">
            <h2>Kata mereka</h2>
          </div>
          <div className="testi-grid">
            {testimoni.map((t) => (
              <div className="testi" key={t.name}>
                <p>{t.text}</p>
                <div className="testi-who">
                  <div className="dot">{t.initials}</div>
                  <div>
                    <b>{t.name}</b>
                    <span>{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <footer>
          <div className="foot-grid">
            <div>
              <div className="foot-brand">
                Gaw<span>ean</span>
              </div>
              <p className="foot-desc">
                Platform jasa mahasiswa untuk mahasiswa. Kerja lebih dekat,
                harga lebih masuk akal.
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
              <a href="#">Testimoni</a>
            </div>
          </div>
          <div className="foot-bottom">
            © 2026 Gawean. Dibuat oleh mahasiswa, untuk mahasiswa.
          </div>
        </footer>
      </>
    );
}
