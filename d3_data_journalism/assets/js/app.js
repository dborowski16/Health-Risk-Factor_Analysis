// @TODO: YOUR CODE HERE!
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