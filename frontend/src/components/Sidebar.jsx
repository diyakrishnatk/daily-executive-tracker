import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Sidebar({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdmin = user?.role === "admin";

  const execNavItems = [
    { icon: "📊", label: "Dashboard", path: "/" },
    { icon: "➕", label: "Add Activity", path: "/add-activity" },
    { icon: "📋", label: "Activity History", path: "/activity-history" },
  ];

  const adminNavItems = [
    { icon: "🏠", label: "Admin Dashboard", path: "/admin" },
    { icon: "👥", label: "Executives", path: "/admin/executives" },
    { icon: "📋", label: "All Activities", path: "/admin/activities" },
  ];

  const navItems = isAdmin ? adminNavItems : execNavItems;

  const getInitials = (name) =>
    name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      : "U";

  return (
    <>
      {/* Mobile toggle button */}
      <button
        id="mobile-sidebar-toggle"
        onClick={() => setMobileOpen(true)}
        style={{
          display: "none",
          position: "fixed",
          top: 16,
          left: 16,
          zIndex: 200,
          background: "var(--accent-gradient)",
          border: "none",
          borderRadius: "var(--radius-md)",
          width: 40,
          height: 40,
          fontSize: 18,
          cursor: "pointer",
          color: "white",
          alignItems: "center",
          justifyContent: "center",
        }}
        className="mobile-menu-btn"
      >
        ☰
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
        {/* Brand */}
        <div className="sidebar-brand">
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">📈</div>
            <div>
              <div className="sidebar-logo-text">Executive Tracker</div>
              <div className="sidebar-logo-sub">Daily Activity System</div>
            </div>
          </div>
        </div>

        {/* User info */}
        <div className="sidebar-user">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div className="exec-avatar" style={{ width: 38, height: 38, fontSize: 13, border: "2px solid #ffffff", boxShadow: "0 2px 8px rgba(79,70,229,0.25)" }}>
              {getInitials(user?.name)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="sidebar-user-name" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.name || "Executive User"}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                <span className="badge badge-purple" style={{ padding: "2px 8px", fontSize: 10, textTransform: "uppercase" }}>
                  {user?.role === "admin" ? "👑 Admin" : "💼 Executive"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.path}
              id={`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
              className={`sidebar-nav-item ${
              location.pathname === item.path ||
              (item.path !== "/admin" && location.pathname.startsWith(item.path))
                ? "active"
                : ""
            }`}
              onClick={() => {
                navigate(item.path);
                setMobileOpen(false);
              }}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Footer logout */}
        <div className="sidebar-footer">
          <button
            id="logout-btn"
            className="sidebar-nav-item"
            style={{ color: "var(--danger)", width: "100%" }}
            onClick={onLogout}
          >
            <span className="nav-icon">🚪</span>
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
