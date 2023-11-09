import { useState, useEffect } from "react";
import { Alert, Snackbar } from '@mui/material';

function ErrorForm({ message, messageType }) {
 const [open, setOpen] = useState(true);
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      open={open}
      autoHideDuration={10000}
      onClose={handleClose}
      transitionDuration={1500}
    >
      <Alert severity={messageType}>{message}</Alert>
    </Snackbar>
  );
}

export default ErrorForm;
