// Main Cards Component for the Dashboard
// --------------------------------------------------

import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

const MainCard = ({ title, children, props }) => {
  return (
    <Card sx={{ ma: 1 }} raised={true} {...props} elevation={2}>
      <CardContent>
        <Typography variant="h6" component="div">
          {title}
        </Typography>
        <Divider sx={{ my: 1 }} />
        {children}
      </CardContent>
    </Card>
  );
}

export default MainCard;
