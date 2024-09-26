import { collection, doc, deleteDoc, getDocs} from "firebase/firestore"
import { db } from "../firebase"
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography, List, ListItem, ListItemText, ListItemSecondaryAction } from '@mui/material';
import { useAuth } from "./LoginContext";

const Poistatunnus = () => {
  const [isAccess, setIsAccess] = useState(false);
    const accessValid = useRef(sessionStorage.getItem("adminLevel"));
    const [contacts, setContacts] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedContact, setSelectedContact] = useState(null);
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();

    useEffect(() => {
      if (accessValid.current === "valid" && isLoggedIn) {
          setIsAccess(true);
      }
  }, [isLoggedIn]);

    // Fetch contacts from Firestore
    useEffect(() => {
      const fetchContacts = async () => {
        const contactsCollection = collection(db, 'contacts');
        const contactsSnapshot = await getDocs(contactsCollection);
        const contactsList = contactsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setContacts(contactsList);
      };
  
      fetchContacts();
    }, []);
  
    // Open confirmation dialog
    const handleOpenDialog = (contact) => {
      setSelectedContact(contact);
      setOpen(true);
    };
  
    // Close dialog
    const handleCloseDialog = () => {
      setOpen(false);
      navigate('/home');
    };
  
    // Handle deletion
    const handleDelete = async () => {
      if (selectedContact) {
        await deleteDoc(doc(db, 'contacts', selectedContact.id));
        setContacts(contacts.filter(contact => contact.id !== selectedContact.id));
        setOpen(false);
      }
    };
  
    return (
      <div className = "tunnus">
        <Typography variant="h4" style={{marginTop:'2rem', marginBottom:'1rem'}}>Tunnuslista</Typography>
        <List>
          {contacts.map(contact => (
            <ListItem key={contact.id}>
              <div className = "tunnus-tili">
              <ListItemText primary={contact.name} secondary={contact.email} secondaryTypographyProps={{ fontSize: '18px', marginRight:'10rem'}}  />              
              <ListItemSecondaryAction>
                <Button variant="contained" color="secondary" onClick={() => handleOpenDialog(contact)}>
                  Poista
                </Button>
              </ListItemSecondaryAction>
              </div>
            </ListItem>
          ))}
        </List>
  
        {/* Confirmation Dialog */}
        <Dialog open={open} onClose={handleCloseDialog}>
          <DialogTitle>{"Poista tunnus"}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Oletko varma, että haluat poistaa tunnuksen {selectedContact?.name}?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Peruuta
            </Button>
            <Button onClick={handleDelete} color="secondary">
              Poista
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  };
  
  export default Poistatunnus;
