// src/Login.js
import { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import bcrypt from 'bcryptjs';
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import { useAuth } from './LoginContext';


export const UserLogin = () => {
    const [username, setUsername] = useState('');
    const [userPwd, setUserPwd] = useState('');
    const [message, setMessage] = useState('');
    const [data, setData] = useState([])
    const [error, setError] = useState("")
    const { setIsLoggedIn } = useAuth();

    const navigate = useNavigate()

    const getData = async () => {
        try {
            const orderRef = collection(db, "contacts")
            const querySnapshot = await getDocs(orderRef)
            const data = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ref: doc.ref,
                ...doc.data(),
            }))
            console.log("Contacts: ", data)
            if (!data) {
                navigate('/error', { state: { locationError: "No data" } })
                return
            } else {
                setData(data)
            }
        } catch (error) {
            console.error("Error fetching data: ", error)
            setError("Error fetching data, pls contact site admin.")
            throw {
                message: "Datan haku epäonnistui",
                statusText: "Failas",
                status: 403,
            }
        }
    }

    useEffect(() => {
        getData()
    }, [])



    const checkUser = async () => {
        console.log("checkUser")
        let isMatch = false
        const userExist = data.find(e => e.username === username)
        const pwdList = data.map(d => d.password)        
        pwdList.forEach(pwd => {
            isMatch = bcrypt.compare(userPwd, pwd.password);
        })

        if (userExist && isMatch){
            console.log("both ok, username and pwd")
            return true
        }

        
    }

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            // Check if the entered password matches the stored hashed password
            const isAccountValid = checkUser()            
            if (isAccountValid) {
                setIsLoggedIn(true)
                setTimeout(() => {
                    navigate('/home')
                }, [1000])
            } else {
                console.log("Ivalid account")                
                setIsLoggedIn(false)
            }
        } catch (error) {
            console.error('Error during login:', error);
            setMessage('An error occurred. Please try again.');
        }
    };



    return (
        <Box
            component="form"
            onSubmit={handleLogin}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                width: 300,
                margin: 'auto',
                paddingTop: 4
            }}
        >
            <Typography variant="h5" gutterBottom>
                Login
            </Typography>
            <TextField
                label="Username"
                variant="outlined"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />
            <TextField
                label="Password"
                variant="outlined"
                type="password"
                value={userPwd}
                onChange={(e) => setUserPwd(e.target.value)}
                required
            />
            <Button variant="contained" color="primary" type="submit">
                Login
            </Button>
            {message && (
                <Typography variant="body2" color="error">
                    {message}
                </Typography>
            )}
        </Box>
    );
};   
