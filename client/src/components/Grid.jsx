import React, { useState } from "react";
import api from "../services/api";

const Grid = ({ data, onDelete, pagination, onPageChange, onRefresh }) => {
  const [editingRow, setEditingRow] = useState(null);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(false);
  const [addingNew, setAddingNew] = useState(false);
  const [newData, setNewData] = useState({
    name: "",
    companyName: "",
    date: new Date().toISOString().split("T")[0],
    punchIn: "",
    punchOut: "",
    totalHours: 0,
  });

  const handleEdit = (index) => {
    setEditingRow(index);
    setEditData(data[index]);
  };

  const handleSave = async (index) => {
    setLoading(true);
    try {
      if (editData._id) {
        await api.put(`/${editData._id}`, editData);
      } else {
        await api.post("", editData);
      }
      setEditingRow(null);
      setEditData({});
      setAddingNew(false);
      setLoading(false);
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Error saving timesheet:", error);
      alert("Error saving timesheet");
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setAddingNew(true);
    setNewData({
      name: "",
      companyName: "",
      date: new Date().toISOString().split("T")[0],
      punchIn: "",
      punchOut: "",
      totalHours: 0,
    });
  };

  const handleNewChange = (field, value) => {
    const updated = { ...newData, [field]: value };
    if (field === "punchIn" || field === "punchOut") {
      if (updated.punchIn && updated.punchOut) {
        const inTime = new Date(`2000-01-01T${updated.punchIn}`);
        const outTime = new Date(`2000-01-01T${updated.punchOut}`);
        const diff = (outTime - inTime) / (1000 * 60 * 60);
        updated.totalHours = Math.max(5, Math.min(8, diff));
      }
    }
    setNewData(updated);
  };

  const handleSaveNew = async () => {
    setLoading(true);
    try {
      await api.post("", newData);
      setAddingNew(false);
      setLoading(false);
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Error adding timesheet:", error);
      alert("Error adding timesheet");
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN");
  };

  return (
    <div className="grid-container">
      <table className="timesheet-grid">
        <thead>
          <tr>
            <th>Name</th>
            <th>Company</th>
            <th>Date</th>
            <th>Punch In</th>
            <th>Punch Out</th>
            <th>Total Hours</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={row._id || index}>
              <td>
                {editingRow === index ? (
                  <input
                    value={editData.name}
                    onChange={(e) =>
                      setEditData({ ...editData, name: e.target.value })
                    }
                  />
                ) : (
                  row.name
                )}
              </td>
              <td>
                {editingRow === index ? (
                  <input
                    value={editData.companyName}
                    onChange={(e) =>
                      setEditData({ ...editData, companyName: e.target.value })
                    }
                  />
                ) : (
                  row.companyName
                )}
              </td>
              <td>
                {editingRow === index ? (
                  <input
                    type="date"
                    value={editData.date.split("T")[0]}
                    onChange={(e) =>
                      setEditData({ ...editData, date: e.target.value })
                    }
                  />
                ) : (
                  formatDate(row.date)
                )}
              </td>
              <td>
                {editingRow === index ? (
                  <input
                    type="time"
                    value={editData.punchIn}
                    onChange={(e) =>
                      setEditData({ ...editData, punchIn: e.target.value })
                    }
                  />
                ) : (
                  row.punchIn
                )}
              </td>
              <td>
                {editingRow === index ? (
                  <input
                    type="time"
                    value={editData.punchOut}
                    onChange={(e) =>
                      setEditData({ ...editData, punchOut: e.target.value })
                    }
                  />
                ) : (
                  row.punchOut
                )}
              </td>
              <td>
                {editingRow === index ? (
                  <input
                    type="number"
                    value={editData.totalHours}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        totalHours: parseFloat(e.target.value),
                      })
                    }
                  />
                ) : (
                  `${row.totalHours.toFixed(1)}h`
                )}
              </td>
              <td>
                {editingRow === index ? (
                  <button
                    className="btn btn-small btn-primary"
                    onClick={() => handleSave(index)}
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save"}
                  </button>
                ) : (
                  <>
                    <button
                      className="btn btn-small btn-edit"
                      onClick={() => handleEdit(index)}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="btn btn-small btn-danger"
                      onClick={() => onDelete(row._id)}
                    >
                      🗑️ Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}

          {addingNew && (
            <tr>
              <td>
                <input
                  value={newData.name}
                  onChange={(e) => handleNewChange("name", e.target.value)}
                />
              </td>
              <td>
                <input
                  value={newData.companyName}
                  onChange={(e) =>
                    handleNewChange("companyName", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  type="date"
                  value={newData.date}
                  onChange={(e) => handleNewChange("date", e.target.value)}
                  max={new Date().toISOString().split("T")[0]}
                />
              </td>
              <td>
                <input
                  type="time"
                  value={newData.punchIn}
                  onChange={(e) => handleNewChange("punchIn", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="time"
                  value={newData.punchOut}
                  onChange={(e) => handleNewChange("punchOut", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={newData.totalHours}
                  onChange={(e) =>
                    handleNewChange("totalHours", parseFloat(e.target.value))
                  }
                />
              </td>
              <td>
                <button
                  className="btn btn-small btn-primary"
                  onClick={handleSaveNew}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Add"}
                </button>
                <button
                  className="btn btn-small btn-secondary"
                  onClick={() => setAddingNew(false)}
                  disabled={loading}
                >
                  Cancel
                </button>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="add-row">
        <button className="btn btn-primary" onClick={handleAddNew}>
          + Add New Timesheet
        </button>
      </div>

      {pagination && (
        <div className="pagination">
          <button
            className="btn btn-pagination"
            onClick={() => onPageChange(pagination.current - 1)}
            disabled={pagination.current === 1}
          >
            ← Previous
          </button>
          <span className="pagination-info">
            Page {pagination.current} of {pagination.pages} ({pagination.total}{" "}
            records)
          </span>
          <button
            className="btn btn-pagination"
            onClick={() => onPageChange(pagination.current + 1)}
            disabled={pagination.current === pagination.pages}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default Grid;
