# Lighthouse Labs : Bar Chart Project

This is a stretch project within the Lighthouse Labs Prep Work. This library that enables developers to create bar charts. By using the *drawBarChart* function, developers can enter easily add a chart to any part of the page. 

##### Screenshots

!['A Default Chart created by the Bar Chart Library'](https://github.com/matt6frey/Bar-Chart-LHL/blob/master/img/default-chart.png "Default Chart")
!['A Custom Chart created by the Bar Chart Library'](https://github.com/matt6frey/Bar-Chart-LHL/blob/master/img/stacked-custom.png "A Stacked Custom Chart")

## Functions

### drawBarChart Function

```javascript
drawBarChart ( data , options , element );
```

This is the main function. It creates the chart. There are other functions within the library but this is the only one required to build a chart.

Larger sets of data can be entered into this function, and it will compute the data, and then truncate it by adding a suffix - either 'M' (million) or 'K' (thousand). If the data is below a million or a thousand, no suffix is append to the value.

This function also has a few error checks to ensure that proper values are being entered into its parameters.

#### Parameters

**data** - takes an array (default chart) or a multi-dimensional array (stacked chart) containing numbers. If a multidimensional array has single values inside it, i.e. `[1,[2,3,4,5],3]`, the function execution will be cancelled and an error will be displayed in the console.

**options** - Expects an object. If an invalid property is given, the function terminates and and error is displayed in the console. Below are all the customizeable options:

 - theme = *string* 

**Chart & Bar Dimensions**
 - height  = *number*
 - width = *number*
 - spacing =  *number*

**Chart Titles & Labels**
 - title = *string* 
 - xAxis = *string*
 - xLabels = *array*
 - xValuesPos = *string* 
 - yAxis = *string* 

**Chart custom options**
 - chartColor = *string* 
 - chartBorder = *string* 

**Title custom options**
 - titleSize = *number* 
 - titleFont = *string* 
 - titleColor = *string* 
 - titleClass = *string* 

**Bar custom options**
 - barColors = *array* 
 - barColorLabels = *string* 

**X Axis custom options**
 - xLabelsColor = *string* 
 - xAxisColor = *string* 
  
**Y Axis custom options**
 - yLabelsColor = *string* 
 - yAxisLabelColor = *string* 

**Note:** Any color value accepts hexcodes, rgba, and rgb values.

**element** - Expects a string. The string is passed to the jQuery selector to target the desired element. 

### Options Function

This is an object constructor function. It's called within the `drawBarChart` function and it's passed the data values to generate all the data required for building the chart.

This function could be called instead of using `drawBarChart`, however the disadvantage in doing this, is the lack of error reporting when initially creating a new Options object.

**Note:** When called, `Options` always creates a default chart. To have your custom options inserted into the object, you should call the `setOptions` function first with your custom object included in the parameters. See the example below:

```javascript
var myChart = setOptions([1,2,3],{ title: "My Chart", height: 500, width: 700, barColors: ["red","blue","yellow"], xAxis: "Choices", yAxis: "Number of Votes" });
```

More on that in the *setOptions* section. 


#### Parameters

**data** - Expects an array or multi-dimensional array containing numbers.

#### Methods

**barHeights** - Requires the data parameter and returns the heights each bar on the chart. See the example below:

```javascript

var data = [1,2,3,4];
var myChart = new Options(data);

console.log(myChart.barHeights(data)); // returns Array [ 71, 142, 213, 285 ]

```

**render** - Requires the *target*, *heights (barHeights)*, and *isStacked* parameters. Then it will generate the chart into the given target [element]. See the example below:

```javascript

var data = [1,2,3,4];
var myChart = new Options(data);

myChart.render($('.myChart'), myChart.barHeights(data), isStackedData(data)); // Creates chart to element that has '.myChart' class.

```

### setOptions

**setOptions** requires the *data* and *options* parameters. When they are supplied, a custom chart will be created. See the example below:

```javascript

var data = [1,2,3,4];
var myChart = setOptions(data, {title: "Cats Owned", xAxis: "Cats", yAxis: "Evil Tendency Level", xLabels: ["Chaz", "Morty", "Max", "Sumoo"] );

myChart.render($('.myChart'), myChart.barHeights(data), isStackedData(data)); // Creates chart to element that has '.myChart' class.

```

The above example builds a chart showing each cat and their *evil tendency levels*.

## Features

At this point, there is only chart generation and customization. The colors, textual content, data values, and chart title can be styled to the developers liking.

## Bugs

 - Y & X axis labels on default or custom charts don't space properly. 
 -- On the **Y axis**, The top most value is in the proper location but the remaining values don't space accordingly. This is due to the container that houses the *Y labels* isn't being positioned as planned.
 -- On the **X Axis**, the *x labels* don't space properly horizontally. I tried using the jQuery method *.position()* and *.offset()* to mitigate the problem but it persisted and I didn't have a great fix for it. 
 - **barColors** seems to work initially when adding custom colors to single or stacked bars, but after a few charts have propagated the page, there is an issue with cycling through the array to change to the next color. 
 - **Targeting reocurring elements within a page** - when you call the `drawBarChart` function and have the *element* parameter that contains an element (i.e. "p") that exists many times throughout the page, multiple charts will be drawn. This is an undesirable result.

 - **Bar Label Data values over 1000** - While the Y label values are converted, the values within the bars were missed. So they need to be adapted to fit the values within the bars using the suffixes.

 - **Charts without names** - When a chart doesn't have a name, the css applied to the chart labels is lost. 


## Features to Come

**Reports** - a feature to provide the developer the ability to implement statistics regarding the data, i.e. mean average, mean, and other types of analysis. 

**Horizontal Chart** - a feature to display the chart horizontally.

**3D Chart** - a feauture that is similar in design to what exists now but has a little more depth add to it to create a 3d effect.

**Animated Charts** - a feature that animates the charts. When the user scrolls to the chart, the hieght values of each bar are animated, or the chart can fade in once scrolled to.

## External Resouces

During this project I used the following resources:

- [MDN Web Docs: JavaScript](https://developer.mozilla.org/bm/docs/Web/JavaScript)
- [MDN Web Docs: jQuery](https://developer.mozilla.org/en-US/docs/Glossary/jQuery)
- [jQuery API](https://developer.mozilla.org/en-US/docs/Glossary/jQuery)
- [W3schools](https://www.w3schools.com/)


