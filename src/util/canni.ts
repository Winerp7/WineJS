const co = require('co');
const generate = require('node-chartist');
const width = 500;
const height = 300;

// Chartist examples
// https://github.com/panosoft/node-chartist
// http://gionkunz.github.io/chartist-js/api-documentation.html
// source of yoinked css: https://github.com/dsibilly/chartist-test/blob/master/main.css
export const makeLine = co.wrap(function * (title: string, xValues: Array<string>, yValues: Array<number>) {
  const options = {
    width: width,
    height: height,
    axisX: {
      labelInterpolationFnc: function(value: string, index: number) {
        return index % (xValues.length > 4 ? (Math.ceil(xValues.length / 5)) : 1) === 0 ? value : null;
      }
    },
    chartPadding: {
      bottom: -10
    }
  };

  const line = yield generate('line', options, {
    labels: xValues,
    series: [
      {name: title, value: yValues},
      //{name: 'Series 2', value: [3, 4, 5, 6, 7]}
    ]
  });

  return line;
})
