// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 500;

// Define the chart's margins as an object
var margin = {
  top: 60,
  right: 60,
  bottom: 60,
  left: 60
};

// Define dimensions of the chart area
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;


d3.csv("assets/data/data.csv").then(function(newsData) {

    console.log(newsData);
  
    // log a list of states
    var state = newsData.map(data => data.abbr);
    console.log(state);
  
    // Cast each hours value in tvData as a number using the unary + operator
    newsData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.healtcare = +data.healtcare
      console.log("Poverty:", data.poverty);
      console.log("healthCare:", data.healthcare);
    })
});