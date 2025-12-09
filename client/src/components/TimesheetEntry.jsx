import React, { useState, useEffect } from "react";
import FileUpload from "./FileUpload";
import api from "../services/api";

const TimesheetEntry = () => {
  const [formData, setFormData] = useState({
    name: "",
    companyName: "",
    date: new Date().toISOString().split("T")[0],
    punchIn: "",
    punchOut: "",
    totalHours: 0,
  });
  const [names, setNames] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDropdowns();
  }, []);

  useEffect(() => {
    calculateTotalHours();
  }, [formData.punchIn, formData.punchOut]);

  const fetchDropdowns = async () => {
    try {
      const [namesRes, companiesRes] = await Promise.all([
        api.get("/names"),
        api.get("/companies"),
      ]);
      setNames(namesRes.data);
      setCompanies(companiesRes.data);
    } catch (error) {
      console.error("Error fetching dropdowns:", error);
    }
  };

  const calculateTotalHours = () => {
    if (formData.punchIn && formData.punchOut) {
      const inTime = new Date(`2000-01-01T${formData.punchIn}`);
      const outTime = new Date(`2000-01-01T${formData.punchOut}`);
      const diff = (outTime - inTime) / (1000 * 60 * 60);
      const clampedHours = Math.max(5, Math.min(8, diff));
      setFormData((prev) => ({ ...prev, totalHours: clampedHours }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      totalHours: Number(formData.totalHours),
    };

    console.log("Submitting payload:", payload);
    try {
      await api.post("http://localhost:5000/api/timesheets", payload);
      console.log("Timesheet Saved Successfully");
      setFormData({
        name: "",
        companyName: "",
        date: new Date().toISOString().split("T")[0],
        punchIn: "",
        punchOut: "",
        totalHours: 0,
      });
    } catch (error) {
      console.log("Create error response:", error.response?.data);
      alert("Error creating timesheet: " + error.response?.data?.error);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = (data) => {
    console.log("Imported data:", data);
  };

  return (
    <form className="timesheet-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <label>Name *</label>
          <select
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          >
            <option value="">Select Name</option>
            {names.map((name, idx) => (
              <option key={idx} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Company Name *</label>
          <select
            value={formData.companyName}
            onChange={(e) =>
              setFormData({ ...formData, companyName: e.target.value })
            }
            required
          >
            <option value="">Select Company</option>
            {companies.map((company, idx) => (
              <option key={idx} value={company}>
                {company}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Date *</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            max={new Date().toISOString().split("T")[0]}
            required
          />
        </div>

        <div className="form-group">
          <label>Punch In *</label>
          <input
            type="time"
            value={formData.punchIn}
            onChange={(e) =>
              setFormData({ ...formData, punchIn: e.target.value })
            }
            required
          />
        </div>

        <div className="form-group">
          <label>Punch Out *</label>
          <input
            type="time"
            value={formData.punchOut}
            onChange={(e) =>
              setFormData({ ...formData, punchOut: e.target.value })
            }
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Total Hours</label>
          <input
            type="number"
            value={formData.totalHours.toFixed(1)}
            readOnly
            className="readonly"
          />
        </div>
      </div>

      <FileUpload onImport={handleImport} />

      <div className="form-actions">
        <button type="submit" disabled={loading} className="btn btn-primary">
          {loading ? "Saving..." : "Add Timesheet"}
        </button>
      </div>
    </form>
  );
};

export default TimesheetEntry;
