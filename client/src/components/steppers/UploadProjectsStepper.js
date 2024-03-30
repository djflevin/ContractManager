import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';

import UploadCSVStep from './UploadCSVStep';
import DataPreviewStep from './DataPreviewStep';
import ConfirmUploadStep from './ConfirmUploadStep';

import { useSelector } from 'react-redux';
import { selectValidData, selectValidFile } from '../../slices/csvUploadSlice';
import { Fragment } from 'react';
import { useState } from 'react';


const steps = ['Upload CSV', 'Preview', 'Confirm Upload'];


export default function UploadProjectsStepper() {
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());

  const validFile = useSelector(selectValidFile);
  const validData = useSelector(selectValidData);


  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <UploadCSVStep />;
      case 1:
        return <DataPreviewStep />;
      case 2:
        return <ConfirmUploadStep />;
      default:
        return <UploadCSVStep />;
    }
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Box sx={{ width: '100%', minHeight: '75vh' }}>
      <Stepper activeStep={activeStep} sx={{ my: 5 }}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <Fragment sx={{ width: '100%' }}>
        <Box
          // Default push The buttons to the bottom of the parent box 
          // (which is the entire page)
          sx={{ display: 'flex', flexDirection: 'column', minHeight: '60vh' }}
        >
          {getStepContent(activeStep)}
        </Box>
        {/* Align buttons to bottom of parent box */}
        <Box sx={{ display: 'flex', flexDirection: 'row', p: 1, m: 1 }}>
          <Button
            color="inherit"
            variant="outlined"
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Back
          </Button>
          <Box sx={{ flex: '1 1 auto' }} />
          <Button
            onClick={handleNext}
            disabled={(validFile === false && validData === false) || activeStep === 2}
            variant="contained"
          >
            Next
          </Button>
        </Box>
      </Fragment>
    </Box>
  );
}