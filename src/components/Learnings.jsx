import React, { useState, useEffect } from 'react';
import { TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, FormLabel } from '@mui/material';
import { db } from '../firebase'; // Oletus, että olet konfiguroinut Firebasen
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import "../index.css"
import { Label } from '@mui/icons-material';

const LearningForm = () => {
    const [topic, setTopic] = useState('');
    const [learning, setLearning] = useState('');
    const [learnings, setLearnings] = useState([]);
    const [firebaseLearnings, setFirebaseLearnings] = useState([]);  // Store learnings fetched from Firebase
    const navigate = useNavigate()

    const fetchLearnings = async () => {
        try {
            const learningsRef = collection(db, "learnings")
            const querySnapshot = await getDocs(learningsRef)
            const data = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }))
            console.log("Learnings data: ", data)
            setLearnings(data)
            setFirebaseLearnings(data);  // Store the fetched learnings

        }
        catch (error) {
            console.error("Error when fetchings learnings: ", error)
        }
    };

    // Hae tiedot Firebasesta
    useEffect(() => {
        fetchLearnings();
    }, []);

    // Lisää oppi state-muuttujaan
    const handleAddLearning = () => {
        setLearnings([...learnings, { topic, learning }]);
        setTopic('');
        setLearning('');
    };

    // Tallenna oppitiedot Firebasen learnings-kokoelmaan
    const handleSaveToFirebase = async () => {
        try {
            const newLearnings = learnings.filter(
                (learning) =>
                    !firebaseLearnings.some(
                        (firebaseLearning) =>
                            firebaseLearning.topic === learning.topic &&
                            firebaseLearning.learning === learning.learning
                    )
            );

            // Add only the new learnings to Firebase
            for (const newLearning of newLearnings) {
                await addDoc(collection(db, "learnings"), newLearning);
            } navigate('/thanks')
            setTopic('');
            setLearning('');
        } catch (error) {
            console.error('Virhe tallennettaessa Firebaseen: ', error);
        }
    };

    return (
        <div className="opit">
            <div className="opit-input">
                <FormLabel sx={{ color: 'red', fontWeight:700 }}>
                    Lisää oppi
                </FormLabel>
                <TextField
                    label="Aihe"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Oppi"
                    value={learning}
                    onChange={(e) => setLearning(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <Button variant="contained" color="primary" onClick={handleAddLearning}>
                    Lisää
                </Button>
                <Button variant="contained" color="secondary" onClick={handleSaveToFirebase} style={{ marginLeft: '10px' }}>
                    Talleta
                </Button>
            </div>

            <div>
                {/* Taulukko Firebasesta haetuille oppitiedoille */}
                <TableContainer component={Paper}>
                    <Table className="opit-taulu">
                        <TableHead>
                            <TableRow>
                                <TableCell className="opit-taulu-header" sx={{fontWeight:'bold'}}>Aihe</TableCell>
                                <TableCell className="opit-taulu-header" sx={{fontWeight:'bold'}}>Oppi</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {learnings.map((learning, index) => (
                                <TableRow key={index}>
                                    <TableCell>{learning.topic}</TableCell>
                                    <TableCell>{learning.learning}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    );
};

export default LearningForm;
