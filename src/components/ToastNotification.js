import { Alert, Snackbar } from "@mui/material";
import { useEffect, useState } from "react";

const ToastNotification = ({ message, triggerToast }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (triggerToast !== 0) {
      setOpen(true);
    }
  }, [triggerToast]);

  // Open the snackbar
  const handleClick = () => {
    setOpen(true);
  };

  // Close the snackbar
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div style={{}}>
      <Snackbar
        open={open}
        autoHideDuration={3000} // The snackbar will automatically close after 3 seconds
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          {message || "This is a custom message!"}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ToastNotification;
