import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

const MultiLineTextField = ({ title, children }) => {
  return (
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '40ch' },
      }}
      noValidate
      autoComplete="off"
    >
      <div>
        <TextField
          label={title}
          defaultValue={children}
          multiline
          focused />
      </div>
    </Box>
  );
}
export default MultiLineTextField;
