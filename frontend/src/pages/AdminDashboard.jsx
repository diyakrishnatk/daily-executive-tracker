import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../api";
import Sidebar from "../components/Sidebar";

function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [selectedExecutive, setSelectedExecutive] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [dealerSearch, setDealerSearch] = useState("");
  const [executiveActivities, setExecutiveActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(false);

  const [stats, setStats] = useState({
    totalExecutives: 0,
    updatedToday: 0,
    notUpdatedToday: 0,
    totalVisits: 0,
    totalCases: 0,
    totalSales: 0,
    totalCollection: 0,
    executives: [],
  });
  const [loadingStats, setLoadingStats] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const fetchAdminStats = async () => {
    try {
      const response = await API.get("/activities/admin-dashboard-stats");
      setStats({
        totalExecutives: response.data.totalExecutives || 0,
        updatedToday: response.data.updatedToday || 0,
        notUpdatedToday: response.data.notUpdatedToday || 0,
        totalVisits: response.data.totalVisits || 0,
        totalCases: response.data.totalCases || 0,
        totalSales: response.data.totalSales || 0,
        totalCollection: response.data.totalCollection || 0,
        executives: response.data.executives || [],
      });
    } catch (error) {
      console.error("Admin dashboard error:", error);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchExecutiveActivities = async (exec) => {
    if (!exec) {
      setExecutiveActivities([]);
      return;
    }
    setLoadingActivities(true);
    try {
      const response = await API.get(`/activities/admin/executive/${exec._id}`);
      setExecutiveActivities(response.data);
    } catch (error) {
      console.error("Executive activities error:", error);
      setExecutiveActivities([]);
    } finally {
      setLoadingActivities(false);
    }
  };

  // Auto-select an executive passed via navigation state (from AdminExecutives page)
  useEffect(() => {
    const autoExec = location.state?.autoSelectExec;
    if (autoExec) {
      setSelectedExecutive(autoExec);
      fetchExecutiveActivities(autoExec);
      // Clear state so back/forward navigation doesn't re-trigger
      window.history.replaceState({}, "");
    }
  }, [location.state]);

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const filteredActivities = executiveActivities.filter((a) => {
    const dateStr = a.date ? new Date(a.date).toISOString().split("T")[0] : "";
    const matchDate = !selectedDate || dateStr === selectedDate;
    const matchDealer =
      !dealerSearch ||
      a.dealerName.toLowerCase().includes(dealerSearch.toLowerCase());
    return matchDate && matchDealer;
  });

  const formatCurrency = (v) =>
    new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(v || 0);

  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "—";

  const getInitials = (name) =>
    name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      : "?";

  return (
    <div className="app-layout">
      <Sidebar user={user} onLogout={handleLogout} />

      <main className="main-content page-enter">
        {/* Topbar */}
        <div className="topbar" style={{ marginBottom: 16, paddingBottom: 14 }}>
          <div>
            <h1 className="topbar-title" style={{ fontSize: 22 }}>Admin Dashboard</h1>
            <p className="topbar-subtitle">
              {new Date().toLocaleDateString("en-IN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="topbar-actions">
            <button
              id="refresh-stats-btn"
              className="btn btn-secondary"
              onClick={fetchAdminStats}
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {loadingStats ? (
          <div className="spinner-overlay">
            <div className="spinner" />
          </div>
        ) : (
          <>
            {/* Executive summary stats */}
            <div className="stats-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)", marginBottom: 16 }}>
              <div
                className="stat-card blue"
                id="card-total-executives"
                style={{ padding: "16px 20px" }}
              >
                <div className="stat-icon blue" style={{ width: 40, height: 40, fontSize: 18, marginBottom: 10 }}>👥</div>
                <div className="stat-label">Total Executives</div>
                <div className="stat-value" style={{ fontSize: 26 }}>{stats.totalExecutives}</div>
              </div>
              <div
                className="stat-card green"
                id="card-updated-today"
                style={{ padding: "16px 20px" }}
              >
                <div className="stat-icon green" style={{ width: 40, height: 40, fontSize: 18, marginBottom: 10 }}>✅</div>
                <div className="stat-label">Updated Today</div>
                <div className="stat-value" style={{ fontSize: 26 }}>{stats.updatedToday}</div>
              </div>
              <div
                className="stat-card red"
                id="card-not-updated"
                style={{ padding: "16px 20px" }}
              >
                <div className="stat-icon red" style={{ width: 40, height: 40, fontSize: 18, marginBottom: 10 }}>⏰</div>
                <div className="stat-label">Not Updated</div>
                <div className="stat-value" style={{ fontSize: 26 }}>{stats.notUpdatedToday}</div>
              </div>
            </div>

            {/* Activity stats */}
            <div className="stats-grid" style={{ marginBottom: 16 }}>
              <div
                className="stat-card purple"
                id="card-today-visits"
                style={{ padding: "16px 20px" }}
              >
                <div className="stat-icon purple" style={{ width: 40, height: 40, fontSize: 18, marginBottom: 10 }}>🏃</div>
                <div className="stat-label">Today's Visits</div>
                <div className="stat-value" style={{ fontSize: 26 }}>{stats.totalVisits}</div>
              </div>
              <div
                className="stat-card blue"
                id="card-total-cases"
                style={{ padding: "16px 20px" }}
              >
                <div className="stat-icon blue" style={{ width: 40, height: 40, fontSize: 18, marginBottom: 10 }}>📦</div>
                <div className="stat-label">Total Cases</div>
                <div className="stat-value" style={{ fontSize: 26 }}>{stats.totalCases}</div>
              </div>
              <div
                className="stat-card green"
                id="card-total-sales"
                style={{ padding: "16px 20px" }}
              >
                <div className="stat-icon green" style={{ width: 40, height: 40, fontSize: 18, marginBottom: 10 }}>💰</div>
                <div className="stat-label">Total Sales</div>
                <div className="stat-value rupee" style={{ fontSize: 26 }}>{formatCurrency(stats.totalSales)}</div>
              </div>
              <div
                className="stat-card orange"
                id="card-total-collection"
                style={{ padding: "16px 20px" }}
              >
                <div className="stat-icon orange" style={{ width: 40, height: 40, fontSize: 18, marginBottom: 10 }}>🏦</div>
                <div className="stat-label">Total Collection</div>
                <div className="stat-value rupee" style={{ fontSize: 26 }}>{formatCurrency(stats.totalCollection)}</div>
              </div>
            </div>

            {/* Two-column layout: Executive list + Detail view */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "280px 1fr",
                gap: 14,
                alignItems: "start",
              }}
            >
              {/* LEFT: Executive list */}
              <div className="card">
                <div className="card-header">
                  <div className="section-header" style={{ margin: 0 }}>
                    <div className="section-header-icon" />
                    <h2 className="card-title">Executives</h2>
                  </div>
                  <span className="badge badge-purple">{stats.executives.length}</span>
                </div>
                <div style={{ padding: "12px" }}>
                  {stats.executives.length === 0 ? (
                    <div className="empty-state" style={{ padding: "32px 16px" }}>
                      <div className="empty-icon">👤</div>
                      <div className="empty-title">No Executives</div>
                      <div className="empty-desc">No executive accounts found.</div>
                    </div>
                  ) : (
                    stats.executives.map((exec) => (
                      <div
                        key={exec._id}
                        id={`exec-row-${exec._id}`}
                        className={`exec-row ${selectedExecutive?._id === exec._id ? "selected" : ""}`}
                        onClick={() => {
                          setSelectedExecutive(exec);
                          setSelectedDate("");
                          setDealerSearch("");
                          fetchExecutiveActivities(exec);
                        }}
                      >
                        <div className="exec-avatar">{getInitials(exec.name)}</div>
                        <div className="exec-info">
                          <div className="exec-name">{exec.name}</div>
                          <div className="exec-email">{exec.email}</div>
                        </div>
                        <span
                          className={`badge ${
                            exec.status === "Updated" ? "badge-success" : "badge-danger"
                          }`}
                        >
                          {exec.status === "Updated" ? "✓" : "✗"}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* RIGHT: Activities detail */}
              <div className="card">
                {!selectedExecutive ? (
                  <div className="empty-state" style={{ padding: "80px 24px" }}>
                    <div className="empty-icon">👆</div>
                    <div className="empty-title">Select an Executive</div>
                    <div className="empty-desc">
                      Click on an executive from the left panel to view their
                      activity details.
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="card-header">
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div className="exec-avatar">{getInitials(selectedExecutive.name)}</div>
                        <div>
                          <div className="card-title">{selectedExecutive.name}</div>
                          <div className="text-xs text-muted">{selectedExecutive.email}</div>
                        </div>
                      </div>
                      <span
                        className={`badge ${
                          selectedExecutive.status === "Updated"
                            ? "badge-success"
                            : "badge-danger"
                        }`}
                      >
                        {selectedExecutive.status}
                      </span>
                    </div>

                    {/* Filters */}
                    <div
                      style={{
                        padding: "12px 20px",
                        borderBottom: "1px solid var(--border)",
                        display: "flex",
                        gap: 12,
                        flexWrap: "wrap",
                        alignItems: "flex-end",
                      }}
                    >
                      <div className="filter-group" style={{ minWidth: 160, flex: 1 }}>
                        <label className="filter-label">📅 Date</label>
                        <input
                          id="admin-filter-date"
                          type="date"
                          className="form-input"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                        />
                      </div>
                      <div className="filter-group" style={{ minWidth: 180, flex: 1 }}>
                        <label className="filter-label">🔍 Dealer</label>
                        <input
                          id="admin-filter-dealer"
                          type="text"
                          className="form-input"
                          placeholder="Search dealer..."
                          value={dealerSearch}
                          onChange={(e) => setDealerSearch(e.target.value)}
                        />
                      </div>
                      {(selectedDate || dealerSearch) && (
                        <button
                          id="admin-clear-filters"
                          className="btn btn-secondary btn-sm"
                          style={{ alignSelf: "flex-end" }}
                          onClick={() => {
                            setSelectedDate("");
                            setDealerSearch("");
                          }}
                        >
                          ✕ Clear
                        </button>
                      )}
                      <div
                        style={{
                          alignSelf: "flex-end",
                          padding: "8px 12px",
                          background: "var(--bg-input)",
                          border: "1px solid var(--border)",
                          borderRadius: "var(--radius-md)",
                          fontSize: 12,
                          color: "var(--text-muted)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {filteredActivities.length} result
                        {filteredActivities.length !== 1 ? "s" : ""}
                      </div>
                    </div>

                    {/* Table */}
                    {loadingActivities ? (
                      <div className="spinner-overlay">
                        <div className="spinner" />
                      </div>
                    ) : filteredActivities.length === 0 ? (
                      <div className="empty-state">
                        <div className="empty-icon">📭</div>
                        <div className="empty-title">No Activities Found</div>
                        <div className="empty-desc">
                          {executiveActivities.length === 0
                            ? "This executive has not logged any activities yet."
                            : "No activities match the selected filters."}
                        </div>
                      </div>
                    ) : (
                      <div className="table-wrapper">
                        <table className="data-table">
                          <thead>
                            <tr>
                              <th>Date</th>
                              <th>Dealer</th>
                              <th>Location</th>
                              <th>Activity</th>
                              <th>Cases</th>
                              <th>Sales</th>
                              <th>Collection</th>
                              <th>Remarks</th>
                              <th>Follow-up</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredActivities.map((a) => (
                              <tr key={a._id}>
                                <td>
                                  <span
                                    style={{
                                      background: "var(--bg-input)",
                                      padding: "3px 8px",
                                      borderRadius: "var(--radius-sm)",
                                      fontSize: 12,
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    {formatDate(a.date)}
                                  </span>
                                </td>
                                <td>
                                  <div className="fw-600 text-primary">{a.dealerName}</div>
                                </td>
                                <td>📍 {a.location}</td>
                                <td>
                                  <span className="badge badge-info">{a.activity}</span>
                                </td>
                                <td className="fw-600">{a.cases || 0}</td>
                                <td>
                                  <span className="text-success fw-600">
                                    ₹{formatCurrency(a.salesAmount)}
                                  </span>
                                </td>
                                <td>
                                  <span className="text-warning fw-600">
                                    ₹{formatCurrency(a.collectionAmount)}
                                  </span>
                                </td>
                                <td>
                                  <span
                                    style={{
                                      maxWidth: 140,
                                      display: "block",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                    }}
                                    title={a.remarks}
                                  >
                                    {a.remarks || <span className="text-muted">—</span>}
                                  </span>
                                </td>
                                <td>
                                  {a.nextFollowUp ? (
                                    <span className="badge badge-warning">
                                      {formatDate(a.nextFollowUp)}
                                    </span>
                                  ) : (
                                    <span className="text-muted">—</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;