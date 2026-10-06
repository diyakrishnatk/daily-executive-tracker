import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../api";
import Sidebar from "../components/Sidebar";

function AdminExecutives() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const filter = searchParams.get("filter"); // 'updated' | 'not-updated' | null
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [executives, setExecutives] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const fetchExecutives = async () => {
    setLoading(true);
    try {
      const response = await API.get("/activities/admin-dashboard-stats");
      setExecutives(response.data.executives || []);
    } catch (error) {
      console.error("Executives fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExecutives();
  }, []);

  const getInitials = (name) =>
    name
      ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
      : "?";

  const filteredExecutives = executives.filter((exec) => {
    if (filter === "updated") return exec.status === "Updated";
    if (filter === "not-updated") return exec.status !== "Updated";
    return true;
  });

  const pageTitle =
    filter === "updated"
      ? "Updated Today"
      : filter === "not-updated"
      ? "Not Updated Today"
      : "All Executives";

  return (
    <div className="app-layout">
      <Sidebar user={user} onLogout={handleLogout} />

      <main className="main-content page-enter">
        {/* Topbar */}
        <div className="topbar" style={{ marginBottom: 20, paddingBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => navigate("/admin")}
              style={{ flexShrink: 0 }}
            >
              ← Back
            </button>
            <div>
              <h1 className="topbar-title" style={{ fontSize: 22 }}>{pageTitle}</h1>
              <p className="topbar-subtitle">
                {filteredExecutives.length} executive{filteredExecutives.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <div className="topbar-actions">
            <button
              className={`btn btn-sm ${!filter ? "btn-primary" : "btn-secondary"}`}
              onClick={() => navigate("/admin/executives")}
            >
              👥 All
            </button>
            <button
              className={`btn btn-sm ${filter === "updated" ? "btn-success" : "btn-secondary"}`}
              onClick={() => navigate("/admin/executives?filter=updated")}
            >
              ✅ Updated
            </button>
            <button
              className={`btn btn-sm ${filter === "not-updated" ? "btn-danger" : "btn-secondary"}`}
              onClick={() => navigate("/admin/executives?filter=not-updated")}
            >
              ⏰ Not Updated
            </button>
          </div>
        </div>

        {loading ? (
          <div className="spinner-overlay">
            <div className="spinner" />
          </div>
        ) : filteredExecutives.length === 0 ? (
          <div className="card">
            <div className="empty-state" style={{ padding: "80px 24px" }}>
              <div className="empty-icon">👤</div>
              <div className="empty-title">No Executives Found</div>
              <div className="empty-desc">No executives match the selected filter.</div>
            </div>
          </div>
        ) : (
          <div className="card">
            <div className="card-header">
              <div className="section-header" style={{ margin: 0 }}>
                <div className="section-header-icon" />
                <h2 className="card-title">{pageTitle}</h2>
              </div>
              <span className="badge badge-purple">{filteredExecutives.length}</span>
            </div>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Executive</th>
                    <th>Email</th>
                    <th>Today's Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExecutives.map((exec, idx) => (
                    <tr key={exec._id} id={`exec-row-${exec._id}`}>
                      <td className="text-muted" style={{ fontSize: 13 }}>{idx + 1}</td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div className="exec-avatar">{getInitials(exec.name)}</div>
                          <div className="fw-600 text-primary">{exec.name}</div>
                        </div>
                      </td>
                      <td className="text-muted">{exec.email}</td>
                      <td>
                        <span
                          className={`badge ${exec.status === "Updated" ? "badge-success" : "badge-danger"}`}
                        >
                          {exec.status === "Updated" ? "✓ Updated" : "✗ Not Updated"}
                        </span>
                      </td>
                      <td>
                        <button
                          id={`view-activities-${exec._id}`}
                          className="btn btn-secondary btn-sm"
                          onClick={() =>
                            navigate("/admin", { state: { autoSelectExec: exec } })
                          }
                        >
                          View Activities →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminExecutives;
