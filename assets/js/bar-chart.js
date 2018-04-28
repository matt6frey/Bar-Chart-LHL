// Bar-Chart.js

// 'data' parameter is an array of numbers (data points)
// 'options' parameter is an object that has options pertaining to the chart itelf.
// 'element' parameter determines which element to display the chart in. (Could be 'element' or 'element.class' or element#id)

function drawBarChart(data, options, element) {
  //Error Checks on initial inputs.
  var errorCheck = [[jQuery.type(data) === 'array', 'array', data], [jQuery.type(options) === 'object', 'object', options], [jQuery.type(element) === 'string', 'string', element]];

  //If Errors exist, report them.
  for (var i in errorCheck) {
    if(errorCheck[i][0] === false) {
      var param = Number(i)+1;
      console.log("Parameter " + param + " expects a " + errorCheck[i][1] + ", instead a " + jQuery.type(errorCheck[i][2]) + " was given.");
      return "false";
    }
  }


}


/*console.log(drawBarChart([1,2,3], {"name":"object"}, function() {}));
console.log(drawBarChart('data', {"name":"object"}, 'body'));
console.log(drawBarChart([1,2,3], 'options', 'element'));
console.log(drawBarChart([1,2,3], {"name":"object"}, 'element'));
*/
