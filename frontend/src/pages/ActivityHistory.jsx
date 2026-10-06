import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import Sidebar from "../components/Sidebar";

function ActivityHistory() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [searchDealer, setSearchDealer] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const fetchActivities = async () => {
    try {
      const response = await API.get("/activities/my");
      setActivities(response.data.activities || response.data);
    } catch (error) {
      console.error("Error fetching activities:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await API.delete(`/activities/${id}`);
      setActivities((prev) => prev.filter((a) => a._id !== id));
      setConfirmDeleteId(null);
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setDeletingId(null);
    }
  };

  // Filter
  const filtered = activities.filter((a) => {
    const dateStr = a.date ? new Date(a.date).toISOString().split("T")[0] : "";
    const matchDate = !filterDate || dateStr === filterDate;
    const matchDealer =
      !searchDealer ||
      a.dealerName.toLowerCase().includes(searchDealer.toLowerCase());
    return matchDate && matchDealer;
  });

  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "—";

  const formatCurrency = (v) =>
    new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(v || 0);

  return (
    <div className="app-layout">
      <Sidebar user={user} onLogout={handleLogout} />

      <main className="main-content page-enter">
        {/* Topbar */}
        <div className="topbar">
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => navigate("/")}
              style={{ flexShrink: 0 }}
            >
              ← Back
            </button>
            <div>
              <h1 className="topbar-title">Activity History</h1>
              <p className="topbar-subtitle">
                {activities.length} total activities logged
              </p>
            </div>
          </div>
          <div className="topbar-actions">
            <button
              id="add-new-activity-btn"
              className="btn btn-primary"
              onClick={() => navigate("/add-activity")}
            >
              ➕ Add Activity
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="filter-bar">
          <div className="filter-group">
            <label className="filter-label">📅 Filter by Date</label>
            <input
              id="filter-date"
              type="date"
              className="form-input"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label className="filter-label">🔍 Search Dealer / Customer</label>
            <input
              id="filter-dealer"
              type="text"
              className="form-input"
              placeholder="Type dealer name..."
              value={searchDealer}
              onChange={(e) => setSearchDealer(e.target.value)}
            />
          </div>
          {(filterDate || searchDealer) && (
            <button
              id="clear-filters-btn"
              className="btn btn-secondary"
              style={{ alignSelf: "flex-end" }}
              onClick={() => {
                setFilterDate("");
                setSearchDealer("");
              }}
            >
              ✕ Clear
            </button>
          )}
          <div
            style={{
              alignSelf: "flex-end",
              padding: "9px 14px",
              background: "var(--bg-input)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              fontSize: 13,
              color: "var(--text-muted)",
              whiteSpace: "nowrap",
            }}
          >
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </div>
        </div>

        {/* Content */}
        <div className="card">
          {loading ? (
            <div className="spinner-overlay">
              <div className="spinner" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <div className="empty-title">
                {activities.length === 0
                  ? "No Activities Yet"
                  : "No Results Found"}
              </div>
              <div className="empty-desc">
                {activities.length === 0
                  ? "Start by adding your first daily activity."
                  : "Try adjusting your filters."}
              </div>
              {activities.length === 0 && (
                <button
                  className="btn btn-primary mt-16"
                  onClick={() => navigate("/add-activity")}
                >
                  ➕ Add First Activity
                </button>
              )}
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Dealer / Customer</th>
                    <th>Location</th>
                    <th>Activity</th>
                    <th>Cases</th>
                    <th>Sales</th>
                    <th>Collection</th>
                    <th>Remarks</th>
                    <th>Follow-up</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item) => (
                    <tr key={item._id}>
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
                          {formatDate(item.date)}
                        </span>
                      </td>
                      <td>
                        <div className="fw-600 text-primary">{item.dealerName}</div>
                      </td>
                      <td>
                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          📍 {item.location}
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-info">{item.activity}</span>
                      </td>
                      <td>
                        <span className="fw-600">{item.cases || 0}</span>
                      </td>
                      <td>
                        <span className="text-success fw-600">
                          ₹{formatCurrency(item.salesAmount)}
                        </span>
                      </td>
                      <td>
                        <span className="text-warning fw-600">
                          ₹{formatCurrency(item.collectionAmount)}
                        </span>
                      </td>
                      <td>
                        <span
                          style={{
                            maxWidth: 160,
                            display: "block",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                          title={item.remarks}
                        >
                          {item.remarks || <span className="text-muted">—</span>}
                        </span>
                      </td>
                      <td>
                        {item.nextFollowUp ? (
                          <span className="badge badge-warning">
                            {formatDate(item.nextFollowUp)}
                          </span>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                      <td>
                        {confirmDeleteId === item._id ? (
                          <div style={{ display: "flex", gap: 6 }}>
                            <button
                              id={`confirm-delete-${item._id}`}
                              className="btn btn-danger btn-sm"
                              disabled={deletingId === item._id}
                              onClick={() => handleDelete(item._id)}
                            >
                              {deletingId === item._id ? "..." : "Confirm"}
                            </button>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => setConfirmDeleteId(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div style={{ display: "flex", gap: 6 }}>
                            <button
                              id={`edit-btn-${item._id}`}
                              className="btn btn-warning btn-sm"
                              onClick={() =>
                                navigate(`/edit-activity?id=${item._id}`)
                              }
                            >
                              ✏️ Edit
                            </button>
                            <button
                              id={`delete-btn-${item._id}`}
                              className="btn btn-danger btn-sm"
                              onClick={() => setConfirmDeleteId(item._id)}
                            >
                              🗑️
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default ActivityHistory;