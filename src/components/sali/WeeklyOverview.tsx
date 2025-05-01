// Component: WeeklyOverview.tsx
import React from 'react';
import trainingData from '../../../data/aito.json';

const WeeklyOverview: React.FC = () => (
  <div>
    {Object.entries(trainingData.plan[0]).map(([day, details], index) => (
      <div key={index}>
        <h3>{day}</h3>
        <p>{details.Tavoite}</p>
      </div>
    ))}
  </div>
);

export default WeeklyOverview;