import React, { useState } from 'react';
import { Checkbox, FormControlLabel, Typography, Grid, Paper, Box } from '@mui/material';

// Tarkistuslistan osat
const checklistData = [
    {
        category: "Moottoripyörän valmistelu",
        items: [
            "Kunnossapito ja huolto",
            "Renkaat",
            "Jarrut",
            "Ketjut ja hihnat",
            "Moottoripyörän varaosat",            
        ]
    },
    {
        category: "Dokumentit ja luvat",
        items: [
            "Ajokortti",
            "Moottoripyörän rekisteröintitodistus",
            "Vakuutukset",
            "Passi ja viisumit",
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
            "Auringon suojatuotteet",
            "Varahanskat ja -kengät"
        ]
    },
    {
        category: "Matkavarusteet",
        items: [
            "Puhelin",
            "Laukut ja repput",
            "Työkalupakki",
            "Rengaskorjaussetti",
            "GPS tai kartat",
            "Laturi ja virtapankki",
            "Matkaopas ja/tai reittisuunnitelma"
        ]
    },
    {
        category: "Rahoitus ja maksaminen",
        items: [
            "Käteinen ja luottokortit",
            "Pankkikortti ja/ tai matkakortti",
            "Bensiinikortti tai prepaid-kortit"
        ]
    },
    {
        category: "Turvallisuus ja hätätilanteet",
        items: [
            "Ensiapupakkaus",
            "Hätätilanteiden varalta",
            "Varavalo ja taskulamppu",
        ]
    },
    {
        category: "Majoitus ja reitit",
        items: [
            "Varaukset ja yöpymispaikat",
            "Reittisuunnitelma",
            "Ravintolat ja huoltoasemat",
            "Lautat"
        ]
    },
    {
        category: "Muuta",
        items: [
            "Sääennusteet ja sääolosuhteet",
            "Tieliikennesäännöt ja nopeusrajoitukset",
            "Paikalliset säännöt ja määräykset"
        ]
    },
    {
        category: "Matkan aikana",
        items: [
            "Hyvinvointi ja jaksaminen",
            "Matkustajien turvallisuus",
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
