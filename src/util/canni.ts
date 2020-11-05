
// chartjs-node-canvas example
// https://github.com/SeanSobey/ChartjsNodeCanvas#Usage
// https://github.com/SeanSobey/ChartjsNodeCanvas/blob/master/API.md
// https://github.com/Automattic/node-canvas#canvastobuffer
import { CanvasRenderService } from 'chartjs-node-canvas';

const width = 400;
const height = 400;
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


export const makeCanvas = async () => {
  const configuration = {
      type: 'bar',
      data: {
          labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
          datasets: [{
              label: '# of Votes',
              data: [12, 19, 3, 5, 2, 3],
              backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                  'rgba(255,99,132,1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1
          }]
      },
      options: {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero: true,
                      callback: (value: string) => '$' + value
                  }
              }]
          }
      }
  };
  const image = await canvasRenderService.renderToBuffer(configuration);
  const dataUrl = await canvasRenderService.renderToDataURL(configuration);
  const stream = canvasRenderService.renderToStream(configuration);

  //console.log(image);
  //console.log(dataUrl);
  //console.log(stream);
  

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

