import React, { useState } from "react";
import { db } from "../../firebase"; // Import Firebase setup
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import Heavy from "../Dialogs/Heavy";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

const ExerciseTracker = ({ exercises }) => {
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [clickCount, setClickCount] = useState(0);
  const [responses, setResponses] = useState([]);
  const [isHeavyVisible, setIsHeavyVisible] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleExerciseClick = () => {
    if (isHeavyVisible) return;

    setClickCount((prev) => prev + 1);
    if (clickCount + 1 === exercises[exerciseIndex].sarja) {
      setIsHeavyVisible(true);
    }
  };

  const handleHeavySubmit = (feedback) => {
    setResponses((prev) => [...prev, { exercise: exercises[exerciseIndex].name, feedback }]);
    setIsHeavyVisible(false);
    setClickCount(0);

    if (exerciseIndex + 1 < exercises.length) {
      setExerciseIndex((prev) => prev + 1);
    } else {
      saveWorkout();
    }
  };

  const saveWorkout = async () => {
    try {
      await addDoc(collection(db, "exercises"), {
        date: serverTimestamp(),
        exercises,
        responses,
      });
      setIsDialogOpen(true);
    } catch (error) {
      console.error("Error saving workout: ", error);
    }
  };

  return (
    <div>
      {exerciseIndex < exercises.length ? (
        <>
          <h2>{exercises[exerciseIndex].name}</h2>
          <p>Clicks: {clickCount} / {exercises[exerciseIndex].sarja}</p>
          <Button variant="contained" onClick={handleExerciseClick}>Do Exercise</Button>
          {isHeavyVisible && <Heavy onSubmit={handleHeavySubmit} />}
        </>
      ) : null}

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>Päivän treeni talletettu</DialogTitle>
      </Dialog>
    </div>
  );
};

export default ExerciseTracker;
