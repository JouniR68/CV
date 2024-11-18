// src/components/ShowFeedback.tsx
import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

interface FeedbackData {
  id: string;
  name: string;
  subject: string;
  feedback: string;
}

const ShowFeedback: React.FC = () => {
  const [feedbackList, setFeedbackList] = useState<FeedbackData[]>([]);

  useEffect(() => {
    const fetchFeedback = async () => {
      const feedbackCollection = collection(db, "feedback");
      const feedbackSnapshot = await getDocs(feedbackCollection);
      const feedbackData = feedbackSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as FeedbackData));
      setFeedbackList(feedbackData);
    };

    fetchFeedback();
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Subject</TableCell>
            <TableCell>Feedback</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {feedbackList.map((feedback) => (
            <TableRow key={feedback.id}>
              <TableCell>{feedback.name}</TableCell>
              <TableCell>{feedback.subject}</TableCell>
              <TableCell>{feedback.feedback}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ShowFeedback;
