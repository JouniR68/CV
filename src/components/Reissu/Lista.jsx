import { useState } from 'react';
import { Checkbox, FormControlLabel, Typography, Grid, Paper, Box } from '@mui/material';

// Tarkistuslistan osat
const checklistData = [
    {
        category: "Moottoripyörän valmistelu",
        items: [
            "Kunnossapito ja huolto",
            "Renkaat",
            "Jarrut",
            "Ketjut (jatkuva rasvaus)",
            "Akun lataus",
        ]
    },
    {
        category: "Dokumentit ja luvat (minicrip)",
        items: [
            "Ajokortti",
            "Vakuutuspapru",
            "Passi ja viisumit (voimassaolo)",
            "Eurooppalainen sairausvakuutuskortti (EHIC)"
        ]
    },
    {
        category: "Varusteet ja pukeutuminen",
        items: [
            "Kypärä",
            "Ajovarusteet",
            "Sadetakit ja vedenpitävät vaatteet",
            "Lämpimät vaatteet",
            "Varahanskat ja -kengät",
            "Vedenkestävä puhelinpussi tankoon"
        ]
    },
    {
        category: "Matkavarusteet",
        items: [
            "Puhelin (navi)",
            "Laukut ja repput",
            "Hygienia pussukka",
            "Työkalupakki (renkaan pultit)",
            "Rengaskorjaussetti",
            "Laturi ja virtapankki",
            "GoPro + akut",
            "Salmiakki"
        ]
    },
    {
        category: "Rahoitus ja maksaminen",
        items: [
            "Ennakkomaksut soveltuvilta osin",
            "Käteinen, pankki & luottokortit (hajautettava)",
        ]
    },
    {
        category: "Turvallisuus ja hätätilanteet",
        items: [
            "Ensiapupakkaus (min buranat)",
        ]
    },
    {
        category: "Sovellukset (päivitä apit)",
        items: [
            "Google Maps", "Trip Advisor", "Direct Ferries", "Booking", "Trivago", "Omio", "Tallink SiljaLine", "KTM Connect", "VR", "AirBnB",
            "Pankkisovellukset",
            "SOME",
            "AI",
            "Connect (lenkillä..)",
        ]
    },
    {
        category: "Majoitus ja reitit",
        items: [
            "Varaukset ja yöpymispaikat sovellukset",
            "Reittisuunnitelma (dynaaminen)",
            "Ravintolat ja huoltoasemat (navi)",
            "Lauttojen varaukset isommalla ennakolla"
        ]
    },
    {
        category: "Muuta",
        items: [
            "Läppäri",
            "Johtosetti",
            "Minigrip pusseja"
        ]
    },
    {
        category: "Matkan aikana",
        items: [
            "Tarpeeksi pitstoppeja",
            "Äänikirjoja"
        ]
    }
];

// Komponentti, joka näyttää tarkistuslistan
const Checklist = () => {
    const [checkedItems, setCheckedItems] = useState({});

    const handleCheckboxChange = (category, item) => {
        setCheckedItems(prevState => ({
            ...prevState,
            [category]: {
                ...prevState[category],
                [item]: !prevState[category]?.[item]
            }
        }));
    };

    return (
        <Box sx={{ padding: 2 }}>
            <Typography sx={{ marginBottom: 10 }} variant="h4" align="center" gutterBottom>
                Euro Campaign 25, tarkistuslista
            </Typography>

            {checklistData.map((categoryData) => (
                <Paper sx={{ marginBottom: 3, padding: 0, overFlowY: 'auto', zoom: 0.6 }} key={categoryData.category}>
                    <hr></hr>
                    <Typography variant="h6">{categoryData.category}</Typography>
                    <Grid container spacing={2}>
                        {categoryData.items.map((item) => (
                            <Grid item xs={12} sm={6} md={4} key={item} >
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={checkedItems[categoryData.category]?.[item] || false}
                                            onChange={() => handleCheckboxChange(categoryData.category, item)}
                                            color="primary"
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
