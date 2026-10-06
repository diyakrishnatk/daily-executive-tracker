import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import Sidebar from "../components/Sidebar";

function AddActivity() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    date: today,
    dealerName: "",
    location: "",
    activity: "",
    cases: "",
    salesAmount: "",
    collectionAmount: "",
    remarks: "",
    nextFollowUp: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.date) newErrors.date = "Date is required.";
    if (!formData.dealerName.trim()) newErrors.dealerName = "Dealer / customer name is required.";
    if (!formData.location.trim()) newErrors.location = "Location is required.";
    if (!formData.activity.trim()) newErrors.activity = "Visit / activity is required.";
    if (formData.cases !== "" && Number(formData.cases) < 0)
      newErrors.cases = "Cases cannot be negative.";
    if (formData.salesAmount !== "" && Number(formData.salesAmount) < 0)
      newErrors.salesAmount = "Sales amount cannot be negative.";
    if (formData.collectionAmount !== "" && Number(formData.collectionAmount) < 0)
      newErrors.collectionAmount = "Collection amount cannot be negative.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      await API.post("/activities", {
        ...formData,
        cases: Number(formData.cases) || 0,
        salesAmount: Number(formData.salesAmount) || 0,
        collectionAmount: Number(formData.collectionAmount) || 0,
      });

      setSuccessMsg("Activity added successfully! ✅");
      setFormData({
        date: today,
        dealerName: "",
        location: "",
        activity: "",
        cases: "",
        salesAmount: "",
        collectionAmount: "",
        remarks: "",
        nextFollowUp: "",
      });

      // Redirect after a short delay
      setTimeout(() => navigate("/activity-history"), 1500);
    } catch (error) {
      setErrors({ submit: error.response?.data?.message || "Failed to add activity." });
    } finally {
      setLoading(false);
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
              id="back-to-dashboard"
              className="btn btn-secondary btn-sm"
              onClick={() => navigate("/")}
              style={{ flexShrink: 0 }}
            >
              ← Back
            </button>
            <div>
              <h1 className="topbar-title">Add Activity</h1>
              <p className="topbar-subtitle">Log your daily sales visit or activity</p>
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

        {/* Form Card */}
        <div className="card">
          <div className="card-header">
            <div className="section-header" style={{ margin: 0 }}>
              <div className="section-header-icon" />
              <h2 className="card-title">Activity Details</h2>
            </div>
          </div>
          <div className="card-body">
            <form id="add-activity-form" onSubmit={handleSubmit}>
              <div style={{ marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                <span className="badge badge-purple">Step 1</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-secondary)" }}>Activity Overview</span>
              </div>
              <div className="form-grid">
                {/* Date */}
                <div className="form-group">
                  <label className="form-label" htmlFor="act-date">
                    Date <span className="required">*</span>
                  </label>
                  <input
                    id="act-date"
                    type="date"
                    name="date"
                    className="form-input"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                  {errors.date && <span className="form-error">{errors.date}</span>}
                </div>

                {/* Dealer Name */}
                <div className="form-group">
                  <label className="form-label" htmlFor="act-dealer">
                    Dealer / Customer Name <span className="required">*</span>
                  </label>
                  <input
                    id="act-dealer"
                    type="text"
                    name="dealerName"
                    className="form-input"
                    placeholder="e.g., Sharma Traders"
                    value={formData.dealerName}
                    onChange={handleChange}
                    required
                  />
                  {errors.dealerName && <span className="form-error">{errors.dealerName}</span>}
                </div>

                {/* Location */}
                <div className="form-group">
                  <label className="form-label" htmlFor="act-location">
                    Location <span className="required">*</span>
                  </label>
                  <input
                    id="act-location"
                    type="text"
                    name="location"
                    className="form-input"
                    placeholder="e.g., Mumbai, Andheri"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                  {errors.location && <span className="form-error">{errors.location}</span>}
                </div>

                {/* Activity */}
                <div className="form-group">
                  <label className="form-label" htmlFor="act-activity">
                    Visit / Activity <span className="required">*</span>
                  </label>
                  <input
                    id="act-activity"
                    type="text"
                    name="activity"
                    className="form-input"
                    placeholder="e.g., Dealer Visit, Product Demo"
                    value={formData.activity}
                    onChange={handleChange}
                    required
                  />
                  {errors.activity && <span className="form-error">{errors.activity}</span>}
                </div>
              </div>

              {/* Amounts row */}
              <div style={{ marginTop: 24, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                <span className="badge badge-info">Step 2</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-secondary)" }}>Commercial & Order Metrics</span>
              </div>
              <div className="form-grid cols-3">
                <div className="form-group">
                  <label className="form-label" htmlFor="act-cases">
                    Order / Cases
                  </label>
                  <input
                    id="act-cases"
                    type="number"
                    name="cases"
                    className="form-input"
                    placeholder="0"
                    min="0"
                    value={formData.cases}
                    onChange={handleChange}
                  />
                  {errors.cases && <span className="form-error">{errors.cases}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="act-sales">
                    Sales Amount (₹)
                  </label>
                  <input
                    id="act-sales"
                    type="number"
                    name="salesAmount"
                    className="form-input"
                    placeholder="0"
                    min="0"
                    value={formData.salesAmount}
                    onChange={handleChange}
                  />
                  {errors.salesAmount && <span className="form-error">{errors.salesAmount}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="act-collection">
                    Collection Amount (₹)
                  </label>
                  <input
                    id="act-collection"
                    type="number"
                    name="collectionAmount"
                    className="form-input"
                    placeholder="0"
                    min="0"
                    value={formData.collectionAmount}
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
                  <label className="form-label" htmlFor="act-remarks">
                    Remarks
                  </label>
                  <textarea
                    id="act-remarks"
                    name="remarks"
                    className="form-textarea"
                    placeholder="Any additional notes or observations..."
                    value={formData.remarks}
                    onChange={handleChange}
                    rows={3}
                  />
                </div>

                {/* Next Follow-up */}
                <div className="form-group">
                  <label className="form-label" htmlFor="act-followup">
                    Next Follow-up Date
                  </label>
                  <input
                    id="act-followup"
                    type="date"
                    name="nextFollowUp"
                    className="form-input"
                    value={formData.nextFollowUp}
                    onChange={handleChange}
                  />
                  <p className="text-xs text-muted mt-4">
                    Leave blank if no follow-up is needed.
                  </p>
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
                  id="submit-activity-btn"
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? (
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
                      Saving...
                    </>
                  ) : (
                    "✅ Save Activity"
                  )}
                </button>
                <button
                  id="cancel-activity-btn"
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate("/")}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AddActivity;