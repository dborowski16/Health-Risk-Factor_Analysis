function makeResponsive() {

    // If SVG Area is not Empty When Browser Loads, Remove & Replace with a Resized Version of Chart
    var svgArea = d3.select("body").select("svg");

    // Clear SVG is Not Empty
    if (!svgArea.empty()) {
        svgArea.remove();
    }

    // Define SVG area dimensions
    var svgWidth = 960;
    var svgHeight = 600;

    // Define the chart's margins as an object
    var margin = {
    top: 10,
    right: 40,
    bottom: 90,
    left: 100
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

    // Initial Axis Parameters
    var chosenXaxis = 'poverty';
    var chosenYaxis = 'healthcare';

    // Updating X-axis upon click on axis label
    function xScale(newsData, chosenXaxis) {
        var xLinearScale = d3.scaleLinear()
        .domain(d3.extent(newsData, d => d[chosenXaxis]))
        .range([0,chartWidth]);
        return xLinearScale;
    }

    // Function used for updating xAxis var upon click on axis label.
    function renderXAxes(newXScale, xAxis) {
        var bottomAxis = d3.axisBottom(newXScale);
        xAxis.transition()
            .duration(1000)
            .call(bottomAxis);
        return xAxis;
    }

    // Updating Y-axis upon click from axis label
    function yScale(newsData, chosenYaxis) {
        var yLinearScale = d3.scaleLinear()
        .domain(d3.extent(newsData, d => d[chosenYaxis]))
        .range([chartHeight, 0]);
        return yLinearScale;
    }

    // Function used for updating yAxis var upon click on axis label.
    function renderYAxes(newYScale, yAxis) {
        var leftAxis = d3.axisLeft(newYScale);
        yAxis.transition()
            .duration(1000)
            .call(leftAxis);
        return yAxis;
    }

    // Making circle markers
    function makeCircles(circlesGroup, newXScale, chosenXaxis, newYScale, chosenYaxis) {
        circlesGroup.transition()
            .duration(1000)
            .attr('cx', d => newXScale(d[chosenXaxis]))
            .attr('cy', d => newYScale(d[chosenYaxis]))
        return circlesGroup;
    }

    function newText(textGroup, newXScale, chosenXaxis, newYScale, chosenYaxis) {
        textGroup.transition()
            .duration(1000)
            .attr('x', d => newXScale(d[chosenXaxis]))
            .attr('y', d => newYScale(d[chosenYaxis]))
        return textGroup;
    }

    // update circles group with new tooltip
    function updateToolTip(circlesGroup, textGroup, chosenXAxis, chosenYAxis) {
    
        if (chosenXAxis === 'poverty') {
            var xlabel = 'In Poverty (%): ';
            }
        else if (chosenXAxis === 'age') {
            var xlabel = 'Age (Median): ';
            }
        else {
            var xlabel = 'Household Income (Median): $';
            };  

        if (chosenYAxis === 'healthcare') {
            var ylabel = 'Lacks Healthcare (%): ';
            }
        else if (chosenXAxis === 'obesity') {
            var ylabel = 'Obese (%): ';
            }
        else {
            var ylabel = 'Smokes (%): ';
            }
            
        // Initialize tool tip
        var toolTip = d3.tip()
            .attr("class", "tooltip d3-tip")
            .offset([80, -60])
            .html(d => {
                return (`${d.state} (${d.abbr})<br>${ylabel}${d[chosenYAxis]}<br>${xlabel}${d[chosenXAxis]}`);
            });
    
        // circlesGroup.call(toolTip);

        circlesGroup.on('mouseover', (data) => {
                toolTip.show(data, this);
            })
            .on('mouseout', function(data, index) {
                toolTip.hide(data, this);
            });
    
        return circlesGroup;
    };

    // Import data from .csv file
    d3.csv("assets/data/data.csv").then(function(newsData) {

        // Cast each hours value in tvData as a number using the unary + operator
        newsData.forEach(function(data) {
            data.poverty = +data.poverty;
            data.healthcare = +data.healthcare;
            data.obese = +data.obese;
            data.smokes = +data.smokes;
            data.age = +data.age;
            data.income = +data.income;
            });

        var xLinearScale = xScale(newsData, chosenXaxis);
        var yLinearScale = yScale(newsData, chosenYaxis);

        // Creating new axes
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);

        var xAxis = chartGroup.append('g')
            .classed('x-axis', true)
            .attr('transform', `translate(0, ${chartHeight})`)
            .call(bottomAxis);

        var yAxis = chartGroup.append('g')
            .classed('y-axis', true)
            .call(leftAxis);

        var circlesGroup = chartGroup.selectAll('circle')
            .data(newsData)
            .enter()
            .append('circle')
            .attr('cx', d => xLinearScale(d[chosenXaxis]))
            .attr('cy', d => yLinearScale(d[chosenYaxis]))
            .attr('r', 15)
            .attr("stroke-width", "1")
            .classed('stateCircle', true)
            .attr('opacity', '0.75');

        // Creating text for each data point
        var textGroup = chartGroup.selectAll('.stateText')
            .data(newsData)
            .enter()
            .append('text')
            .text(d => d.abbr)
            .attr('x', d => xLinearScale(d[chosenXaxis]))
            .attr('y', d => yLinearScale(d[chosenYaxis]))
            .classed('stateText', true)
            .attr('font-size', '10px')
            .attr('alignment-baseline', 'central');

        // Creating a new group for 3 labels
        var xLabelsGroup = chartGroup.append('g')
            .attr('transform', `translate(${chartWidth / 2}, ${chartHeight + 20})`)

        var povertyLabel = xLabelsGroup.append('text')
            .attr('x', 0)
            .attr('y', 15)
            .attr('class', 'axisText')
            .attr('value', 'poverty')
            .text('In Poverty (%)');

        var ageLabel = xLabelsGroup.append('text')
            .attr('x', 0)
            .attr('y', 30)
            .attr('class', 'axisText')
            .attr('value', 'age')
            .text('Age (Median)');

        var houseLabel = xLabelsGroup.append('text')
            .attr('x', 0)
            .attr('y', 45)
            .attr('class', 'axisText')
            .attr('value', 'income')
            .text('Household Income (Median');

        xLabelsGroup.selectAll('text')
            .on('click', function() {
                var value = d3.select(this).attr('value');
                if (value != chosenXaxis) {
                    chosenXaxis = value;

                    console.log(value);

                    xLinearScale = xScale(newsData, chosenXaxis);
                    xAxis = renderXAxes(xLinearScale, xAxis);
                    circlesGroup = makeCircles(circlesGroup, xLinearScale,  chosenXaxis, yLinearScale, chosenYaxis);
                    textGroup = newText(textGroup, xLinearScale, chosenXaxis, yLinearScale, chosenYaxis)
                    circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup);

                if (chosenXAxis === "poverty") {
                    povertyLabel.classed("active", true).classed("inactive", false);
                    ageLabel.classed("active", false).classed("inactive", true);
                    houseLabel.classed("active", false).classed("inactive", true);
                } else if (chosenXAxis === "age") {
                    povertyLabel.classed("active", false).classed("inactive", true);
                    ageLabel.classed("active", true).classed("inactive", false);
                    houseLabel.classed("active", false).classed("inactive", true);
                } else {
                    povertyLabel.classed("active", false).classed("inactive", true);
                    ageLabel.classed("active", false).classed("inactive", true);
                    houseLabel.classed("active", true).classed("inactive", false);
                }
                }
            })

        // var circlesGroup = updateToolTip(chosenXaxis, chosenYaxis, circlesGroup, textGroup)
        
        var yLabelsGroup = chartGroup.append('g')
        .attr('transform', 'rotate(-90)')

        var healthLabel = yLabelsGroup.append('text')
            .attr('y', -20 - (margin.left / 3))
            .attr('x', 0 - (chartHeight / 2))
            .attr('value', 'healthcare')
            .attr('dy', '1em')
            .attr('class', 'axisText')
            .text('Lacks Healtcare (%)');

        var smokesLabel = yLabelsGroup.append('text')
            .attr('y', -40 - (margin.left / 3))
            .attr('x', 0 - (chartHeight / 2))
            .attr('value','smokes')
            .attr('dy', '1em')
            .attr('class', 'axisText')
            .text('Smokes (%)');

        var obeseLabel = yLabelsGroup.append('text')
            .attr('y', -60 - (margin.left / 3))
            .attr('x', 0 - (chartHeight / 2))
            .attr('value', 'obesity')
            .attr('dy', '1em')
            .attr('class', 'axisText')
            .text('Obese (%)');

        yLabelsGroup.selectAll('text')
        .on('click', function() {
            var value = d3.select(this).attr('value');
            if (value != chosenYaxis) {
                chosenYaxis = value;
                yLinearScale = yScale(newsData, chosenYaxis);
                yAxis = renderYAxes(yLinearScale, yAxis);
                circlesGroup = makeCircles(circlesGroup, xLinearScale,  chosenXaxis, yLinearScale, chosenYaxis);
                textGroup = newText(textGroup, xLinearScale, chosenXaxis, yLinearScale, chosenYaxis)
                circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup);

                if (chosenYAxis === "healthcare") {
                    healthLabel.classed("active", true).classed("inactive", false);
                    smokesLabel.classed("active", false).classed("inactive", true);
                    obeseLabel.classed("active", false).classed("inactive", true);
                } else if (chosenXAxis === "smokes") {
                    healthLabel.classed("active", false).classed("inactive", true);
                    smokesLabel.classed("active", true).classed("inactive", false);
                    obeseLabel.classed("active", false).classed("inactive", true);
                } else {
                    healthLabel.classed("active", false).classed("inactive", true);
                    smokesLabel.classed("active", false).classed("inactive", true);
                    obeseLabel.classed("active", true).classed("inactive", false);
                }
            }
        });
    });

}

makeResponsive();