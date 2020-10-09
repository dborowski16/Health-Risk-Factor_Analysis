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

// Select body, append SVG area to it, and set the dimensions
var svg = d3.select("body")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// Append a group to the SVG area and shift ('translate') it to the right and to the bottom
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

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


    var xLinearScale = d3.scaleLinear()
    .range([0, chartWidth])
    .domain(0, d3.extent(newsData, data => data.poverty));

    // Configure a linear scale with a range between the chartHeight and 0
    // Set the domain for the xLinearScale function
    var yLinearScale = d3.scaleLinear()
    .range([chartHeight, 0])
    .domain([0, d3.max(newsData, data => data.healthcare)]);

    // Create two new functions passing the scales in as arguments
    // These will be used to create the chart's axes
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    chartGroup.append("g")
    .call(leftAxis);

    chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);

    // Use the linear and band scales to position each rectangle within the chart
    chartGroup.selectAll(".dot")
        .data(newsData)
        .enter()
        .append("circle")
        .attr("x", d => xLinearScale(d.poverty))
        .attr("y", d => yLinearScale(d.healthcare))


});