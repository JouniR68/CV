/*
This component will:

Display a single row for an exercise in the training table.

Show previous week's weights.

Show set & rep count.

Show the dynamic button (Do it, click count, or Done).
*/
import React from 'react';
import { Button } from '@mui/material';

/*
interface PreviousExercise {
    unit1?: number;
    unit2?: number;
    unit3?: number;
    unit4?: number;
}
*/

interface Props {
    index: number;
    exercise: string;
    //previousExercise?: PreviousExercise;
    sarja: number;
    toisto: number;
    clickValue: number;
    isDone: boolean;
    onClick: (index: number) => void;
    getButtonStyle: (index: number) => React.CSSProperties;
}

/*
            <td style={{padding:'1rem'}}>
                {previousExercise
                    ? `${previousExercise.unit1 || '-'}, ${
                          previousExercise.unit2 || '-'
                      }, ${previousExercise.unit3 || '-'} ${
                          previousExercise.unit4 || ''
                      }`
                    : '-'}
            </td>

*/


const ExerciseRow: React.FC<Props> = ({
    index,
    exercise,
    //previousExercise,
    sarja,
    toisto,
    clickValue,
    isDone,
    onClick,
    getButtonStyle,
}) => {
    return (
        <tr key={index}>
            <td style={{ justifyContent:'left', padding:'1rem' }}>{exercise}</td>

            <td style={{padding:'1rem'}}>
                {sarja}/{toisto}
            </td>
            <td style={{ padding: '1rem' }}>
                <Button
                    style={getButtonStyle(index)}
                    onClick={() => onClick(index)}
                    disabled={clickValue >= sarja}
                >
                    {isDone ? 'Done' : clickValue || 'Do it'}
                </Button>
            </td>
        </tr>
    );
};

export default ExerciseRow;
