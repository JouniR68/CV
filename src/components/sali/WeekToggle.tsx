// Component: WeekToggle.tsx
import React from 'react';
import { Button } from '@mui/material';

interface WeekToggleProps {
  showWholeWeek: boolean;
  toggleView: () => void;
}

const WeekToggle: React.FC<WeekToggleProps> = ({ showWholeWeek, toggleView }) => (
  <Button onClick={toggleView}>{showWholeWeek ? 'Päivän treeni' : 'Viikon pläni'}</Button>
);

export default WeekToggle;