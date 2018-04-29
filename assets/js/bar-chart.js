// Bar-Chart.js

// 'data' parameter is an array of numbers (data points)
// 'options' parameter is an object that has options pertaining to the chart itelf.
// 'element' parameter determines which element to display the chart in. (Could be 'element' or 'element.class' or element#id)

function drawBarChart(data, options, element) { // Draw Chart.
  //Error Checks on initial inputs.
  var dataCheck = data.map( x => typeof x );
  var errorCheck = checkErrors([[jQuery.type(data) === 'array', 'array', data], [(jQuery.type(options) === 'object' || options === ''), 'object', options], [jQuery.type(element) === 'string', 'string', element]], dataCheck);
  // Errors are found.
  if(!errorCheck) {
    return;
  }
  var chartOptions = (options === '') ? new getOptions(data) : setOptions(data, options);

  console.log(chartOptions);
  return 'Complete';
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

function getOptions (data) {
// Get Default options for Charts.
// Note: Object Constructor Function

    // Bar Titles
    this.title = 'Chart';
    this.xAxis = 'X Axis';
    this.yAxis = 'Y Axis';

    // Color Schemes
    this.barColor = "#429ef4";
    this.barLabelColor = '#fff';
    this.labelColor = "#666";
    this.axisColor = "#000";
    this.chartBGColor = "#fff";

    // Chart & Bar Dimensions
    this.padding = 16;
    this.height = 300;
    this.width = (window.innerWidth * 0.8) + this.padding; // 80% of browser element width.
    this.barWidth = Math.floor( this.width / (data.length * 2) ); // Get total data length and account for space.
    this.spacing = this.barWidth; // Spacing to separate bars.

    // Functions
    this.barHeights = function (data) {
      var dataHeights = [];
      for (var i in data) {
        if(Array.isArray(data[i])) {
          // Enter second layer of Array
          for (var x in data[i]) {
            dataHeights[i].push(Math.floor(this.height * ( this.height / data[i][x] ) ) ); // Add dataHeights array total.
          }
        } else {
          dataHeights.push(Math.floor( this.height ( this.height / data[i] ) ) ); // Add height to dataHeights array total.
        }
      }
      console.log(dataHeights);
      return dataHeights;
    }

}

function setOptions (data, options) {
  // Set User options for Charts.
  var defaults = new getOptions(data);


}


/*console.log(drawBarChart([1,2,3], {"name":"object"}, function() {}));
console.log(drawBarChart('data', {"name":"object"}, 'body'));
console.log(drawBarChart([1,2,3], 'options', 'element'));
console.log(drawBarChart([1,2,3], {"name":"object"}, 'element'));
*/
// console.log(drawBarChart(['a',2,3], {"name":"object"}, 'element'));
console.log(drawBarChart([2,3], '', 'element'));
console.log(drawBarChart([2,3,4,5,6,7,8,9], '', 'element'));
console.log(drawBarChart([2,3,6,7,8], '', 'element'));
