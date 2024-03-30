import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';

import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { copyObject, formGenerator } from '../utils/editObjectUtils';
import { renderObjectContracts } from '../utils/editObjectUtils';
import { useAuthUser } from 'react-auth-kit';
import { Alert, Box, Divider, Typography } from '@mui/material';

import axios from 'axios';

// Fetches the contract templates from the server
const fetchContractTemplates = async (templateType) => {
  const res = await axios.get("/templates/" + templateType);
  // If the response is successful
  if (res.status === 200) {
    // Set the state with the data
    return res.data;
  } else {
    console.log("Error fetching contract templates");
    return [];
  }
};

const getAllContractTemplates = async () => {
  const studentLetterTemplates = await fetchContractTemplates('student_letters');
  const projectDescriptionTemplates = await fetchContractTemplates('project_descriptions');
  const frameworkAgreementTemplates = await fetchContractTemplates('framework_agreements');

  return {
    studentLetterTemplates,
    projectDescriptionTemplates,
    frameworkAgreementTemplates,
  }
}

const updateObject = async (objectToEdit, objectToEditType, objectSetter) => {
  const res = await axios.put("/" + objectToEditType + "/" + objectToEdit.id, objectToEdit);
  // If the response is successful
  if (res.status === 200) {
    // Set the state with the data
    // If the response is successful refetch the data from the server and update the state
    return true;

  } else {
    console.log("Error updating object");
    return false;
  }
}

export default function EditDataDialog({ origObjectSelector, objectToEditType, title, children, objectSetter }) {
  const dispatch = useDispatch();
  const authUser = useAuthUser();

  const [open, setOpen] = React.useState(false);
  const [objectCopy, setObjectCopy] = React.useState({});
  const [loading, setLoading] = React.useState(true);
  const [contractTemplates, setContractTemplates] = React.useState({
    studentLetterTemplates: [],
    projectDescriptionTemplates: [],
    frameworkAgreementTemplates: [],
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    // Reset the object copy
    setObjectCopy(copyObject(origObject));
    setOpen(false);
  };

  const handleSave = () => {
    updateObject(objectCopy, objectToEditType).then((success) => {
      if (success) {
        dispatch(objectSetter(objectCopy));
        setOpen(false);
      } else {
        alert("Error updating object");
      }

    });
  };

  const origObject = useSelector(origObjectSelector);

  React.useEffect(() => {
    setObjectCopy(copyObject(origObject));
  }, [origObject]);

  React.useEffect(() => {
    // Fetch the contract templates
    getAllContractTemplates().then((templates) => {
      setContractTemplates(templates);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      {/* FAB alligned to bottom of screen (Reactive) */}
      <Fab color="warning"
        aria-label="edit"
        onClick={handleClickOpen}
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        variant="extended">
        Edit {objectToEditType}
        <EditIcon sx={{ ml: 1 }} />
      </Fab>
      {/* Persistent Dialog */}
      <Dialog open={open} fullWidth maxWidth="md" scroll="paper">
        <DialogTitle>{title}</DialogTitle>
        {
          authUser() && authUser().role !== 'ADMIN' &&
          <Alert severity="warning">
            Only Admins can edit all fields. Non admins can only edit certain fields.
          </Alert>
        }
        <DialogContent sx={{ width: '100%', minWidth: '500' }}>
          {!loading && objectCopy && contractTemplates &&
            renderObjectContracts(objectCopy, objectToEditType, setObjectCopy, contractTemplates, authUser)}

          <Divider sx={{ my: 2 }} />
          <Typography variant="h5" sx={{ my: 2 }}>Details</Typography>
          {objectCopy && formGenerator(objectCopy, objectToEditType, setObjectCopy, contractTemplates, authUser)}
        </DialogContent>

        <DialogActions sx={{ m: 2 }}>
          <Button onClick={handleClose} variant="contained" color="primary">
            Cancel Changes</Button>

          {/* Disable button in case nothing has been changed */}
          <Button onClick={handleSave}
            variant="contained"
            color="warning"
            disabled={JSON.stringify(objectCopy) === JSON.stringify(origObject)}
          >
            Save Changes</Button>

        </DialogActions>
      </Dialog>
    </div>
  );
}