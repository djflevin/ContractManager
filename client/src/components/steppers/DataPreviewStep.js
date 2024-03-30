import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Grid, Typography } from '@mui/material';
import MaterialReactTable from 'material-react-table';
import {
  selectvalidProjectRows,
  selectinvalidProjectRows,
  updateValidProjectRow,
  updateInvalidProjectRow,
  removeInvalidProjectRow,
  removeValidProjectRow,
  pushInvalidProjectRows,
  pushValidProjectRows
} from '../../slices/csvUploadSlice';

import { tableColumns, validateRow } from '../utils/CSV_Utils';

const UploadCSVStep = () => {
  const dispatch = useDispatch();
  const validProjects = useSelector(selectvalidProjectRows);
  const invalidProjects = useSelector(selectinvalidProjectRows);

  // const handleSaveValidTableRow = async ({ exitEditingMode, row, values }) => {
  const handleSaveValidTableRow = async ({ exitEditingMode, row, values }) => {
    const newRow = { ...row.original, ...values };
    console.log(newRow);
    const { valid } = validateRow(newRow);
    if (valid) {
      dispatch(updateValidProjectRow({ index: row.index, row: newRow }));
    } else {
      dispatch(removeValidProjectRow(row.index));
      dispatch(pushInvalidProjectRows(newRow));
    }
    exitEditingMode();
  };

  // Handle saving of edited rows from invalid projects table
  const handleSaveInvalidTableRow = async ({ exitEditingMode, row, values }) => {
    const newRow = { ...row.original, ...values };
    console.log(newRow);
    const { valid } = validateRow(newRow);
    if (valid) {
      // dispatch(updateValidProjectRow({ index: row.index, row: newRow }));
      dispatch(removeInvalidProjectRow(row.index));
      dispatch(pushValidProjectRows(newRow));
    } else {
      dispatch(updateInvalidProjectRow({ index: row.index, row: newRow }));
    }
    exitEditingMode();
  };

  const muiTableProps = {
    elevation: 0,
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body1" gutterBottom>
            You can edit project details in the table below. Only valid projects will be uploaded and invalid projects will be ignored.
          </Typography>
        </Alert>
        <Typography variant="h6" gutterBottom>
          Valid Projects
        </Typography>
        <MaterialReactTable
          data={validProjects}
          columns={tableColumns()}
          title="Valid Projects"
          muiTablePaperProps={muiTableProps}
          initialState={{
            density: 'compact',
          }}
          enableTopToolbar={false}
          enableColumnActions={false}
          enableEditing={true}
          onEditingRowSave={handleSaveValidTableRow}
        />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Invalid Projects
        </Typography>
        <MaterialReactTable
          data={invalidProjects}
          columns={tableColumns()}
          title="Invalid Projects"
          muiTablePaperProps={muiTableProps}
          initialState={{
            density: 'compact',
          }}
          enableTopToolbar={false}
          enableColumnActions={false}
          enableEditing={true}
          onEditingRowSave={handleSaveInvalidTableRow}
        />
      </Grid>
    </Grid>
  );
};

export default UploadCSVStep;
