
// chartjs-node-canvas example
// https://github.com/SeanSobey/ChartjsNodeCanvas#Usage
// https://github.com/SeanSobey/ChartjsNodeCanvas/blob/master/API.md
// https://github.com/Automattic/node-canvas#canvastobuffer
import { CanvasRenderService } from 'chartjs-node-canvas';

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
            boxWidth: 0
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