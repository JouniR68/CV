import React from 'react';
import { TrainingPlanData } from './types';

interface Props {
  plan: TrainingPlanData[];
}

const TrainingSummary: React.FC<Props> = ({ plan }) => {
  if (!plan.length) {
    return <p>No training plan available.</p>;
  }

  const firstWeek = plan[0];

  return (
    <div>
      {Object.entries(firstWeek).map(([day, details], index) => (
        <div key={index}>
          <h3>{day}</h3>
          <p>{details.Tavoite || 'No goal set'}</p>
        </div>
      ))}
    </div>
  );
};

export default TrainingSummary;
