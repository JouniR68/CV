// components/HamburgerMenu.jsx

import React, { useState } from 'react';
import { IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from './LoginContext';

const Hamburger = () => {
    const { t } = useTranslation()
    const { isLoggedIn } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    const toggleDrawer = (open) => (event) => {
        setIsOpen(open);
    };

    return (
        <div className="hamburger-menu-container">            
            <IconButton className="hamburger-menu" edge="start" color="inherit" aria-label="menu" size= "large" onClick={toggleDrawer(true)}>
                <MenuIcon sx={{ marginLeft: '16px',marginTop:'-0.4rem;' }} />
            </IconButton>

          <Drawer anchor="right" open={isOpen} onClose={toggleDrawer(false)}>
                <div className="hamburger-popup-menu">
                    <List>
                        <ListItem button component={Link} to="/">
                            <ListItemText primary="Koti" />
                        </ListItem>
                        <ListItem button component={Link} to="/profile">
                            <ListItemText primary="CV / myself" />
                        </ListItem>

                        {!isLoggedIn && (
                            <div>
                                <ListItem button component={Link} to="/userLogin">
                                    <ListItemText primary="Login" />
                                </ListItem>
                                <ListItem button component={Link} to="/register">
                                    <ListItemText primary="Register" />
                                </ListItem>
                            </div>
                        )}
                        <ListItem button component={Link} to="/checkLocation">
                            <ListItemText primary="Nearby.." />
                        </ListItem>
                    </List>
                </div>
            </Drawer>
        </div>
    );
};

export default Hamburger;
