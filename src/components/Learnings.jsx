import React, { useState, useEffect } from 'react';
import { TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { db } from '../firebase'; // Oletus, että olet konfiguroinut Firebasen
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const LearningForm = () => {
    const [topic, setTopic] = useState('');
    const [learning, setLearning] = useState('');
    const [learnings, setLearnings] = useState([]);
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
            //setLearnings(learnings.docs.map((doc) => ({ ...doc.learnings(), id: doc.id })));
            setLearnings(data)
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
            learnings.map(learning => {
                addDoc(collection(db, "learnings"), learning);
            })
            navigate('/thanks')
            setTopic('');
            setLearning('');
        } catch (error) {
            console.error('Virhe tallennettaessa Firebaseen: ', error);
        }
    };

    return (
        <div>
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

            {/* Taulukko Firebasesta haetuille oppitiedoille */}
            <TableContainer component={Paper} style={{ marginTop: '20px' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Aihe</TableCell>
                            <TableCell>Oppi</TableCell>
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
    );
};

export default LearningForm;
