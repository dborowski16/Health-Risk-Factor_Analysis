// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 500;

// Define the chart's margins as an object
var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 50
};

// Define dimensions of the chart area
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3.select("#scatter")
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
      data.healtcare = +data.healtcare;
      data.obese = +data.obese;
      data.smokes = +data.smokes;
      data.age = +data.ageMoe;
      data.income = +data.incomeMoe;
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

    var yAxis = chartGroup.append("g")
        .classed('y-axis', true)
        .call(leftAxis);

    var xAxis = chartGroup.append("g")
        .classed('x-axis', true)
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);

    var circles = chartGroup.selectAll('.stateCircle')
        .data(newsData)
        .enter()
        .append('circle')
        .attr('cx', d => xLinearScale(d[xAxis]))
        .attr('cy', d => yLinearScale(d[yAxis]))
        .attr('class', 'stateCircle')
        .attr('r', 15)
        .attr('opacity', '0.75');

    // Use the linear and band scales to position each rectangle within the chart
    chartGroup.selectAll(".dot")
        .data(newsData)
        .enter()
        .append("circle")
        .attr("x", d => xLinearScale(d.poverty))
        .attr("y", d => yLinearScale(d.healthcare))


});