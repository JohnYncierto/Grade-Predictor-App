import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

function ModelComparison({ data }) {
  const { enteredGrades, predictedGrades, comparison } = data;
  
  // Create timeline data
  const timelineData = [
    {
      quarter: 'Q1',
      actual: enteredGrades.Q1 || null,
      predicted: enteredGrades.Q1 || predictedGrades.Q1 || null,
      classAvg: comparison.classAverage
    },
    {
      quarter: 'Q2',
      actual: enteredGrades.Q2 || null,
      predicted: enteredGrades.Q2 || predictedGrades.Q2 || null,
      classAvg: comparison.classAverage
    },
    {
      quarter: 'Q3',
      actual: enteredGrades.Q3 || null,
      predicted: enteredGrades.Q3 || predictedGrades.Q3 || null,
      classAvg: comparison.classAverage
    },
    {
      quarter: 'Q4',
      actual: enteredGrades.Q4 || null,
      predicted: enteredGrades.Q4 || predictedGrades.Q4 || null,
      classAvg: comparison.classAverage
    }
  ];

  return (
    <div style={{
      background: 'white',
      borderRadius: '15px',
      padding: '30px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ marginBottom: '20px', color: '#667eea' }}>📊 Grade Progression Timeline</h2>
      
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={timelineData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="quarter" />
          <YAxis domain={[0, 100]} label={{ value: 'Grade (%)', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          <ReferenceLine y={75} stroke="#ff6b6b" strokeDasharray="3 3" label="Passing Line (75%)" />
          <Line 
            type="monotone" 
            dataKey="actual" 
            stroke="#11998e" 
            strokeWidth={3}
            name="Actual Grades"
            connectNulls
            dot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="predicted" 
            stroke="#667eea" 
            strokeWidth={2}
            strokeDasharray="5 5"
            name="Predicted Grades"
            connectNulls
            dot={{ r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="classAvg" 
            stroke="#999" 
            strokeWidth={1}
            name="Class Average"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>

      <div style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
        <p style={{ fontSize: '0.95rem', color: '#666', lineHeight: '1.6' }}>
          <strong>📈 How to Read This Chart:</strong><br/>
          • <strong style={{ color: '#11998e' }}>Solid green line</strong> = Your actual grades entered<br/>
          • <strong style={{ color: '#667eea' }}>Dashed blue line</strong> = AI-predicted future grades<br/>
          • <strong style={{ color: '#999' }}>Gray line</strong> = Historical class average<br/>
          • <strong style={{ color: '#ff6b6b' }}>Red dashed line</strong> = Minimum passing grade (75%)
        </p>
      </div>

      {/* Performance Insights */}
      <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
        <div style={{
          padding: '15px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '10px',
          color: 'white',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Prediction Confidence</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '5px' }}>
            {data.finalGrade.confidence}%
          </div>
        </div>
        
        <div style={{
          padding: '15px',
          background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
          borderRadius: '10px',
          color: 'white',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>vs Class Average</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '5px' }}>
            {data.comparison.difference >= 0 ? '+' : ''}{data.comparison.difference.toFixed(1)}%
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModelComparison;