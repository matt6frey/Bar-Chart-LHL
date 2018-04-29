// Bar-Chart.js

// 'data' parameter is an array of numbers (data points)
// 'options' parameter is an object that has options pertaining to the chart itelf.
// 'element' parameter determines which element to display the chart in. (Could be 'element' or 'element.class' or element#id)

function drawBarChart(data, options, element) { // Draw Chart.
  //Error Checks on initial inputs.
  var errorCheck = [[jQuery.type(data) === 'array', 'array', data], [jQuery.type(options) === 'object', 'object', options], [jQuery.type(element) === 'string', 'string', element]];
  var alphabetRegExp = /[A-Za-z]/;
  //If Errors exist, report them.
  for (var i in errorCheck) {
    if(errorCheck[i][0] === false) {
      var param = Number(i)+1;
      console.log("Error: Parameter " + param + " expects a " + errorCheck[i][1] + ", instead a " + jQuery.type(errorCheck[i][2]) + " was given.");
      return false;
    }
  }
  var dataCheck = data.map( x => typeof x );

  if(dataCheck.includes('string')) {
    console.log("Error: Parameter 1 only accepts an array that contains numerical values.");
    return false;
  }



}

function setOptions (options) {

}


/*console.log(drawBarChart([1,2,3], {"name":"object"}, function() {}));
console.log(drawBarChart('data', {"name":"object"}, 'body'));
console.log(drawBarChart([1,2,3], 'options', 'element'));
console.log(drawBarChart([1,2,3], {"name":"object"}, 'element'));
console.log(drawBarChart(['a',2,3], {"name":"object"}, 'element'));
*/
