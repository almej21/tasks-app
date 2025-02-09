import { Alert, Snackbar } from "@mui/material";
import { useEffect, useState } from "react";

const ToastNotification = (props) => {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (props.toastObj.triggerToast !== false) {
      setOpen(true);
    }
  }, [props.toastObj]);

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
        <Alert
          onClose={handleClose}
          severity={props.toastObj.severity || "success"}
          sx={{ width: "100%" }}
        >
          {props.toastObj.title || "This is a custom message!"}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ToastNotification;
