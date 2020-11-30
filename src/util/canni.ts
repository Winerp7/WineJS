
// chartjs-node-canvas example
// https://github.com/SeanSobey/ChartjsNodeCanvas#Usage
// https://github.com/SeanSobey/ChartjsNodeCanvas/blob/master/API.md
// https://github.com/Automattic/node-canvas#canvastobuffer
import { CanvasRenderService } from 'chartjs-node-canvas';
const co = require('co');
const generate = require('node-chartist');

const width = 300;
const height = 300;
// TODO: give ChartJS the correct type
const chartCallback = (ChartJS: any) => {

    // Global config example: https://www.chartjs.org/docs/latest/configuration/
    ChartJS.defaults.global.elements.rectangle.borderWidth = 2;
    ChartJS.defaults.global.defaultFontFamily = "Sans"; // TODO Desperate attempt at making text appear
    // Global plugin example: https://www.chartjs.org/docs/latest/developers/plugins.html
    ChartJS.plugins.register({
        // plugin implementation
    });
    // New chart type example: https://www.chartjs.org/docs/latest/developers/charts.html
    ChartJS.controllers.MyType = ChartJS.DatasetController.extend({
        // chart implementation
    });
};
const canvasRenderService = new CanvasRenderService(width, height, chartCallback);

export const testGraph = async () => {
  // options object
  co(function * () {
    const options = {
      width: 400,
      height: 200,
      axisX: { title: 'X Axis (units)' },
      axisY: { title: 'Y Axis (units)' }
    };
  
    const line = yield generate('line', options, {
      labels: ['a', 'b', 'c', 'd', 'e'],
      series: [
        {name: 'Series 1', value: [1, 2, 3, 4, 5]},
        {name: 'Series 2', value: [3, 4, 5, 6, 7]}
      ]
    });
    return line;
  });
};

export const testGraph2 = async () => {
  // options object
  const options = {width: 400, height: 400};
  const data = {
    labels: ['a','b','c','d','e'],
    series: [
      [1, 2, 3, 4, 5],
      [3, 4, 5, 6, 7]
    ]
  };
  return await generate('line', options, data); //=> chart HTML
};

export const testGraph3 = async () => {
  return await new chartist.Line('.ct-chart', {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    series: [
      [12, 9, 7, 8, 5],
      [2, 1, 3.5, 7, 3],
      [1, 3, 4, 5, 6]
    ]
  }, {
    fullWidth: true,
    chartPadding: {
      right: 40
    }
  });
};

export const makeCanvasBar = async (title: string, xValues: Array<string>, yValues: Array<number>) => {
  const configuration = {
      type: 'bar',
      data: {
          labels: xValues,
          datasets: [{
              label: title,
              data: yValues,
              backgroundColor: 'rgba(93, 188, 210, 0.5)',
              borderColor: 'rgba(93, 188, 210, 1)',
              borderWidth: 1
          }]
      },
      options: {
        legend: {
          labels: {
            boxWidth: 0
          }
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
  };
  //const image = await canvasRenderService.renderToBuffer(configuration);
  const dataUrl = await canvasRenderService.renderToDataURL(configuration);
  //const stream = canvasRenderService.renderToStream(configuration);
  return dataUrl;
};


// https://www.chartjs.org/docs/latest/charts/
export const makeCanvasLine = async (title: string, xValues: Array<string>, yValues: Array<number>) => {    
  const configuration = {
      type: 'line',
      data: {
          labels: xValues,
          datasets: [{
              label: title,
              data: yValues,
              fill: false,
              pointBackgroundColor: 'rgba(93, 188, 210, 1)',
              borderColor: [
                  'rgba(93, 188, 210, 1)',
              ]
          }],
      },
      options: {
        legend: {
          labels: {
            boxWidth: 0,
          }
        }
      }
  };
  const dataUrl = await canvasRenderService.renderToDataURL(configuration);
  return dataUrl;
};

export const makeCanvasDoughnut = async () => {
  const configuration = {
    type: 'doughnut',
    data: {
      datasets: [{
        data: [10, 20, 30, 40],
        backgroundColor: [
          'rgba(255,0,0,1)',
          'rgba(0,255,0,1)',
          'rgba(0,0,255,1)',
          'rgba(255,255,0,1)',
        ],
      }],
      labels: [
        '1st',
        '2nd',
        '3rd',
        '4th',
      ]
    }
  };
  const dataUrl = await canvasRenderService.renderToDataURL(configuration);
  return dataUrl;
};