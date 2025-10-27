import React from 'react';

function PredictionResults({ data }) {
  const { finalGrade, enteredGrades, predictedGrades, comparison, currentQuarter } = data;
  
  const isPassed = finalGrade.status === 'PASSED';
  
  return (
    <div style={{
      background: 'white',
      borderRadius: '15px',
      padding: '30px',
      marginBottom: '20px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ marginBottom: '20px', color: '#667eea' }}>🎯 Prediction Results</h2>
      
      {/* Current Quarter Info */}
      <div style={{
        background: '#f0f4ff',
        padding: '15px',
        borderRadius: '10px',
        marginBottom: '20px',
        border: '2px solid #667eea'
      }}>
        <strong>📅 Currently in Quarter {currentQuarter}</strong>
        <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '5px' }}>
          Confidence Level: {finalGrade.confidence}%
        </div>
      </div>
      
      {/* Final Prediction */}
      <div style={{
        background: isPassed ? 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' : 'linear-gradient(135deg, #eb3349 0%, #f45c43 100%)',
        color: 'white',
        borderRadius: '12px',
        padding: '30px',
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '10px', opacity: 0.9 }}>
          Predicted Final Grade
        </h3>
        <div style={{ fontSize: '3.5rem', fontWeight: 'bold', marginBottom: '10px' }}>
          {finalGrade.percentage}%
        </div>
        <div style={{ fontSize: '1.5rem', fontWeight: '600' }}>
          {isPassed ? '✅ PASSED' : '⚠️ AT RISK'}
        </div>
      </div>

      {/* Grades Breakdown */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ marginBottom: '15px', color: '#333' }}>📊 Quarter Grades Breakdown:</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          {['Q1', 'Q2', 'Q3', 'Q4'].map((quarter) => {
            const entered = enteredGrades[quarter];
            const predicted = predictedGrades[quarter];
            const grade = entered || predicted;
            const isEntered = !!entered;
            
            return (
              <div key={quarter} style={{
                background: isEntered ? '#e8f5e9' : '#fff3e0',
                border: `2px solid ${isEntered ? '#4caf50' : '#ff9800'}`,
                borderRadius: '10px',
                padding: '15px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '5px' }}>
                  {quarter} {isEntered ? '(Actual)' : '(Predicted)'}
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: isEntered ? '#2e7d32' : '#e65100' }}>
                  {grade ? `${grade}%` : '-'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Class Comparison */}
      <div style={{
        background: '#f8f9fa',
        borderRadius: '10px',
        padding: '20px',
        marginBottom: '20px'
      }}>
        <h3 style={{ marginBottom: '15px', color: '#333' }}>📈 Comparison to Class Average</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.9rem', color: '#666' }}>Your Predicted Grade</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#667eea' }}>
              {finalGrade.percentage}%
            </div>
          </div>
          <div style={{ fontSize: '2rem', color: '#999' }}>vs</div>
          <div>
            <div style={{ fontSize: '0.9rem', color: '#666' }}>Class Average</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#999' }}>
              {comparison.classAverage}%
            </div>
          </div>
        </div>
        <div style={{
          marginTop: '15px',
          padding: '10px',
          background: comparison.difference >= 0 ? '#e8f5e9' : '#ffebee',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <strong style={{ color: comparison.difference >= 0 ? '#2e7d32' : '#c62828' }}>
            {comparison.difference >= 0 ? '🎉' : '📉'} {Math.abs(comparison.difference).toFixed(1)}% {comparison.percentile}
          </strong>
        </div>
      </div>

    </div>
  );
}

export default PredictionResults;