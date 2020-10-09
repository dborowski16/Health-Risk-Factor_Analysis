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

    // Cast each hours value in tvData as a number using the unary + operator
    newsData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.healtcare = +data.healthcare;
      data.obese = +data.obese;
      data.smokes = +data.smokes;
      data.age = +data.ageMoe;
      data.income = +data.incomeMoe;
      console.log("Poverty:", data.poverty);
      console.log("healthCare:", data.healthcare);
    });

    // Configure a linear scale with a range between 0 and width
    // Set the domain for the xLinearScale function
    var xScale = d3.scaleLinear()
    .range([0, chartWidth])
    .domain(d3.extent(newsData, d => d.poverty));

    // Configure a linear scale with a range between the chartHeight and 0
    // Set the domain for the yLinearScale function
    var yScale = d3.scaleLinear()
    .range([chartHeight, 0])
    .domain([0, d3.max(newsData, d => d.healthcare)]);

    // Creating new axes
    var bottomAxis = d3.axisBottom(xScale);
    var leftAxis = d3.axisLeft(yScale);

    chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    // Creating circle ids
    var circles = chartGroup.selectAll('circle')
        .data(newsData)
        .enter()
        .append('circle')
        .attr('cx', d => xScale(d.poverty))
        .attr('cy', d => yScale(d.healthcare))
        .attr('r', 15)
        .attr("stroke-width", "1")
        .classed('stateCircle', true)
        .attr('opacity', '0.75');

    // Creating text for each data point
    chartGroup.append('g')
        .selectAll('text')
        .data(newsData)
        .enter()
        .append('text')
        .text(d => d.abbr)
        .attr('cx', d => xScale(d.poverty))
        .attr('cy', d => yScale(d.healthcare))
        .classed('.stateText', true)
        .attr('font-family', 'sans-serif')
        .attr('text-anchor', 'middle')
        .attr('fill', 'white')
        .attr('font-size', '10px')
        .style('font-weight', 'bold')
        .attr('alignment-baseline', 'central');

    chartGroup.append("text")
        .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + margin.top + 13})`)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .attr("fill", "black")
        .style("font-weight", "bold")
        .text("In Poverty (%)");

    chartGroup.append("text")
        .attr("cy", 0 - ((margin.left / 2) + 2))
        .attr("cx", 0 - (chartHeight / 2))
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .attr("fill", "black")
        .style("font-weight", "bold")
        .attr("transform", "rotate(-90)")
        .text("Lacks Healthcare (%)");

});