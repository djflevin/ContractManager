// Child Card Component for the Dashboard
// --------------------------------------------------
import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';


const ChildCard = ({ title, children , props}) => {
  return (
    <Card variant='outlined' sx={{ mt: 1 } } {...props}>
      <CardContent>
        <Typography variant="h6" component="div">
          {title}
        </Typography>
        <Divider sx={{ my: 2 }} />
          {children}
      </CardContent>
    </Card>
  );
}

export default ChildCard;