import { useEffect, useState } from 'react';
import {
    Checkbox,
    FormControlLabel,
    Typography,
    Grid,
    Paper,
    Box,
} from '@mui/material';
import '../../css/reissu.css';

const checklistData = [
    {
        category: 'Moottoripyörän valmistelu',
        items: [
            'Kunnossapito ja huolto',
            'Renkaat',
            'Jarrut',
            'Ketjut (jatkuva rasvaus)',
            'Akun lataus',
        ],
    },
    {
        category: 'Dokumentit ja luvat (minicrip)',
        items: [
            'Ajokortti',
            'Vakuutuspapru',
            'Passi ja viisumit (voimassaolo)',
            'Eurooppalainen sairausvakuutuskortti (EHIC)',
        ],
    },
    {
        category: 'Varusteet ja pukeutuminen',
        items: [
            'Kypärä',
            'Ajovarusteet',
            'Sadetakit ja vedenpitävät vaatteet',
            'Lämpimät vaatteet',
            'Varahanskat ja -kengät',
            'Vedenkestävä puhelinpussi tankoon',
        ],
    },
    {
        category: 'Matkavarusteet',
        items: [
            'Puhelin (navi)',
            'Laukut ja repput',
            'Hygienia pussukka',
            'Työkalupakki (renkaan pultit)',
            'Rengaskorjaussetti',
            'Laturi ja virtapankki',
            'GoPro + akut',
            'Salmiakki',
        ],
    },
    {
        category: 'Rahoitus ja maksaminen',
        items: [
            'Ennakkomaksut soveltuvilta osin',
            'Käteinen, pankki & luottokortit (hajautettava)',
        ],
    },
    {
        category: 'Turvallisuus ja hätätilanteet',
        items: ['Ensiapupakkaus (min buranat)'],
    },
    {
        category: 'Sovellukset (päivitä apit)',
        items: [
            'Google Maps',
            'Trip Advisor',
            'Direct Ferries',
            'Booking',
            'Trivago',
            'Omio',
            'Tallink SiljaLine',
            'KTM Connect',
            'VR',
            'AirBnB',
            'Pankkisovellukset',
            'SOME',
            'AI',
            'Connect (lenkillä..)',
        ],
    },
    {
        category: 'Majoitus ja reitit',
        items: [
            'Varaukset ja yöpymispaikat sovellukset',
            'Reittisuunnitelma (dynaaminen)',
            'Ravintolat ja huoltoasemat (navi)',
            'Lauttojen varaukset isommalla ennakolla',
        ],
    },
    {
        category: 'Muuta',
        items: ['Läppäri', 'Johtosetti', 'Minigrip pusseja'],
    },
    {
        category: 'Matkan aikana',
        items: ['Tarpeeksi pitstoppeja', 'Äänikirjoja'],
    },
];

const Checklist = () => {
    // Load from localStorage or initialize as empty
    const [checkedItems, setCheckedItems] = useState(() => {
        const saved = localStorage.getItem('checklistState');
        return saved ? JSON.parse(saved) : {};
    });

    // Save to localStorage on every change
    useEffect(() => {
        localStorage.setItem('checklistState', JSON.stringify(checkedItems));
    }, [checkedItems]);

    const handleCheckboxChange = (category, item) => {
        setCheckedItems((prev) => ({
            ...prev,
            [category]: {
                ...prev[category],
                [item]: !prev?.[category]?.[item],
            },
        }));
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                marginBottom: '1rem',
                height: '74vh',
                overflowY: 'auto',
            }}
        >
            <Typography
                sx={{ marginBottom: 10 }}
                variant='h4'
                align='center'
                gutterBottom
            >
                Euro Campaign 25, tarkistuslista
            </Typography>

            {checklistData.map((categoryData) => (
                <Paper sx={{ padding: '1rem' }} key={categoryData.category}>
                    <Typography variant='h6'>
                        {categoryData.category}
                    </Typography>
                    <Grid container spacing={2}>
                        {categoryData.items.map((item) => (
                            <Grid item xs={12} sm={6} md={4} key={item}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={
                                                checkedItems[
                                                    categoryData.category
                                                ]?.[item] || false
                                            }
                                            onChange={() =>
                                                handleCheckboxChange(
                                                    categoryData.category,
                                                    item
                                                )
                                            }
                                            color='primary'
                                        />
                                    }
                                    label={item}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Paper>
            ))}
        </Box>
    );
};

export default Checklist;
