// src/Login.js
import { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import bcrypt from 'bcryptjs';
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../LoginContext';
import { useTranslation } from 'react-i18next';
import InactivityTimer from '../InActivity';
import "../../css/signing.css"


export const UserLogin = () => {
    const [iActivityTimer, setStartIActivityTimer] = useState(false)
    const [username, setUsername] = useState('');
    const [userPwd, setUserPwd] = useState('');
    const [message, setMessage] = useState('');
    const [data, setData] = useState([])
    const [error, setError] = useState("")
    const { setIsLoggedIn, setTimerCounting } = useAuth();
    const { t } = useTranslation();

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
                navigate('/error', { state: { locationError: "Minor technical issue, pls contact admin" } })
                return
            } else {
                setData(data)
            }
        } catch (error) {
            console.error("Error fetching data: ", error)
            navigate('/error', { state: { locationError: "The cloud is broken" } })
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
        const user = data.find(e => e.email === username)
        if (user.active) {
            console.log("user found", user)
            sessionStorage.setItem("firstName", user.firstName)
            sessionStorage.setItem("lastName", user.lastName)
            sessionStorage.setItem("address", user.address)
            sessionStorage.setItem("email", user.email)
            sessionStorage.setItem("phoneNumber", user.phoneNumber)
            sessionStorage.setItem("loggedIn", "true")
        }

        else if (user.active === false) {
            setTimeout(() => navigate('/error', { state: { locationError: 'Tilissä ongelmia, ottakaa yhteyttä jr@softa-apu.fi' } }), [2000])
        }

        if (!user) { return false }

        const isSoftaApu = user.email.split("@")[1]?.includes("softa-apu");
        const isPwdValid = await bcrypt.compare(userPwd, user.password)
        if (isPwdValid) {
            if (isSoftaApu) {
                sessionStorage.setItem("adminLevel", "valid")
                setStartIActivityTimer(true)
                setTimerCounting(true)
            }
            return true
        }
        else {
            navigate("/error", { state: { locationError: 'Invalid pwd' } })
            setUserPwd("")
            setIsLoggedIn(false)
            setTimerCounting(false)
            return
        }
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // Check if the entered password matches the stored hashed password
            const isAccountValid = await checkUser()
            if (isAccountValid) {
                setIsLoggedIn(true)
                setTimeout(() => {
                    navigate('/home')
                }, [1000])
            } else {
                setIsLoggedIn(false)
            }
        } catch (error) {
            console.error('Error during login:', error);
            setMessage('An error occurred. Please try again.');
        }
    };

    return (
        <div>
            <Box
                component="form"
                onSubmit={handleLogin}
                sx={{
                    margin: '0.2rem',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    height: '50vh',
                    width: '100%',
                    alignItems: 'center',
                    fontSize: 'large',
                    backgroundColor: '#fff'
                }}
            >

                <Typography variant="h4" gutterBottom >
                    {t("Login")}<br />
                </Typography>
                {t("LogoutWarning")}<br />
                <TextField
                    label={t('username')}
                    variant="outlined"
                    sx={{ margin: '2rem' }}
                    inputProps={{
                        style: {
                            fontWeight: 'bold',
                            fontSize: '1rem'
                        },
                    }}
                    InputLabelProps={{ style: { fontSize: '1rem' } }}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <TextField
                    label={t('password')}
                    variant="outlined"
                    type="password"
                    inputProps={{
                        style: {
                            fontWeight: 'bold',
                            fontSize: '1rem'
                        },
                    }}
                    InputLabelProps={{ style: { fontSize: '1rem' } }}
                    onChange={(e) => setUserPwd(e.target.value)}
                    required
                />
                <Button variant="contained" color="primary" type="submit" size="large" sx={{ marginTop: '4rem' }}>
                    {t('Login')}
                </Button>

                {message && (
                    <Typography variant="body2" color="error">
                        {message}
                    </Typography>
                )}

            </Box>
        </div>
    );
};   
