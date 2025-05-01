// Component: DaySelector.tsx
import React from 'react';
import { TextField } from '@mui/material';

interface DaySelectorProps {
  onDateChange: (date: string) => void;
}

const DaySelector: React.FC<DaySelectorProps> = ({ onDateChange }) => {
  return (
    <TextField
      style={{ marginTop: '1rem', marginRight: '1rem', width: '7rem', border: '1px solid', textAlign: 'center' }}
      onChange={(e) => onDateChange(e.target.value)}
      placeholder="päivä?"
    />
  );
};

export default DaySelector;