/* eslint-disable react/prop-types */
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  Typography
} from "@mui/material";

const NotificaatioDialog = (props) => {
  console.log("props:", props)
  const { message, onClose } = props;
  console.log("NotificationDialog: ", message)
  return (
    <Dialog open={true}>
      <DialogTitle>Ilmoitus</DialogTitle>
      <DialogContent>
        <Typography>{message}</Typography>
        <Button onClick={onClose}>Ok</Button>
      </DialogContent>
    </Dialog>
  );
};

export default NotificaatioDialog;
