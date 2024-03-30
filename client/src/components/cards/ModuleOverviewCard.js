// Module Overview Card 
// Child Card Component containging a Grid with 2 Columns and 2 Rows

import React from 'react';

import Book from '@mui/icons-material/Book';
import List from '@mui/icons-material/List';

import ChildCard from '../base/ChildCard';
import PieChart from '../charts/PieChart';
import DetailsList from '../base/DetailList';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';


const ModuleOverviewCard = () => {

  let [state, setState] = React.useState({
    moduleDetails: [
      { label: 'Module', value: 'COMP0200 Functional Programming', icon: <Book /> },
      { label: 'Total Projects', value: '500', icon: <List /> },
    ],
  });


  return (
    <ChildCard title='COMP0020 Functional Programming'>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <DetailsList items={state.moduleDetails} />
        </Grid>

        <Grid item xs={4}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PieChart />
          </Box>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />
      <CardActions>
        <Button size='small' variant='outlined'>View Module</Button>
      </CardActions>
    </ChildCard>
  );
};

export default ModuleOverviewCard;