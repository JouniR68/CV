// src/components/Feedback.tsx
import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import { collection, addDoc } from "firebase/firestore";
import { db } from '../firebase';
import "../css/feedback.css"
import { useTranslation } from 'react-i18next';

const Feedback: React.FC = () => {

  const { t } = useTranslation();

  const [name, setName] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [feedback, setFeedback] = useState<string>("");

  const handleSubmit = async () => {
    if (name && subject && feedback) {
      await addDoc(collection(db, "feedback"), { name, subject, feedback });
      setName("");
      setSubject("");
      setFeedback("");
      alert("Feedback submitted successfully!");
    } else {
      alert("Please fill in all fields.");
    }
  };

  return (
    <div className="feedback">
      <Box component="form" >
        <TextField label={t('Name')} variant="outlined" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
        <TextField label={t('Subject')} variant="outlined" value={subject} onChange={(e) => setSubject(e.target.value)} fullWidth />
        <TextField label={t('Feedback')} variant="outlined" value={feedback} onChange={(e) => setFeedback(e.target.value)} multiline rows={4} fullWidth />
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          {t('Save')}
        </Button>
      </Box>
    </div>
  );
};

export default Feedback;
