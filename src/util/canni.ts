
// chartjs-node-canvas example
// https://github.com/SeanSobey/ChartjsNodeCanvas#Usage
// https://github.com/SeanSobey/ChartjsNodeCanvas/blob/master/API.md
// https://github.com/Automattic/node-canvas#canvastobuffer
import { CanvasRenderService } from 'chartjs-node-canvas';

const width = 250;
const height = 250;
// TODO: give ChartJS the correct type
const chartCallback = (ChartJS: any) => {

    // Global config example: https://www.chartjs.org/docs/latest/configuration/
    ChartJS.defaults.global.elements.rectangle.borderWidth = 2;
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


export const makeCanvasBar = async (title: string, values: Array<number>, labels: Array<string>) => {
  const configuration = {
      type: 'bar',
      data: {
          labels: labels,
          datasets: [{
              label: title,
              data: values,
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
export const makeCanvasLine = async (title: string, values: Array<number>, timestamps: Array<string>) => {    
  const configuration = {
      type: 'line',
      data: {
          labels: timestamps,
          datasets: [{
              label: title,
              data: values,
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




// nico example
// https://github.com/Automattic/node-canvas#loadimage
import { createCanvas } from 'canvas';
export const draw = async () => {
  const canvas = createCanvas(200, 200)
  const ctx = canvas.getContext('2d'); 
  ctx.font = '30px Impact';
  ctx.rotate(0.1);
  ctx.fillText('Awesome!', 50, 100);

  let text = ctx.measureText('Awesome!');
  ctx.strokeStyle = 'rgba(0,0,0,0.5)';
  ctx.beginPath();
  ctx.lineTo(50, 102);
  ctx.lineTo(50 + text.width, 102);
  ctx.stroke();

  // TODO: Make ctx to the correct type
  let dataUrl = canvas.toDataURL(ctx as any)

  return dataUrl;
};

