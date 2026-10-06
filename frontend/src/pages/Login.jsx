import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import executiveBg from "../assets/executive-bg.jpg";
import adminBg from "../assets/admin-bg.jpg";

function Login() {
  const navigate = useNavigate();
  const [loginType, setLoginType] = useState("executive");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await API.post("/auth/login", { email, password });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      if (response.data.user?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="login-page"
      style={{
        backgroundImage: `url(${loginType === "executive" ? executiveBg : adminBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay to ensure text readability against the background */}
      <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.4)" }} />

      <div className="login-card">
        {/* Logo */}
        <div className="login-logo">
          <div className="login-logo-icon">📈</div>
          <div className="login-logo-text">
            <h1>Executive Tracker</h1>
            <p>Daily Activity Management System</p>
          </div>
        </div>

        {/* Toggle */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24, background: "var(--bg-input)", padding: 6, borderRadius: "var(--radius-lg)" }}>
          <button
            type="button"
            style={{
              flex: 1,
              padding: "10px",
              border: "none",
              borderRadius: "var(--radius-sm)",
              background: loginType === "executive" ? "white" : "transparent",
              color: loginType === "executive" ? "var(--accent-1)" : "var(--text-muted)",
              fontWeight: 700,
              boxShadow: loginType === "executive" ? "var(--shadow-sm)" : "none",
              cursor: "pointer",
              transition: "var(--transition)"
            }}
            onClick={() => setLoginType("executive")}
          >
            Executive
          </button>
          <button
            type="button"
            style={{
              flex: 1,
              padding: "10px",
              border: "none",
              borderRadius: "var(--radius-sm)",
              background: loginType === "admin" ? "white" : "transparent",
              color: loginType === "admin" ? "var(--accent-1)" : "var(--text-muted)",
              fontWeight: 700,
              boxShadow: loginType === "admin" ? "var(--shadow-sm)" : "none",
              cursor: "pointer",
              transition: "var(--transition)"
            }}
            onClick={() => setLoginType("admin")}
          >
            Admin
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="toast-error mb-16">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Form */}
        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">
              Email Address
            </label>
            <input
              id="login-email"
              type="email"
              className="form-input"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                className="form-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                style={{ paddingRight: 44 }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 16,
                  color: "var(--text-muted)",
                  padding: 0,
                }}
                aria-label="Toggle password visibility"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            className={`btn btn-primary login-btn ${loading ? "loading" : ""}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <div
                  style={{
                    width: 16,
                    height: 16,
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTop: "2px solid white",
                    borderRadius: "50%",
                    animation: "spin 0.7s linear infinite",
                  }}
                />
                Signing in...
              </>
            ) : (
              <>🔐 Sign In</>
            )}
          </button>
        </form>



        {/* Footer note */}
        <p
          style={{
            textAlign: "center",
            marginTop: 16,
            fontSize: 12,
            color: "var(--text-muted)",
          }}
        >
          Daily Executive Activity Management System &copy; 2026
        </p>
      </div>
    </div>
  );
}

export default Login;