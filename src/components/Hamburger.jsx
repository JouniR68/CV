// components/HamburgerMenu.jsx

import React, { useState } from 'react';
import { IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from './LoginContext';

const HamburgerMenu = () => {
    const { t } = useTranslation()
    const { isLoggedIn } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    const toggleDrawer = (open) => (event) => {
        setIsOpen(open);
    };

    return (
        <div>
            {/* Hamburger Button */}
            <IconButton className="hamburger-menu" edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
                <MenuIcon />
            </IconButton>

            {/* Drawer Menu */}
            <Drawer anchor="left" open={isOpen} onClose={toggleDrawer(false)}>
                <List>
                    <ListItem button component={Link} to="/">
                        <ListItemText primary="Koti" />
                    </ListItem>
                    {!isLoggedIn &&
                        <div>
                            <ListItem button component={Link} to="/userLogin">
                                <ListItemText primary={t('Login')} />
                            </ListItem>
                            <ListItem button component={Link} to="/register">
                                <ListItemText primary={t('Register')} />
                            </ListItem>
                        </div>
                    }
                    <ListItem button component={Link} to="/checkLocation">
                        <ListItemText primary={t('ProfileLocation')} />
                    </ListItem>
                </List>
            </Drawer>
        </div>
    );
};

export default HamburgerMenu;
