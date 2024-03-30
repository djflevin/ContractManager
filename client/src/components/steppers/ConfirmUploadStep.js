import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Typography, Box, Alert, Button } from '@mui/material';
import {
  selectvalidProjectRows,
  selectinvalidProjectRows,
} from '../../slices/csvUploadSlice';

import { FileUpload } from '@mui/icons-material';
import axios from 'axios';


const ConfirmUploadStep = () => {
  const validProjects = useSelector(selectvalidProjectRows);
  const invalidProjects = useSelector(selectinvalidProjectRows);
  const [uploadStatusMessage, setUploadStatusMessage] = useState(null);
  const [alertType, setAlertType] = useState("success");
  const [uploadStatusOpen, setUploadStatusOpen] = useState(false);

  const handleUpload = (projectList) => {
    console.log("Uploading projects");
    axios.post('/projects/upload', projectList)
      .then((res) => {
        if (res.status === 200) {
          // console.log(res.data);
          setUploadStatusMessage(
            `Successfully created ${res.data.newOrganisations}  organisations, ${res.data.newProjects} projects, ${res.data.newStudents} students.`
          );
          setAlertType("success");
          setUploadStatusOpen(true);
        }
      })
      .catch((err) => {
        // console.log(err);
        setUploadStatusMessage("Failed to upload projects. Please try again. If the problem persists, please contact the system administrator.");
        setAlertType("error");
        setUploadStatusOpen(true);
      }
      );
  }

  return (
    <div>
      {
        uploadStatusOpen && (
          <Alert sx={{ mt: 2, mb: 2 }} open={uploadStatusOpen} severity={alertType}>
            {uploadStatusMessage}
          </Alert>
        )
      }
      {
        validProjects.length > 75 && (
          <Alert sx={{ mt: 2, mb: 2 }} severity="error">
            You have {validProjects.length} valid projects. Only up to 75 projects can be uploaded at a time. Please upload the projects in batches.
          </Alert>
        )
      }

      <Typography variant="h6" gutterBottom>
        Confirm Upload
      </Typography>

      <Typography variant="body1" gutterBottom>
        Your have {validProjects.length} valid projects and {invalidProjects.length} invalid projects.
      </Typography>

      <Typography variant="body1" gutterBottom>
        Click the button below to upload your projects, or go back to the previous step to fix your invalid projects.
      </Typography>

      <Box sx={{ mt: 20, mb: 2, width: '100%' }} align="center" justifyContent={"center"} >
        <Button
          variant="contained"
          color="primary"
          id='upload-button'
          startIcon={<FileUpload />}
          disabled={validProjects.length === 0 || validProjects.length > 75}
          onClick={() => handleUpload(validProjects)}
          sx={{ mt: 20, mb: 2, width: 200 }}
        >
          Upload
        </Button>
      </Box>
    </div>
  )
}

export default ConfirmUploadStep;

