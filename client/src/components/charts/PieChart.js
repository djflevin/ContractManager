import React, { Component } from 'react';
import Chart from 'react-apexcharts'

const Donut = (props) => {
  const options = {
    chart: {
      type: 'donut',
    },
    labels: props.labels || [],
    responsive: [{
      options: {
        legend: {
          position: 'auto',

        },
      }
    }],
  }

  const series = props.series || []

  return (
    <div id="chart">
      <Chart
        options={options}
        series={series}
        type="donut"
        width={props.width ? props.width : '100%'}
        height={props.height ? props.height : '100%'}
      />
    </div>
  );
}

export default Donut;