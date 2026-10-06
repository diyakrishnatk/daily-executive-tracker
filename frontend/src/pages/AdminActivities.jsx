import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import Sidebar from "../components/Sidebar";

function AdminActivities() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [activities, setActivities] = useState([]);
  const [executives, setExecutives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState("");
  const [dealerFilter, setDealerFilter] = useState("");
  const [execFilter, setExecFilter] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const fetchAllActivities = async () => {
    setLoading(true);
    try {
      const statsRes = await API.get("/activities/admin-dashboard-stats");
      const execs = statsRes.data.executives || [];
      setExecutives(execs);

      const allActivities = [];
      for (const exec of execs) {
        try {
          const res = await API.get(`/activities/admin/executive/${exec._id}`);
          const withExec = (res.data || []).map((a) => ({
            ...a,
            executiveName: exec.name,
            executiveId: exec._id,
          }));
          allActivities.push(...withExec);
        } catch (e) {
          console.error(`Failed to fetch activities for ${exec.name}`, e);
        }
      }
      // Sort by date descending
      allActivities.sort((a, b) => new Date(b.date) - new Date(a.date));
      setActivities(allActivities);
    } catch (error) {
      console.error("All activities fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllActivities();
  }, []);

  const filteredActivities = activities.filter((a) => {
    const dateStr = a.date ? new Date(a.date).toISOString().split("T")[0] : "";
    const matchDate = !dateFilter || dateStr === dateFilter;
    const matchDealer =
      !dealerFilter ||
      (a.dealerName || "").toLowerCase().includes(dealerFilter.toLowerCase());
    const matchExec = !execFilter || a.executiveId === execFilter;
    return matchDate && matchDealer && matchExec;
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

  const clearFilters = () => {
    setExecFilter("");
    setDateFilter("");
    setDealerFilter("");
  };

  const hasFilters = execFilter || dateFilter || dealerFilter;

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
              <h1 className="topbar-title" style={{ fontSize: 22 }}>All Activities</h1>
              <p className="topbar-subtitle">
                {filteredActivities.length} activit
                {filteredActivities.length !== 1 ? "ies" : "y"} found
              </p>
            </div>
          </div>
          <div className="topbar-actions">
            <button
              className="btn btn-secondary btn-sm"
              onClick={fetchAllActivities}
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <div className="spinner-overlay">
            <div className="spinner" />
          </div>
        ) : (
          <div className="card">
            {/* Filters */}
            <div
              className="card-header"
              style={{ flexWrap: "wrap", gap: 12, alignItems: "flex-end" }}
            >
              <div className="section-header" style={{ margin: 0, flex: "none" }}>
                <div className="section-header-icon" />
                <h2 className="card-title">Activity Log</h2>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  flexWrap: "wrap",
                  alignItems: "center",
                  flex: 1,
                  justifyContent: "flex-end",
                }}
              >
                <select
                  id="filter-executive"
                  className="form-input"
                  style={{ minWidth: 170 }}
                  value={execFilter}
                  onChange={(e) => setExecFilter(e.target.value)}
                >
                  <option value="">All Executives</option>
                  {executives.map((exec) => (
                    <option key={exec._id} value={exec._id}>
                      {exec.name}
                    </option>
                  ))}
                </select>
                <input
                  id="filter-date"
                  type="date"
                  className="form-input"
                  style={{ minWidth: 150 }}
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                />
                <input
                  id="filter-dealer"
                  type="text"
                  className="form-input"
                  placeholder="Search dealer..."
                  style={{ minWidth: 160 }}
                  value={dealerFilter}
                  onChange={(e) => setDealerFilter(e.target.value)}
                />
                {hasFilters && (
                  <button
                    id="clear-filters-btn"
                    className="btn btn-secondary btn-sm"
                    onClick={clearFilters}
                  >
                    ✕ Clear
                  </button>
                )}
                <div
                  style={{
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
            </div>

            {filteredActivities.length === 0 ? (
              <div className="empty-state" style={{ padding: "60px 24px" }}>
                <div className="empty-icon">📭</div>
                <div className="empty-title">No Activities Found</div>
                <div className="empty-desc">
                  {activities.length === 0
                    ? "No activities have been logged yet."
                    : "No activities match the selected filters."}
                </div>
              </div>
            ) : (
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Executive</th>
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
                      <tr key={`${a._id}-${a.executiveId}`}>
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
                          <div className="fw-600 text-primary">{a.executiveName}</div>
                        </td>
                        <td>
                          <div className="fw-600">{a.dealerName}</div>
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
                              maxWidth: 130,
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
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminActivities;
