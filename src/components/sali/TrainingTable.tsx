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

/*
const previousExercise = previousWeekData
                        .flatMap((obj) => obj.details_analyysi || []) //Eventually, this needs to be changed as object structure has been now changed || exercices need to be renamed to details_analyysi...
                        .find((item) => item.liike === exercise);

                    console.log(
                        'TrainingTable, previous wk exercise:',
                        previousWeekData
                    );

previousExercise={previousExercise}


*/


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
                    <th style={{ width: '200px', padding: '1rem', fontSize: '1.2rem' }}>
                        Treeni
                    </th>
                    <th style={{ width: '200px', padding: '1rem', fontSize: '1.2rem' }}>S&T</th>
                    <th style={{ width: '200px', padding: '1rem', fontSize: '1.2rem' }}>
                        Done
                    </th>
                </tr>
            </thead>
            <tbody>
                {todayTraining.Voimaharjoittelu.liike.map((exercise, index) => {

                    return (
                        <ExerciseRow
                            key={index}
                            index={index}
                            exercise={exercise}
                            sarja={todayTraining.Voimaharjoittelu.sarja[index]}
                            toisto={
                                todayTraining.Voimaharjoittelu.toisto[index]
                            }
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
