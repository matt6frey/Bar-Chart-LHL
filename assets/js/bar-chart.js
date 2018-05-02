// Bar-Chart.js

// 'data' parameter is an array of numbers (data points)
// 'options' parameter is an object that has options pertaining to the chart itelf.
// 'element' parameter determines which element to display the chart in. (Could be 'element' or 'element.class' or element#id)

function drawBarChart(data, options, element) { // Draw Chart.
  //Error Checks on initial inputs.
  var dataCheck = data.map( x => typeof x );
  var errorCheck = checkErrors(
    [
      [jQuery.type(data) === 'array', 'array', data],
      [(jQuery.type(options) === 'object' || options === ''), 'object', options],
      [jQuery.type(element) === 'string', 'string', element]
    ],
    dataCheck
  );
  // Get Default Chart settings or Create Custom Chart settings
  var chartOptions = (options === '') ? new Options(data) : setOptions(data, options);

  // Errors are found.
  if(!errorCheck || !chartOptions) {
    return;
  }

  var target = $(element); // Element to place the chart in.
  //console.log(chartOptions);
  console.log(chartOptions.barHeights(data));
  return chartOptions;
}

function checkErrors(errorCheck, dataCheck) {
  //If Errors exist, report them.
  for (var i in errorCheck) {
    if(errorCheck[i][0] === false) {
      var param = Number(i)+1;
      console.log("Error: Parameter " + param + " expects a " + errorCheck[i][1] + ", instead a " + jQuery.type(errorCheck[i][2]) + " was given.");
      return false;
    }
  }
  // Check the data array for unwanted data types.
  if(dataCheck.includes('string') || dataCheck.includes('function') || dataCheck.includes('boolean') ) {
    console.log("Error: Parameter 1 only accepts an array that contains numerical values.");
    return false;
  }
  // All Parameters are good. Rock on!
  return true;
}

function Options (data) {
// Get Default options for Charts.
// Note: Object Constructor Function

  // Chart Titles & Labels
  this.title = 'Chart';
  this.xAxis = 'X Axis';
  this.xLabels = getXLabels(data, data.length, false); // An array of names for each bar on the chart.
  this.xValues = data;
  this.xValuesPos = 'center'; // Center: Default. Accepts Top or Bottom as well.
  this.yAxis = 'Y Axis';

  // Chart Theme (Controls theme colors: ensures either default classes are used or custom classes are used)
  this.theme = "default";

  // Chart & Bar Dimensions
  this.usePercent =
  this.padding = 16;
  this.height = 300;
  this.width = 400;
  this.barWidth = Math.floor( this.width / (data.length * 2) ); // Get total data length and account for space.
  this.spacing = this.barWidth; // Spacing to separate bars.

  this.barHeights = function (data) { // Need to fix this part. Returns undefined and does nothing...
      var dataHeights = []; // Store bar heights
      var height = this.height * 0.95;
      //var maxValue = absoluteMax(data); // Check for stacked values or single values, and Get highest value within data.
      var isStacked = isStackedData(data);
      if(isStacked) {
        var maxValue = absoluteMax(data, true); // Stacked values: Get highest value within data.
      } else {
        var maxValue = absoluteMax(data, false); // Single values: Get highest value within data.
      }
      console.log("MaxValue: " + maxValue);

      for (var i in data) {
        if(isStacked) {
          // Enter second layer of Array
          dataHeights.push([]);
          for (var x in data[i]) {
            var sum = data[i].reduce(getSum); // Get Sum for array.
            var totalBarHeight = height * (sum / maxValue); // Total Bar height
            // Divide by the sum of the array, so that the values will equal the proper height when stacked.
            dataHeights[i].push( Math.floor( totalBarHeight * ( data[i][x] / sum ) ) );
          }
        } else {
          dataHeights.push( Math.floor( height * ( data[i] / maxValue ) ) ); // Add height to dataHeights array total.
        }
      }
      return dataHeights;
    };

  /*this.dataMax = absoluteMax(data);
  this.dataMin = absoluteMin(data);
  this.dataAverage = function () {
    return data.reduce(function (total, pos) { total + pos; } );
  }*/

}

