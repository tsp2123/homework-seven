import * as d3 from 'd3'

// Create your margins and height/width
var margin = { top: 40, left: 40, right: 0, bottom: 40 }

var height = 300 - margin.top - margin.bottom
var width = 200 - margin.left - margin.right
// I'll give you this part!
var container = d3.select('#chart-3')

// Create your scales
var xPositionScale = d3
  .scaleLinear()
  .domain([1980, 2010]) // dates in csv
  .range([0, width])
var yPositionScale = d3
  .scaleLinear()
  .domain([0, 20000]) // max money
  .range([height, 0])
// Create your line generator
var line = d3
  .line()
  .x(d => xPositionScale(d.year))
  .y(d => yPositionScale(d.income))
// Read in your data
Promise.all([
  d3.csv(require('./middle-class-income.csv')),
  d3.csv(require('./middle-class-income-usa.csv'))
]).then(ready)


// Create your ready function
function ready(datapoints) {
  // Group based on country names
  let datapointsWorld = datapoints[0]
  let datapointsUSA = datapoints[1]

  var nested = d3
    .nest()
    .key(d => d.country)
    .entries(datapointsWorld)
  
  container
  	.selectAll('.middleIncome')
  	.data(nested)
  	.enter()
  	.append('svg')
  	.attr('class', 'middleIncome')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)
    .each(function(d) {
      var svg = d3.select(this)
      var datapoints = d.values
// first line for dataPointsWorld
   svg
     .append('path')
     .datum(datapoints)
     .attr('d', line)
     .attr('stroke-width', 2)
     .attr('stroke', '#77314d')
     .attr('fill', 'none')


    svg
      .append('path')
      .datum(datapointsUSA)
      .attr('d', line)
      .attr('stroke-width', 2)
      .attr('stroke', '#808080')
      .attr('fill', 'none')

// add axis labels

      var xAxis = d3
        .axisBottom(xPositionScale)
        .tickSize(-height)
        .tickFormat(d3.format('d'))

      svg
        .append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', `translate(0,${height})`)
        .call(xAxis.tickValues([1980, 1990, 2000, 2010]))

      var yAxis = d3
        .axisLeft(yPositionScale)
        .tickFormat(d3.format('$,d'))
        .tickSize(-width)

      svg
        .append('g')
        .attr('class', 'axis y-axis')
        .call(yAxis.tickValues([5000, 10000, 15000, 20000]))



      svg
        .append('text')
        .text('USA')
        .attr('x', xPositionScale(1989))
        .attr('y', yPositionScale(16500))
        .attr('fill', '#808080')
        .attr('font-size', 11)
        .attr('text-anchor', 'middle')
        .attr('dy', -10)

       svg
        .append('text')
        .text(d.key)
        .attr('x',width / 2)
        .attr('y', yPositionScale(10200))
        .attr('fill', '#77314d')
        .attr('font-size', 10)
        .attr('font-weight', 'bold')
        .attr('text-anchor', 'middle')
        .attr('dy', -10)   

    })

}
