import { collection, doc, deleteDoc, getDocs} from "firebase/firestore"
import { db } from "../firebase"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography, List, ListItem, ListItemText, ListItemSecondaryAction } from '@mui/material';

const Poistatunnus = () => {
    const [contacts, setContacts] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedContact, setSelectedContact] = useState(null);
    const navigate = useNavigate();
  
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
      <div>
        <Typography variant="h4">Contact List</Typography>
        <List>
          {contacts.map(contact => (
            <ListItem key={contact.id}>
              <ListItemText primary={contact.name} secondary={contact.email} />
              <ListItemSecondaryAction>
                <Button variant="contained" color="secondary" onClick={() => handleOpenDialog(contact)}>
                  Poista
                </Button>
              </ListItemSecondaryAction>
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
