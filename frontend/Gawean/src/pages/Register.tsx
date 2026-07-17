import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";

type Role = "cari_jasa" | "buka_jasa";

export default function Register() {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("cari_jasa");
  const [name, setName] = useState("");
  const [campus, setCampus] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !campus || !email || !password) {
      setError("Semua kolom wajib diisi.");
      return;
    }
    if (password.length < 8) {
      setError("Password minimal 8 karakter.");
      return;
    }

    setLoading(true);
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";
      const res = await fetch(`${baseUrl}/register`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ name, campus, email, password, role }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || "Pendaftaran gagal. Coba lagi.");
      }

      const data = await res.json();
      localStorage.setItem("gawean_token", data.token);

      alert("Pendaftaran berhasil! Silakan login.");
      navigate("/login");
    } catch (err: any) {
      console.error("Fetch Error:", err);
      setError(err.message || "Gagal daftar. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-wrap">
        <div className="auth-card">
          <Link to="/" className="auth-brand-link">
            Gaw<span>ean</span>
          </Link>

          <span className="auth-eyebrow">khusus mahasiswa se-Indonesia</span>
          <h1>
            Gabung ke <em>Gawean</em>
          </h1>
          <p className="auth-sub">
            Satu akun buat cari jasa atau buka jasa sendiri.
          </p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="auth-role-group">
              <div
                className={`auth-role ${role === "cari_jasa" ? "active" : ""}`}
                onClick={() => setRole("cari_jasa")}
              >
                <span className="role-ic">🔍</span>
                <span className="role-label">Cari Jasa</span>
                <span className="role-desc">Butuh bantuan tugas</span>
              </div>
              <div
                className={`auth-role ${role === "buka_jasa" ? "active" : ""}`}
                onClick={() => setRole("buka_jasa")}
              >
                <span className="role-ic">🎒</span>
                <span className="role-label">Buka Jasa</span>
                <span className="role-desc">Punya skill nganggur</span>
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="name">Nama lengkap</label>
              <input
                id="name"
                type="text"
                placeholder="Nama sesuai KTM"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </div>

            <div className="auth-field">
              <label htmlFor="campus">Kampus</label>
              <input
                id="campus"
                type="text"
                placeholder="Contoh: UISI"
                value={campus}
                onChange={(e) => setCampus(e.target.value)}
              />
            </div>

            <div className="auth-field">
              <label htmlFor="email">Email kampus</label>
              <input
                id="email"
                type="email"
                placeholder="nama@student.kampus.ac.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div className="auth-field">
              <label htmlFor="password">Password</label>
              <div className="auth-password-wrap">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimal 8 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="auth-toggle-visibility"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? "SEMBUNYIKAN" : "LIHAT"}
                </button>
              </div>
              <p className="auth-field-hint">
                Pakai email kampus biar cepat diverifikasi.
              </p>
            </div>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? "Memproses..." : "Daftar"}
            </button>
          </form>

          <div className="auth-divider">atau</div>

          <p className="auth-switch">
            Sudah punya akun? <Link to="/login">Masuk di sini</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
