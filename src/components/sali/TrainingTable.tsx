// wraps the exercise rows and header.
import React from 'react';
import ExerciseRow from './ExerciseRow';
import { Training } from './types';

interface Props {
  todayTraining: Training;
  previousWeekData: any[];
  clicks: number[];
  doneLabel: boolean[];
  handleClick: (i: number) => void;
  getButtonStyle: (i: number) => React.CSSProperties;
}

const TrainingTable: React.FC<Props> = ({
  todayTraining,
  previousWeekData,
  clicks,
  doneLabel,
  handleClick,
  getButtonStyle,
}) => {
  return (
    <table>
      <thead>
        <tr style={{ backgroundColor: 'orange' }}>
          <th>Treeni</th>
          <th>Prev kg's</th>
          <th>S&T</th>
          <th>Done</th>
        </tr>
      </thead>
      <tbody>
        {todayTraining.Voimaharjoittelu.liike.map((exercise, index) => {
          const previousExercise = previousWeekData
            .flatMap((obj) => obj.details_analyysi || [])
            .find((item) => item.liike === exercise);

          return (
            <ExerciseRow
              key={index}
              index={index}
              exercise={exercise}
              previousExercise={previousExercise}
              sarja={todayTraining.Voimaharjoittelu.sarja[index]}
              toisto={todayTraining.Voimaharjoittelu.toisto[index]}
              clickValue={clicks[index]}
              isDone={doneLabel[index]}
              onClick={handleClick}
              getButtonStyle={getButtonStyle}
            />
          );
        })}
      </tbody>
    </table>
  );
};

export default TrainingTable;
