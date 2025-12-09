import React, { useState, useEffect, useCallback } from "react";
import { CSVLink } from "react-csv";
import Grid from "./Grid";
import api from "../services/api";

const TimesheetViewer = () => {
  const [timesheets, setTimesheets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0,
  });
  const [filters, setFilters] = useState({
    name: "",
    companyName: "",
    fromDate: "",
    toDate: "",
  });

  const fetchTimesheets = useCallback(
    async (page = 1, customFilters) => {
      setLoading(true);
      try {
        const usedFilters = customFilters || filters;

        const res = await api.get("/", {
          params: {
            ...usedFilters,
            page,
            limit: 10,
          },
        });

        setTimesheets(res.data.data);
        setPagination(res.data.pagination);
      } catch (error) {
        console.error("Error fetching timesheets:", error);
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  useEffect(() => {
    fetchTimesheets(1);
  }, [fetchTimesheets]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleApplyFilters = () => {
    fetchTimesheets(1, filters);
  };

  const handleClearFilters = () => {
    const reset = { name: "", companyName: "", fromDate: "", toDate: "" };
    setFilters(reset);
    fetchTimesheets(1, reset);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      fetchTimesheets(newPage);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this timesheet?")) return;
    try {
      await api.delete(`/${id}`);
      fetchTimesheets(pagination.current);
    } catch (error) {
      console.error("Error deleting timesheet:", error);
    }
  };

  const csvHeaders = [
    { label: "Name", key: "name" },
    { label: "Company Name", key: "companyName" },
    { label: "Date", key: "date" },
    { label: "Punch In", key: "punchIn" },
    { label: "Punch Out", key: "punchOut" },
    { label: "Total Hours", key: "totalHours" },
  ];

  return (
    <div className="timesheet-viewer">
      <div className="filter-section">
        <input
          name="name"
          placeholder="Search by name"
          value={filters.name}
          onChange={handleFilterChange}
          className="filter-input"
        />

        <input
          name="companyName"
          placeholder="Search by company"
          value={filters.companyName}
          onChange={handleFilterChange}
          className="filter-input"
        />

        <input
          type="date"
          name="fromDate"
          value={filters.fromDate}
          onChange={handleFilterChange}
          max={new Date().toISOString().split("T")[0]}
          className="filter-input"
        />

        <input
          type="date"
          name="toDate"
          value={filters.toDate}
          onChange={handleFilterChange}
          max={new Date().toISOString().split("T")[0]}
          className="filter-input"
        />

        <button className="btn btn-secondary" onClick={handleApplyFilters}>
          Search
        </button>

        <button className="btn btn-secondary" onClick={handleClearFilters}>
          Clear
        </button>
      </div>

      <div className="viewer-actions">
        <CSVLink
          data={timesheets}
          headers={csvHeaders}
          filename={`timesheets-${new Date().toISOString().split("T")[0]}.csv`}
          className="btn btn-export"
        >
          📥 Download CSV
        </CSVLink>
      </div>

      {loading ? (
        <div className="loading">Loading timesheets...</div>
      ) : (
        <Grid
          data={timesheets}
          onDelete={handleDelete}
          pagination={pagination}
          onPageChange={handlePageChange}
          onRefresh={() => fetchTimesheets(pagination.current)}
        />
      )}
    </div>
  );
};

export default TimesheetViewer;
