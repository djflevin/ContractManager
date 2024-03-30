import React from 'react';
import Chart from 'react-apexcharts'
import { useState } from 'react';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import CardActions from '@mui/material/CardActions';

const BarChart = (props) => {
  const [stackType, setStackType] = useState('normal');

  const options = {
    chart: {
      type: 'bar',
      stacked: true,
      stackType: stackType,
    },
    responsive: [{
      options: {
        legend: {
          position: 'bottom',
        }
      }
    }],
    xaxis: {
      categories: props.categories || [],
    },
    fill: {
      opacity: 1
    },
    legend: {
      position: 'bottom',
    },
  };

  const updateStackType = (e) => {
    setStackType(e.target.checked ? '100%' : 'normal')
  }

  const series = props.series || []

  return (
    <div id="chart">
      {/* Ensure chart updates after options switch */}
      <Chart
        key={stackType}
        options={options}
        series={series}
        type="bar"
        width={props.width ? props.width : 500}
        height={props.height ? props.height : 200}
      />
      {/* Slider for Stack Type align switch to right */}
      <CardActions>
        <Typography variant="body2" component="div">
          Show as Total
        </Typography>
        <Switch
          checked={stackType === '100%'}
          onChange={updateStackType}
          value={stackType}
          inputProps={{ 'aria-label': 'controlled' }}
        />
        <Typography variant="body2" component="div">
          Percentage
        </Typography>
      </CardActions>

    </div>
  );
}

export default BarChart;
