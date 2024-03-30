import React from 'react';
import Chart from 'react-apexcharts'


class LineChart extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {

      series : [{
        name: 'MSC Computer Science',
        data: [44, 55, 41, 67, 22, 43, 21, 49]
      }, {
        name: 'MSc Data Science',
        data: [13, 23, 20, 8, 13, 27, 33, 12]
      }, {
        name: 'MSc Cyber Security',
        data: [11, 17, 15, 15, 21, 14, 15, 13]
      }],

      options: {
        chart: {
          height: 350,
          type: 'line',
          zoom: {
            enabled: false
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'straight'
        },
        title: {
          text: 'Student Numbers',
          align: 'left'
        },
        grid: {
          row: {
            colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.5
          },
        },
        xaxis: {
          categories: ['2011 Q1', '2011 Q2', '2011 Q3', '2011 Q4', '2012 Q1', '2012 Q2',
            '2012 Q3', '2012 Q4'
          ],
        }
      },
    }
  }

  render() {
    return (
      <div id="chart">
        <Chart
          options={this.state.options} 
          series={this.state.series} 
          type="line"
          width={ this.props.width ? this.props.width : 300 }
          height={ this.props.height ? this.props.height : 300 }
        />
      </div>
    );
  }

}

export default LineChart;



