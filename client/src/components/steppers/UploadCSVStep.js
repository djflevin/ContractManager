import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  selectCSVData,
  selectCSVFileName,
  setCSVData,
  setCSVFileName,
  setInvalidProjectRows,
  setValidFile,
  setValidProjectRows,
} from '../../slices/csvUploadSlice';

import {
  Button,
  Grid,
  Alert,
  Divider,
  Input,
} from '@mui/material';

import DownloadIcon from '@mui/icons-material/Download';
// Import csv template file
import { unpackCSV, validateHeaders, validateData } from '../utils/CSV_Utils';

const UploadCSVStep = () => {
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const fileName = useSelector(selectCSVFileName);
  const [error, setError] = useState(null);
  const csvData = useSelector(selectCSVData);
  const types = ['text/csv'];

  useEffect(() => {
    if (csvData !== null) {
      let { valid, missingHeaders } = validateHeaders(csvData);
      if (!valid) {
        setError(`Invalid File - Ensure you are using the correct CSV template and have atleast one row of data. Missing data for headers: ${missingHeaders}`);
        resetCSVData();
      } else {
        let { validProjectRows, invalidProjectRows, hasData } = validateData(csvData);
        if (!hasData) {
          setError('Invalid File - No data found in CSV file.');
          resetCSVData();
        } else {
          dispatch(setValidProjectRows(validProjectRows));
          dispatch(setInvalidProjectRows(invalidProjectRows));
        }
      }
    }
  }, [csvData, dispatch]);

  const handleChange = async (e) => {
    let selected = e.target.files[0];
    if (selected && types.includes(selected.type)) {
      setFile(selected);
      dispatch(setCSVFileName(selected.name));
      setError('');
      await unpackCSV(selected, dispatch, setCSVData);
      dispatch(setValidFile(true));
    } else {
      setError('Please select a valid CSV file');
      resetCSVData();
    }
  }

  const resetCSVData = () => {
    dispatch(setCSVData(null));
    dispatch(setCSVFileName(null));
    dispatch(setValidFile(false));
    setFile(null);
  }


  return (
    <div>
      {fileName &&
        <Alert severity="success" sx={{ mt: 1 }}>
          {fileName} Selected.
        </Alert>}
      {error && <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>}
      <Divider sx={{ my: 2 }} />
      <Grid container spacing={2}>
        {/* TODO: Improve styling */}
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            component="label"
            sx={{ mr: 2 }}
            variant="contained"
          >
            Select CSV File
            <Input
              type="file"
              onChange={handleChange}
              sx={{ display: 'none' }}
            />
          </Button>
          <Button
            variant="contained"
            disabled={!fileName}
            onClick={() => {
              resetCSVData();
            }}
            sx={{ mr: 2 }}
          >
            Clear
          </Button>

          <Button
            variant="contained"
            onClick={() => {
              window.open('/CSV_Template.csv', '_blank');
            }}
            sx={{ ml: 'auto' }}

          >
            <DownloadIcon sx={{ mr: 1 }} />
            CSV Template

          </Button>
        </Grid>
      </Grid>
    </div>
  )
}

export default UploadCSVStep;