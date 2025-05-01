//switches between day/week view
import React from 'react';
import { Button } from '@mui/material';

interface Props {
  showWholeWeek: boolean;
  toggleView: () => void;
}

const ToggleButton: React.FC<Props> = ({ showWholeWeek, toggleView }) => (
  <Button onClick={toggleView}>
    {showWholeWeek ? 'Päivän treeni' : 'Viikon pläni'}
  </Button>
);

export default ToggleButton;
