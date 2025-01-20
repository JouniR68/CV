 
 import { createTheme, ThemeProvider } from '@mui/material/styles';
 
 const theme = createTheme({
        breakpoints: {
            values: {
                xs: 0,   // Extra-small devices
                sm: 600, // Small devices (tablets)
                md: 980, // Medium devices (default desktop size starts here)
                lg: 1200, // Large devices
                xl: 1920, // Extra-large devices
            },
        },
    });

    export default theme;