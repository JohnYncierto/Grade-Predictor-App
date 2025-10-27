import React, { useState } from 'react';
import axios from 'axios';
import GradeForm from './components/GradeForm';
import PredictionResults from './components/PredictionResults';
import ModelComparison from './components/ModelComparison';

function App() {
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('http://localhost:5000/predict', formData);
      setPredictions(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <header style={{
        background: 'white',
        borderRadius: '15px',
        padding: '30px',
        marginBottom: '30px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ fontSize: '2.5rem', color: '#667eea', marginBottom: '10px' }}>
          🎓 Student Grade Predictor
        </h1>
        <p style={{ color: '#666', fontSize: '1.1rem' }}>
          Predict final grades using AI-powered machine learning models
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
        <GradeForm onSubmit={handleSubmit} loading={loading} />
        
        <div>
          {error && (
            <div style={{
              background: '#fee',
              color: '#c33',
              padding: '15px',
              borderRadius: '10px',
              marginBottom: '20px'
            }}>
              ❌ {error}
            </div>
          )}
          
          {predictions && (
            <>
              <PredictionResults data={predictions} />
              <ModelComparison data={predictions} />
            </>
          )}
          
          {!predictions && !loading && (
            <div style={{
              background: 'white',
              borderRadius: '15px',
              padding: '60px',
              textAlign: 'center',
              color: '#999'
            }}>
              <h2>👈 Enter student information to get predictions</h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;