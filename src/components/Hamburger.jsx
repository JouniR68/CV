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
        <div className="hamburger-menu">            
            <IconButton edge="start" color="inherit" aria-label="menu" size= "large" onClick={toggleDrawer(true)}>
                <MenuIcon sx={{ marginLeft: '16px',marginTop:'-0.4rem;' }} />
            </IconButton>

          <Drawer anchor="top" open={isOpen} onClose={toggleDrawer(false)}>
                <div className="hamburger-popup-menu">
                    <List className="hamburger-menu-list">
                        <ListItem className="hamburger-menu-listItem" button component={Link} to="/">
                            <ListItemText primaryTypographyProps={{ fontSize: "2rem" }} primary="Koti" />
                        </ListItem>
                        <ListItem className="hamburger-menu-listItem" button component={Link} to="/profile">
                            <ListItemText primaryTypographyProps={{ fontSize: "2rem" }} primary="CV / myself" />
                        </ListItem>
                        {isLoggedIn && <ListItem className="hamburger-menu-listItem" button component={Link} to="/logout">
                                    <ListItemText primaryTypographyProps={{ fontSize: "2rem" }} primary="Logout" />
                                </ListItem>}

                        {!isLoggedIn && (
                            <div>
                                <ListItem className="hamburger-menu-listItem" button component={Link} to="/userLogin">
                                    <ListItemText primaryTypographyProps={{ fontSize: "2rem" }} primary="Login" />
                                </ListItem>
                                <ListItem className="hamburger-menu-listItem" button component={Link} to="/register">
                                    <ListItemText primaryTypographyProps={{ fontSize: "2rem" }} primary="Register" />
                                </ListItem>
                            </div>
                        )}
                    </List>
                </div>
            </Drawer>
        </div>
    );
};

export default Hamburger;
