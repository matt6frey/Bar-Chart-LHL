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
  var target = $(element); // Element to place the chart in.

  // Errors are found.
  if(!errorCheck || !chartOptions) {
    return;
  }

  chartOptions.render(target, chartOptions.barHeights(data), isStackedData(data), chartOptions); // Create Bar Chart
  //return chartOptions;
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
  this.yLabels = getYLabels(absoluteMax(data));

  // Chart Theme (Controls theme colors: ensures either default classes are used or custom classes are used)
  this.theme = "default";

  // Chart & Bar Dimensions
  this.height = 300;
  this.width = 400;
  this.topBuffer = this.height * 0.05;
  this.barWidth = Math.floor( ( ( this.width / (data.length * 2 ) ) / this.width ) * 100 ) ; // Get total data length and account for space.
  this.spacing = this.barWidth; // Spacing to separate bars.

  this.barHeights = function (data) {
      var dataHeights = []; // Store bar heights
      var height = this.height * 0.95;
      var isStacked = isStackedData(data);
      if(isStacked) {
        var maxValue = absoluteMax(data, true); // Stacked values: Get highest value within data.
      } else {
        var maxValue = absoluteMax(data, false); // Single values: Get highest value within data.
      }
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

  this.dataMax = absoluteMax(data);
  this.dataMin = absoluteMin(data);
  /*this.dataAverage = function () {
    return data.reduce(function (total, pos) { total + pos; } );
  }*/

  this.render = function(target, heights, isStacked, chartOptions) {
    var styleTag = $('<style></style>'); // Create element with jQuery
    // Styling and chart styles to be stored.
    var buffer = this.topBuffer;
    //console.log(buffer);
    $('head').append(styleTag);
    styleTag.append(
      ".chart { max-width: " + this.width + "px; height: " + this.height + "px; }",
      "h2.chartHeader { max-width: " + this.width + "px }",
      ".xAxis { max-width: " + this.width + "px }",
      ".yAxis { max-height: " + this.height + "px }",
      ".xLabels { max-width: " + this.width + "px }",
      ".bar { width: " + this.barWidth + "%; display:inline-block; margin-left: " + this.spacing + "%; margin-top: " + buffer + "px; }",
      "span.label { margin-left: " + Math.floor( this.spacing * 0.75) + "%; }"
    );
    var barHeightClasses = []; // Array to store height classes
    var barElements = []; // Store bar HTML elements
    // Get each bar height, give it a class, and create the HTML element.
    for (var i in heights) {
      if(isStacked) {
        barHeightClasses.push([]);
        for (var x in heights[i]) {
          if(x % 2 === 0) { // bg
            var backgroundColor = "#0042fe";
          } else {
            var backgroundColor = "#009cff";
          }
          styleTag.append(
            '.b' + i + '-' + x + ' { height: ' + heights[i][x] + 'px; display: inline-block ; background-color: ' + backgroundColor + '; }',
            '.b' + i + '-' + x + ' > b.value-center { top:' + ( ( heights[i][x] / 2 ) - 10) + 'px; }'
          );
          barHeightClasses[i].push('b' + i + '-' + x);
        }
      } else {
        styleTag.append(
          '.b' + i + ' { height: ' + heights[i] + 'px; display: inline-block; }',
          '.b' + i + ' > span.valueLabel > b.value-center { top:' + ( ( heights[i] / 2 ) - 10) + 'px; }'
          );
        barHeightClasses.push('b' + i); // Add to array to be used in next step.
      }
    }
    // create bar html elements
    for (var i in barHeightClasses) {
      if (isStacked) { // Stacked Bars
        var bar = $("<div></div>").addClass('bar');
        for (var x in barHeightClasses[i]) { // Create
          var span = $("<span></span>").addClass( barHeightClasses[i][x] + " value-" + this.xValuesPos + " valueLabel" );
          var b = $('<b></b>').addClass( "value-" + this.xValuesPos + " barLabelColor" ).text( this.xValues[i][x] );
          bar.append(span.append(b));
        }
        barElements.push(bar); // Add bar to barElements to be appended to chart.
      } else { // Single Bars
        var bar = $("<div></div>").addClass('bar default ' + barHeightClasses[i] );
        var span = $("<span></span>").addClass( "valueLabel" );
        var b = $('<b></b>').addClass( "value-" + this.xValuesPos + " barLabelColor" ).text( this.xValues[i] );
        bar.append(span.append(b));
        barElements.push(bar); // Add bar to barElements to be appended to chart.
      }
    }

    // Create additional Chart Information
    var chartHeader = $('<h2>' + this.title + '</h2>').addClass('chartHeader');
    var yAxisLabel = $('<div></div>').addClass('yAxis').append('<span>' + this.yAxis + '</span>');
    var chart = $('<div></div>').addClass('chart ' + this.theme);
    // Append Bar Elements
    for (var i in barElements) {
    chart.append(barElements[i]);
    }
    var xAxisLabel = $('<div>' + this.xAxis + '</div>').addClass('xAxis');
    var barXLabels = $('<div></div>').addClass('xLabels');
    for (var i in this.xLabels) {
      barXLabels.append($('<span>' + this.xLabels[i] + '</span>').addClass('label ' + this.theme));
    }
    // Add Default/Custom styles
    // Add styling to new style element in head tag.
    $(target).append(chartHeader, yAxisLabel, chart, barXLabels, xAxisLabel);
    $(target).addClass("target");
    }

}

function shortenNum (x) {
// Returns Larger numbers with the suffix of M (Mil), K (Thousand) or '' (Less than 1000)
  if (x > 1000000) {
    return Math.floor(x / 1000000) + "M"
  }  else if (x > 1000) {
    return Math.floor(x / 1000) + "K"
  } else {
    return x;
  }
}

function getYLabels (maxNum) {
  var yLabels = []; // Store Incrememnts
  // determine how much to decrement
  var decrement = (maxNum > 1000 && maxNum % 10 !== 0) ? Math.floor(maxNum / 20) : (maxNum > 1000 || maxNum % 10 === 0) ? maxNum / 10 : (maxNum > 10 && maxNum < 100) ? 5 : 2;
  var i = maxNum;
  while ( i > 0 ) {
      yLabels.push(i);
      i -= decrement;
  }
  yLabels = yLabels.map( x => shortenNum(x) );
  return yLabels;
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
    if(isDefault && customLabels !== true) {
      for (var i in xLabels) {
        labels.push("b" + i);
      }
    } else {
      for (var i in xLabels) {
        labels.push(xLabels[i]);
      }
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
      if(property.search('xLabels') === 0 && options[property] !== chartOptions[property]) {
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

 console.log("REGULAR: ", drawBarChart([3,6,7,8], {title: "Western Bugdet Hotels", xLabels: ['June', 'July', 'Aug', 'Sept'], xAxis: "Years", yAxis: "Growth %"}, '.bar-chart'));

console.log("REGULAR: ", drawBarChart([[3,4],[6,7],[7,2], [8,5]], {title: "BMO Mutual Fund Projections", xLabels: [2016,2017,2018,2019], xAxis: "Years", yAxis: "Growth %"}, '#bar-chart'));

console.log("REGULAR: ", drawBarChart([[3,4],[6,7],[7,2], [8,5]], {title: "MK Ultra", xLabels: ["Cohort 1","Cohort 2","Cohort 3","Cohort 4"], xAxis: "", yAxis: "Telekinetic Development"}, 'p'));

drawBarChart([4.2,4.6,5.5,6.2], {title: "My Height as I aged.", xLabels: ["11","12","13","14"], xAxis: "Age", yAxis: "Height (Ft)"}, 'p[data-index="2"]');