function getXLabels(xLabels, length, customLabels) {
  // Will Set the bar labels

  var labels = [];
  if(xLabels.length !== length) { // Error: Values don't match.
    if(xLabels.length > length) { // Too many
      console.log("There are too many labels for each bar on the chart.", "Labels: " + xLabels.length, "Bars: " + length);
    } else { // Too little.
      console.log("There aren't enough labels for each bar on the chart.", "Labels: " + xLabels.length, "Bars: " + length);
    }
    return false;
  } else {
    var isDefault = xLabels.map( x => typeof x ).includes('number');
    if(isDefault) {
      for (var i in xLabels) {
        labels.push("b" + i);
      }
    } else {
      labels.push(xLabels[i]);
    }
  }
  return labels;
}

function setOptions (data, options) {
  // Set User options for Charts.
  var chartOptions = new Options(data);
  var acceptableProperties = []; // Ensure properties that are being customized exist.
  for (var i in chartOptions) {
    acceptableProperties.push(i); // Add property name to list.
  }
  for (var property in options) {
    if(acceptableProperties.includes(property)) {
      if(property === 'xLabels') {
        chartOptions[property] = getXLabels(options[property], data.length, true); // Create new Labels
      } else {
        chartOptions[property] = options[property];
      }
    } else {
      console.log("Error: " + property + " is an invalid option.\r\n");
      return false;
    }
  }

  return chartOptions;
  //(window.innerWidth * 0.8) + defaults.padding; // 80% of browser element width.
}


function isStackedData(data) {
  var max = data.map( x => jQuery.type(x) === 'array'); // Determines if an array is present in data.
  var stackedData = []; // Store array checks to ensure if data is all stacked or all single.
  for (var i in max) {
    if(max[i] === true) {
      stackedData.push(max[i]);
    }
  }
  // Assess data and return appropriate value.
  if(stackedData.length === max.length) { // Is a stacked data set.
    return true;
  } else if (stackedData.includes(true) && stackedData.includes(false)) { // Error: Data is mixed with stacked and single values.
    console.log("Error: The data has mixed values. Must either be single values or stacked values.");
  } else { // Data contains single values
    return false;
  }
}

function getSum (accumulator, current) { // Calculates Sum of array values.
  return accumulator + current;
}

function absoluteMax(data, isStacked) {
  var maxCollection = [];

  if(isStacked) {
    for (var i in data) {
      var sum = data[i].reduce(getSum); // Get Sum of array values
      maxCollection.push(sum);
    }
    return Math.max(...maxCollection); // Return highest out of all numbers.
  }
  return Math.max(...data); // If there are no arrays, return the max.
}

function absoluteMin(data) {
  // (data === [1,2,3] || data === [[1,2,3], 2, [1,2,3]]) ?
  // If data contains arrays, check all arrays and find the min within them, then compare the absolute highest and return it.
  var minCollection = [];
  var min = data.map( x => jQuery.type(x) === 'array').includes(true); // Determines if an array is present in data.
  if(min) {
    for (var i in data) {
      if(Array.isArray(data[i])) {
        minCollection.push(Math.min(...data[i]));
      } else {
        minCollection.push(data[i]);
      }
    }
    return Math.min(...minCollection); // Return highest out of all numbers.
  }
  return Math.max(...data); // If there are no arrays, return the max.
}



/*console.log(drawBarChart([1,2,3], {"name":"object"}, function() {}));
console.log(drawBarChart('data', {"name":"object"}, 'body'));
console.log(drawBarChart([1,2,3], 'options', 'element'));
console.log(drawBarChart([1,2,3], {"name":"object"}, 'element'));
console.log(drawBarChart([2,3], '', 'element'));
console.log(drawBarChart([2,3,4,5,6,7,8,9], '', 'element'));
*/
console.log("REGULAR: ", drawBarChart([3,6,7,8], '', 'element'));
console.log("CUSTOM OPTIONS: ", drawBarChart([[3,6], [1,2,3], [7,8]], {width:500, height:400, padding: 32, xLabels: ['May', 'June', 'July']}, 'element')); // Test setOptions

