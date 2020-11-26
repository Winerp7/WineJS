
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

export const testGraph = async () => {
  const configuration =  {
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
                'rgba(255, 99, 132, 1)',
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
            y: {
                beginAtZero: true
            }
        }
    }
  };

  const dataUrl = await canvasRenderService.renderToDataURL(configuration);
  const image = await canvasRenderService.renderToBuffer(configuration);
  console.log(image);

  return dataUrl;
  
}




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
            fontFamily: 'Arial'
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