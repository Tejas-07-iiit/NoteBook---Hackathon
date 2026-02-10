import React from 'react';
import { FiSearch, FiFilter } from 'react-icons/fi';

const FilterBar = ({ filters, onFilterChange, departments, semesters, types, examTypes }) => {
  return (
    <div className="filter-bar">
      <div className="search-box">
        <FiSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search notes by title or subject..."
          value={filters.search}
          onChange={(e) => onFilterChange('search', e.target.value)}
        />
      </div>
      
      <div className="filter-group">
        <select
          className="form-control"
          value={filters.department}
          onChange={(e) => onFilterChange('department', e.target.value)}
        >
          <option value="">All Departments</option>
          {departments?.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
      </div>
      
      <div className="filter-group">
        <select
          className="form-control"
          value={filters.semester}
          onChange={(e) => onFilterChange('semester', e.target.value)}
        >
          <option value="">All Semesters</option>
          {semesters?.map(sem => (
            <option key={sem} value={sem}>Sem {sem}</option>
          ))}
        </select>
      </div>
      
      <div className="filter-group">
        <select
          className="form-control"
          value={filters.type}
          onChange={(e) => onFilterChange('type', e.target.value)}
        >
          <option value="">All Types</option>
          <option value="note">Notes</option>
          <option value="pastpaper">Past Papers</option>
        </select>
      </div>
      
      {filters.type === 'pastpaper' && (
        <div className="filter-group">
          <select
            className="form-control"
            value={filters.examType}
            onChange={(e) => onFilterChange('examType', e.target.value)}
          >
            <option value="">All Exam Types</option>
            {examTypes?.map(type => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>
      )}
      
      <button 
        className="btn btn-secondary"
        onClick={() => {
          // Reset all filters
          ['search', 'department', 'semester', 'subject', 'type', 'year', 'examType'].forEach(
            key => onFilterChange(key, '')
          );
        }}
      >
        <FiFilter /> Clear Filters
      </button>
    </div>
  );
};

export default FilterBar;