import { useState } from "react";
import { FaSearch, FaFilter, FaTimes } from "react-icons/fa";
import "../../styles/search-filter.css";

function SearchFilter({ onSearch, onFilter }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    riskLevel: "all",
    status: "all",
    dateRange: "all",
  });

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    onSearch(term);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilters({ riskLevel: "all", status: "all", dateRange: "all" });
    onSearch("");
    onFilter({ riskLevel: "all", status: "all", dateRange: "all" });
  };

  return (
    <div className="search-filter-container">
      <div className="search-bar">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search cameras, zones, or reports..."
          value={searchTerm}
          onChange={handleSearch}
        />
        {searchTerm && (
          <button className="clear-search" onClick={() => handleSearch({ target: { value: "" } })}>
            <FaTimes />
          </button>
        )}
      </div>

      <button
        className="filter-btn"
        onClick={() => setShowFilters(!showFilters)}
      >
        <FaFilter /> Filters
      </button>

      {showFilters && (
        <div className="filter-panel">
          <div className="filter-group">
            <label>Risk Level</label>
            <select
              value={filters.riskLevel}
              onChange={(e) => handleFilterChange("riskLevel", e.target.value)}
            >
              <option value="all">All Levels</option>
              <option value="low">Low Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="high">High Risk</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="offline">Offline</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Date Range</label>
            <select
              value={filters.dateRange}
              onChange={(e) => handleFilterChange("dateRange", e.target.value)}
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>

          <div className="filter-actions">
            <button className="clear-btn" onClick={clearFilters}>
              Clear Filters
            </button>
            <button
              className="close-btn"
              onClick={() => setShowFilters(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchFilter;