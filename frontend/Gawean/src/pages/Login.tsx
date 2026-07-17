import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";

type Role = "cari_jasa" | "buka_jasa";

export default function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("cari_jasa");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Email dan password wajib diisi.");
      return;
    }

    setLoading(true);
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";
      const res = await fetch(`${baseUrl}/login`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ email, password, role, remember }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || "Email atau password salah.");
      }

      const data = await res.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user.role === 'penyedia_jasa') {
        navigate("/dashboard-penyedia");
      } else {
        navigate("/dashboard-pencari");
      }
    } catch (err: any) {
      console.error("Fetch Error:", err);
      setError(err.message || "Gagal masuk. Coba lagi.");
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
            Masuk ke <em>Gawean</em>
          </h1>
          <p className="auth-sub">
            Lanjutkan cari jasa atau kelola jasa yang lagi kamu buka.
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
                <span className="role-desc">Masuk sebagai pencari</span>
              </div>
              <div
                className={`auth-role ${role === "buka_jasa" ? "active" : ""}`}
                onClick={() => setRole("buka_jasa")}
              >
                <span className="role-ic">🎒</span>
                <span className="role-label">Buka Jasa</span>
                <span className="role-desc">Masuk sebagai penyedia</span>
              </div>
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
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="auth-toggle-visibility"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? "SEMBUNYIKAN" : "LIHAT"}
                </button>
              </div>
            </div>

            <div className="auth-row-between">
              <label className="auth-remember">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Ingat saya
              </label>
              <Link to="/forgot-password" className="auth-forgot">
                Lupa password?
              </Link>
            </div>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </form>

          <div className="auth-divider">atau</div>

          <p className="auth-switch">
            Belum punya akun? <Link to="/register">Daftar sekarang</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
