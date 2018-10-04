import * as d3 from 'd3'

// Set up margin/height/width
var margin = { top: 40, left: 40, right: 0, bottom: 40 }

var height = 130 - margin.top - margin.bottom
var width = 100 - margin.left - margin.right


// I'll give you the container
var container = d3.select('#chart-2')

// Create your scales
var xPositionScale = d3
  .scaleLinear()
  .domain([15, 50])
  .range([0, width])
var yPositionScale = d3
  .scaleLinear()
  .domain([0, .3])
  .range([height, 0])
// Create a d3.line function that uses your scales
var area = d3
  .area()
  .x(function(d) {
    return xPositionScale(d.Age)
  })
  .y(height)
// Read in your data
d3.csv(require('./fertility.csv'))
  .then(ready)
  .catch(err => {
    console.log(err)
  })
// Build your ready function that draws lines, axes, etc
function ready(datapoints) {
  var nested = d3
    .nest()
    .key(function(d) {
      return d.Year
    })
    .entries(datapoints)

  container
    .selectAll('.small-multiple')
    .data(nested)
    .enter()
    .append('svg')
    .attr('class', 'small-multiple')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .each(function(d) {
      // which svg are we looking at?
      var svg = d3.select(this)

      // this svg only gets one line
      // and we're working with grouped (nested)
      // data, so to get our datapoints we
      // need to do d.values
      area.y1(d => yPositionScale(d.ASFR_us))

      svg
        .append('path')
        .datum(d.values)
        .attr('d', area)
        .attr('fill', '#86fcfd')
        .attr('opacity', 0.6)
      
      area.y1(d => yPositionScale(d.ASFR_jp))
      svg
        .append('path')
        .datum(d.values)
        .attr('d', area)
        .attr('fill', '#ff0000')
        .attr('opacity', 0.6)
        .lower()

      svg
        .append('text')
        .text(d.key)
        .attr('x', width - 20)
        .attr('y', 0)
        .attr('font-size', 12)
        .attr('text-anchor', 'middle')
        .attr('dy', -10)
      
      let datapoints = d.values
      let ASFR_jp = datapoints.map(d => +d.ASFR_jp)
      let ASFR_us = datapoints.map(d => +d.ASFR_us)

      svg
        .append('text')
        .datum(datapoints)
        .text(d3.sum(ASFR_jp).toFixed(2))
        .attr('x', xPositionScale(50))
        .attr('y', yPositionScale(0.2))
        .attr('font-size', 9)
        .attr('fill', '#ff0000')
        .attr('text-anchor', 'end')
        .attr('alignment-baseline', 'hanging')
      svg
        .append('text')
        .datum(datapoints)
        .text(d3.sum(ASFR_us).toFixed(2))
        .attr('x', xPositionScale(50))
        .attr('y', yPositionScale(0.3))
        .attr('font-size', 9)
        .attr('fill', '#86fcfd')
        .attr('text-anchor', 'end')
        .attr('alignment-baseline', 'hanging')



// axis labels
      var xAxis = d3.axisBottom(xPositionScale).tickValues([15, 30, 45])
      svg
        .append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', `translate(0, ${height})`)
        .call(xAxis)    


      var yAxis = d3.axisLeft(yPositionScale).ticks(3)
      svg
        .append('g')
        .attr('class', 'axis y-axis')
        .call(yAxis)

// text labels
      svg
        .append('text')
        .text('USA')
        .attr('x', xPositionScale(1985))
        .attr('y', yPositionScale(16000))
        .attr('fill', '#808080')
        .attr('font-size', 10)
        .attr('text-anchor', 'middle')
        .attr('dy', -10)    


    })


}

