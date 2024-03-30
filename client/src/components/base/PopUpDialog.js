// Base Pop Up Dialog 
// --------------------------------------------------
import React from 'react';
import { Button, Dialog, DialogTitle, DialogContent } from '@mui/material';

const PopUpDialog = ({ buttonLabel, dialogTitle, children }) => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        {buttonLabel}
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>
          {children}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default PopUpDialog