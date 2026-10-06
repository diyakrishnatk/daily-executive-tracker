import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import Sidebar from "../components/Sidebar";

function ExecutiveDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [stats, setStats] = useState({
    totalVisits: 0,
    totalCases: 0,
    totalSales: 0,
    totalCollection: 0,
    pendingFollowUps: [],
  });
  const [loading, setLoading] = useState(true);
  const [todayActivities, setTodayActivities] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const fetchDashboardStats = async () => {
    try {
      const response = await API.get("/activities/dashboard-stats");
      const activitiesResponse = await API.get("/activities/my");
     
      const todayDate = new Date();

const todayList = (activitiesResponse.data || []).filter((item) => {
  const activityDate = new Date(item.date);

  return (
    activityDate.getDate() === todayDate.getDate() &&
    activityDate.getMonth() === todayDate.getMonth() &&
    activityDate.getFullYear() === todayDate.getFullYear()
  );
});

setTodayActivities(todayList);

      setStats({
        totalVisits: response.data.totalVisits || 0,
        totalCases: response.data.totalCases || 0,
        totalSales: response.data.totalSales || 0,
        totalCollection: response.data.totalCollection || 0,
        pendingFollowUps: response.data.pendingFollowUps || [],
      });
    } catch (error) {
      console.error("Dashboard stats error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const formatCurrency = (val) =>
    new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(val || 0);

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="app-layout">
      <Sidebar user={user} onLogout={handleLogout} />

      <main className="main-content page-enter">
        {/* Topbar */}
        <div className="topbar" style={{ marginBottom: 20, paddingBottom: 14 }}>
          <div>
            <h1 className="topbar-title" style={{ fontSize: 22 }}>
              Good {new Date().getHours() < 12 ? "Morning" : new Date().getHours() < 17 ? "Afternoon" : "Evening"},{" "}
              {user?.name?.split(" ")[0] || "Executive"} 👋
            </h1>
            <p className="topbar-subtitle">{today}</p>
          </div>
          <div className="topbar-actions">
            <button
              id="add-activity-btn"
              className="btn btn-primary"
              onClick={() => navigate("/add-activity")}
            >
              ➕ Add Activity
            </button>
          </div>
        </div>

        {loading ? (
          <div className="spinner-overlay">
            <div className="spinner" />
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="stats-grid" style={{ marginBottom: 20 }}>
              <div
                className="stat-card blue"
                id="card-exec-visits"
                style={{ padding: "18px 22px" }}
              >
                <div className="stat-icon blue" style={{ width: 44, height: 44, fontSize: 20, marginBottom: 12 }}>🏃</div>
                <div className="stat-label">Today's Visits</div>
                <div className="stat-value" style={{ fontSize: 28 }}>{stats.totalVisits}</div>
              </div>
              <div
                className="stat-card purple"
                id="card-exec-cases"
                style={{ padding: "18px 22px" }}
              >
                <div className="stat-icon purple" style={{ width: 44, height: 44, fontSize: 20, marginBottom: 12 }}>📦</div>
                <div className="stat-label">Total Cases</div>
                <div className="stat-value" style={{ fontSize: 28 }}>{stats.totalCases}</div>
              </div>
              <div
                className="stat-card green"
                id="card-exec-sales"
                style={{ padding: "18px 22px" }}
              >
                <div className="stat-icon green" style={{ width: 44, height: 44, fontSize: 20, marginBottom: 12 }}>💰</div>
                <div className="stat-label">Total Sales</div>
                <div className="stat-value rupee" style={{ fontSize: 28 }}>{formatCurrency(stats.totalSales)}</div>
              </div>
              <div
                className="stat-card orange"
                id="card-exec-collection"
                style={{ padding: "18px 22px" }}
              >
                <div className="stat-icon orange" style={{ width: 44, height: 44, fontSize: 20, marginBottom: 12 }}>🏦</div>
                <div className="stat-label">Total Collection</div>
                <div className="stat-value rupee" style={{ fontSize: 28 }}>{formatCurrency(stats.totalCollection)}</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
                marginBottom: 28,
              }}
            >
              <button
                id="quick-add-activity"
                onClick={() => navigate("/add-activity")}
                className="card"
                style={{
                  padding: "20px 24px",
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  cursor: "pointer",
                  border: "1px solid var(--border)",
                  background: "var(--bg-card)",
                  transition: "var(--transition)",
                  textAlign: "left",
                  width: "100%",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--bg-card-hover)";
                  e.currentTarget.style.borderColor = "rgba(99,102,241,0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--bg-card)";
                  e.currentTarget.style.borderColor = "var(--border)";
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    background: "var(--accent-gradient)",
                    borderRadius: "var(--radius-md)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                    boxShadow: "var(--shadow-glow)",
                    flexShrink: 0,
                  }}
                >
                  ➕
                </div>
                <div>
                  <div className="fw-700 text-primary">Log Today's Activity</div>
                  <div className="text-sm text-muted">Record a new visit or order</div>
                </div>
              </button>

              <button
                id="quick-view-history"
                onClick={() => navigate("/activity-history")}
                className="card"
                style={{
                  padding: "20px 24px",
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  cursor: "pointer",
                  border: "1px solid var(--border)",
                  background: "var(--bg-card)",
                  transition: "var(--transition)",
                  textAlign: "left",
                  width: "100%",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--bg-card-hover)";
                  e.currentTarget.style.borderColor = "rgba(99,102,241,0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--bg-card)";
                  e.currentTarget.style.borderColor = "var(--border)";
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    background: "linear-gradient(135deg, #10b981, #34d399)",
                    borderRadius: "var(--radius-md)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                    boxShadow: "0 4px 20px rgba(16,185,129,0.25)",
                    flexShrink: 0,
                  }}
                >
                  📋
                </div>
                <div>
                  <div className="fw-700 text-primary">View History</div>
                  <div className="text-sm text-muted">Browse & manage past activities</div>
                </div>
              </button>
            </div>

            {/* Today's Activities */}
<div className="card" style={{ marginBottom: 28 }}>
  <div className="card-header">
    <div className="section-header" style={{ margin: 0 }}>
      <div className="section-header-icon" />
      <h2 className="card-title">Today's Activities</h2>
    </div>

    <span className="badge badge-info">
      {todayActivities.length} activities
    </span>
  </div>

  <div className="card-body" style={{ padding: 0 }}>
    {todayActivities.length === 0 ? (
      <div className="empty-state" style={{ padding: "32px 24px" }}>
        <div className="empty-icon">📋</div>
        <div className="empty-title">No Activities Today</div>
        <div className="empty-desc">
          You have not added any activity today.
        </div>
      </div>
    ) : (
      <div style={{ overflowX: "auto" }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Dealer</th>
              <th>Location</th>
              <th>Activity</th>
              <th>Cases</th>
              <th>Sales</th>
              <th>Collection</th>
              <th>Remarks</th>
            </tr>
          </thead>

          <tbody>
            {todayActivities.map((item) => (
              <tr key={item._id}>
                <td>{item.dealerName}</td>
                <td>{item.location}</td>
                <td>{item.activity}</td>
                <td>{item.cases || 0}</td>
                <td>₹{formatCurrency(item.salesAmount)}</td>
                <td>₹{formatCurrency(item.collectionAmount)}</td>
                <td>{item.remarks || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
</div>

            {/* Pending Follow-ups */}
            <div className="card">
              <div className="card-header">
                <div className="section-header" style={{ margin: 0 }}>
                  <div className="section-header-icon" />
                  <h2 className="card-title">Pending Follow-ups</h2>
                </div>
                <span className="badge badge-warning">
                  {stats.pendingFollowUps.length} pending
                </span>
              </div>
              <div className="card-body" style={{ padding: "16px 24px" }}>
                {stats.pendingFollowUps.length === 0 ? (
                  <div className="empty-state" style={{ padding: "32px 24px" }}>
                    <div className="empty-icon">✅</div>
                    <div className="empty-title">No Pending Follow-ups</div>
                    <div className="empty-desc">You're all caught up! No upcoming follow-ups.</div>
                  </div>
                ) : (
                  <div className="followup-list">
                    {stats.pendingFollowUps.map((item) => (
                      <div key={item.id} className="followup-item">
                        <div className="followup-dot" />
                        <div className="followup-name">{item.dealerName}</div>
                        <div className="followup-date">
                          📅{" "}
                          {item.nextFollowUp
                            ? new Date(item.nextFollowUp).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                            : "—"}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default ExecutiveDashboard;