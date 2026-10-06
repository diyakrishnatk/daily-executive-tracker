import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import Sidebar from "../components/Sidebar";

function EditActivity() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const id = new URLSearchParams(window.location.search).get("id");

  const [activity, setActivity] = useState({
    date: "",
    dealerName: "",
    location: "",
    activity: "",
    cases: "",
    salesAmount: "",
    collectionAmount: "",
    remarks: "",
    nextFollowUp: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  useEffect(() => {
    if (!id) {
      navigate("/activity-history");
      return;
    }
    fetchActivity();
  }, [id]);

  const fetchActivity = async () => {
    try {
      const response = await API.get(`/activities/${id}`);
      const selected = response.data;

      if (!selected) {
        navigate("/activity-history");
        return;
      }

      setActivity({
        date: selected.date
          ? new Date(selected.date).toISOString().split("T")[0]
          : "",
        dealerName: selected.dealerName || "",
        location: selected.location || "",
        activity: selected.activity || "",
        cases: selected.cases ?? "",
        salesAmount: selected.salesAmount ?? "",
        collectionAmount: selected.collectionAmount ?? "",
        remarks: selected.remarks || "",
        nextFollowUp: selected.nextFollowUp
          ? new Date(selected.nextFollowUp).toISOString().split("T")[0]
          : "",
      });
    } catch (error) {
      console.error("Error loading activity:", error);
      navigate("/activity-history");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setActivity((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!activity.date) newErrors.date = "Date is required.";
    if (!activity.dealerName.trim()) newErrors.dealerName = "Dealer / customer name is required.";
    if (!activity.location.trim()) newErrors.location = "Location is required.";
    if (!activity.activity.trim()) newErrors.activity = "Visit / activity is required.";
    if (activity.cases !== "" && Number(activity.cases) < 0)
      newErrors.cases = "Cases cannot be negative.";
    if (activity.salesAmount !== "" && Number(activity.salesAmount) < 0)
      newErrors.salesAmount = "Sales amount cannot be negative.";
    if (activity.collectionAmount !== "" && Number(activity.collectionAmount) < 0)
      newErrors.collectionAmount = "Collection amount cannot be negative.";
    return newErrors;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSuccessMsg("");

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSaving(true);
    try {
      await API.put(`/activities/${id}`, {
        ...activity,
        cases: Number(activity.cases) || 0,
        salesAmount: Number(activity.salesAmount) || 0,
        collectionAmount: Number(activity.collectionAmount) || 0,
      });

      setSuccessMsg("Activity updated successfully! ✅");
      setTimeout(() => navigate("/activity-history"), 1500);
    } catch (error) {
      setErrors({
        submit: error.response?.data?.message || "Failed to update activity.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="app-layout">
      <Sidebar user={user} onLogout={handleLogout} />

      <main className="main-content page-enter">
        {/* Topbar */}
        <div className="topbar">
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button
              id="back-to-history"
              className="btn btn-secondary btn-sm"
              onClick={() => navigate("/activity-history")}
              style={{ flexShrink: 0 }}
            >
              ← Back
            </button>
            <div>
              <h1 className="topbar-title">Edit Activity</h1>
              <p className="topbar-subtitle">Update the details of your activity</p>
            </div>
          </div>
        </div>

        {/* Success */}
        {successMsg && (
          <div
            style={{
              background: "var(--success-bg)",
              border: "1px solid rgba(16,185,129,0.3)",
              borderRadius: "var(--radius-md)",
              padding: "12px 16px",
              marginBottom: 20,
              color: "var(--success)",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            {successMsg}
          </div>
        )}

        {/* Submit error */}
        {errors.submit && (
          <div className="toast-error mb-16">{errors.submit}</div>
        )}

        <div className="card">
          <div className="card-header">
            <div className="section-header" style={{ margin: 0 }}>
              <div className="section-header-icon" style={{ background: "linear-gradient(135deg, #f59e0b, #fbbf24)" }} />
              <h2 className="card-title">Edit Activity Details</h2>
            </div>
          </div>
          <div className="card-body">
            {loading ? (
              <div className="spinner-overlay">
                <div className="spinner" />
              </div>
            ) : (
              <form id="edit-activity-form" onSubmit={handleUpdate}>
                <div style={{ marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                  <span className="badge badge-purple">Step 1</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-secondary)" }}>Activity Overview</span>
                </div>
                <div className="form-grid">
                  {/* Date */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="edit-date">
                      Date <span className="required">*</span>
                    </label>
                    <input
                      id="edit-date"
                      type="date"
                      name="date"
                      className="form-input"
                      value={activity.date}
                      onChange={handleChange}
                      required
                    />
                    {errors.date && <span className="form-error">{errors.date}</span>}
                  </div>

                  {/* Dealer Name */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="edit-dealer">
                      Dealer / Customer Name <span className="required">*</span>
                    </label>
                    <input
                      id="edit-dealer"
                      type="text"
                      name="dealerName"
                      className="form-input"
                      placeholder="e.g., Sharma Traders"
                      value={activity.dealerName}
                      onChange={handleChange}
                      required
                    />
                    {errors.dealerName && (
                      <span className="form-error">{errors.dealerName}</span>
                    )}
                  </div>

                  {/* Location */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="edit-location">
                      Location <span className="required">*</span>
                    </label>
                    <input
                      id="edit-location"
                      type="text"
                      name="location"
                      className="form-input"
                      placeholder="e.g., Mumbai, Andheri"
                      value={activity.location}
                      onChange={handleChange}
                      required
                    />
                    {errors.location && (
                      <span className="form-error">{errors.location}</span>
                    )}
                  </div>

                  {/* Activity */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="edit-activity">
                      Visit / Activity <span className="required">*</span>
                    </label>
                    <input
                      id="edit-activity"
                      type="text"
                      name="activity"
                      className="form-input"
                      placeholder="e.g., Dealer Visit, Product Demo"
                      value={activity.activity}
                      onChange={handleChange}
                      required
                    />
                    {errors.activity && (
                      <span className="form-error">{errors.activity}</span>
                    )}
                  </div>
                </div>

                {/* Amounts */}
                <div style={{ marginTop: 24, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                  <span className="badge badge-info">Step 2</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-secondary)" }}>Commercial & Order Metrics</span>
                </div>
                <div className="form-grid cols-3">
                  <div className="form-group">
                    <label className="form-label" htmlFor="edit-cases">
                      Order / Cases
                    </label>
                    <input
                      id="edit-cases"
                      type="number"
                      name="cases"
                      className="form-input"
                      placeholder="0"
                      min="0"
                      value={activity.cases}
                      onChange={handleChange}
                    />
                    {errors.cases && <span className="form-error">{errors.cases}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="edit-sales">
                      Sales Amount (₹)
                    </label>
                    <input
                      id="edit-sales"
                      type="number"
                      name="salesAmount"
                      className="form-input"
                      placeholder="0"
                      min="0"
                      value={activity.salesAmount}
                      onChange={handleChange}
                    />
                    {errors.salesAmount && (
                      <span className="form-error">{errors.salesAmount}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="edit-collection">
                      Collection Amount (₹)
                    </label>
                    <input
                      id="edit-collection"
                      type="number"
                      name="collectionAmount"
                      className="form-input"
                      placeholder="0"
                      min="0"
                      value={activity.collectionAmount}
                      onChange={handleChange}
                    />
                    {errors.collectionAmount && (
                      <span className="form-error">{errors.collectionAmount}</span>
                    )}
                  </div>
                </div>

                <div style={{ marginTop: 24, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                  <span className="badge badge-warning">Step 3</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-secondary)" }}>Notes & Next Follow-up</span>
                </div>
                <div className="form-grid">
                  {/* Remarks */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="edit-remarks">
                      Remarks
                    </label>
                    <textarea
                      id="edit-remarks"
                      name="remarks"
                      className="form-textarea"
                      placeholder="Any additional notes..."
                      value={activity.remarks}
                      onChange={handleChange}
                      rows={3}
                    />
                  </div>

                  {/* Next Follow-up */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="edit-followup">
                      Next Follow-up Date
                    </label>
                    <input
                      id="edit-followup"
                      type="date"
                      name="nextFollowUp"
                      className="form-input"
                      value={activity.nextFollowUp}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    marginTop: 28,
                    paddingTop: 20,
                    borderTop: "1px solid var(--border)",
                  }}
                >
                  <button
                    id="update-activity-btn"
                    type="submit"
                    className="btn btn-primary"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <div
                          style={{
                            width: 14,
                            height: 14,
                            border: "2px solid rgba(255,255,255,0.3)",
                            borderTop: "2px solid white",
                            borderRadius: "50%",
                            animation: "spin 0.7s linear infinite",
                          }}
                        />
                        Updating...
                      </>
                    ) : (
                      "✅ Update Activity"
                    )}
                  </button>
                  <button
                    id="cancel-edit-btn"
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate("/activity-history")}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default EditActivity;