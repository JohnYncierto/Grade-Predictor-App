import React, { useState } from 'react';

function GradeForm({ onSubmit, loading }) {
  const [currentQuarter, setCurrentQuarter] = useState(1);
  const [formData, setFormData] = useState({
    q1: '',
    q2: '',
    q3: '',
    q4: '',
    section: 'BANABA',
    gender: 'MALE'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleQuarterChange = (e) => {
    const quarter = parseInt(e.target.value);
    setCurrentQuarter(quarter);
    // Reset grades beyond current quarter
    if (quarter < 4) setFormData({...formData, q4: ''});
    if (quarter < 3) setFormData({...formData, q3: '', q4: ''});
    if (quarter < 2) setFormData({...formData, q2: '', q3: '', q4: ''});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...formData, currentQuarter });
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    fontSize: '1rem',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    marginTop: '5px'
  };

  const labelStyle = {
    display: 'block',
    fontWeight: '600',
    color: '#333',
    marginBottom: '5px'
  };

  return (
    <form onSubmit={handleSubmit} style={{
      background: 'white',
      borderRadius: '15px',
      padding: '30px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ marginBottom: '20px', color: '#667eea' }}>📝 Student Information</h2>
      
      {/* Quarter Selector */}
      <div style={{ marginBottom: '25px', padding: '15px', background: '#f0f4ff', borderRadius: '10px' }}>
        <label style={{ ...labelStyle, color: '#667eea' }}>📅 Current Quarter</label>
        <select
          value={currentQuarter}
          onChange={handleQuarterChange}
          style={{ ...inputStyle, border: '2px solid #667eea' }}
        >
          <option value={1}>Quarter 1 - Just Started</option>
          <option value={2}>Quarter 2 - Midway</option>
          <option value={3}>Quarter 3 - Almost Done</option>
          <option value={4}>Quarter 4 - Final Quarter</option>
        </select>
        <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '8px' }}>
          {currentQuarter === 1 && '📊 We\'ll predict your future quarters and final grade'}
          {currentQuarter === 2 && '📊 We\'ll predict Q3, Q4, and your final grade'}
          {currentQuarter === 3 && '📊 We\'ll predict Q4 and your final grade'}
          {currentQuarter === 4 && '📊 We\'ll calculate your final grade'}
        </p>
      </div>

      {/* Grade Inputs */}
      {currentQuarter >= 1 && (
        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}>1st Quarter Grade</label>
          <input
            type="number"
            name="q1"
            value={formData.q1}
            onChange={handleChange}
            min="0"
            max="100"
            step="0.01"
            required
            style={inputStyle}
            placeholder="Enter grade (0-100)"
          />
        </div>
      )}

      {currentQuarter >= 2 && (
        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}>2nd Quarter Grade</label>
          <input
            type="number"
            name="q2"
            value={formData.q2}
            onChange={handleChange}
            min="0"
            max="100"
            step="0.01"
            required
            style={inputStyle}
            placeholder="Enter grade (0-100)"
          />
        </div>
      )}

      {currentQuarter >= 3 && (
        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}>3rd Quarter Grade</label>
          <input
            type="number"
            name="q3"
            value={formData.q3}
            onChange={handleChange}
            min="0"
            max="100"
            step="0.01"
            required
            style={inputStyle}
            placeholder="Enter grade (0-100)"
          />
        </div>
      )}

      {currentQuarter >= 4 && (
        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}>4th Quarter Grade</label>
          <input
            type="number"
            name="q4"
            value={formData.q4}
            onChange={handleChange}
            min="0"
            max="100"
            step="0.01"
            required
            style={inputStyle}
            placeholder="Enter grade (0-100)"
          />
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Section</label>
        <select
          name="section"
          value={formData.section}
          onChange={handleChange}
          style={inputStyle}
        >
          <option value="BANABA">BANABA</option>
          <option value="CABALLERO">CABALLERO</option>
          <option value="GEMELINA">GEMELINA</option>
        </select>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Gender</label>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          style={inputStyle}
        >
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        style={{
          width: '100%',
          padding: '15px',
          fontSize: '1.1rem',
          fontWeight: '600',
          background: loading ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'transform 0.2s'
        }}
        onMouseEnter={(e) => !loading && (e.target.style.transform = 'scale(1.02)')}
        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
      >
        {loading ? '🔄 Predicting...' : '🎯 Predict Grades'}
      </button>
    </form>
  );
}

export default GradeForm;