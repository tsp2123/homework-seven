import * as d3 from 'd3'

// Set up margin/height/width

var margin = { top: 60, left: 60, right: 150, bottom: 40 }

var height = 700 - margin.top - margin.bottom

var width = 700 - margin.left - margin.right

// Add your svg
var svg = d3
  .select('#chart-1')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

// Create a time parser (see hints)

var parser = d3.timeParse('%B-%y')

// Create your scales

var xPositionScale = d3
  .scaleLinear()
  // .domain([0, 2000])
  .range([0, width])

var yPositionScale = d3
  .scaleLinear()
  // .domain([0, 2000])
  .range([height, 0])

var colorScale = d3
  .scaleOrdinal()
  .range([
    '#8dd3c7',
    '#fccde5',
    '#bebada',
    '#fb8072',
    '#80b1d3',
    '#fdb462',
    '#b3de69'
  ])

// Create a d3.line function that uses your scales

var line = d3
  .line()
  .x(d => xPositionScale(d.datetime))
  .y(d => yPositionScale(d.price))

// Read in your housing price data

d3.csv(require('./housing-prices.csv'))
  .then(ready)
  .catch(err => console.log('Failed with', err))

// Write your ready function
function ready(datapoints) {
  console.log('Data is', datapoints)

  datapoints.forEach(function(d) {
    d.datetime = parser(d.month)
  })

  // Get a list of dates and a list of prices
  let month = datapoints.map(d => d.datetime)

  xPositionScale.domain(d3.extent(month))

  let prices = datapoints.map(d => d.price)
  yPositionScale.domain(d3.extent(prices))

  // Group your data together
  var nested = d3
    .nest()
    .key(function(d) {
      return d.region
    })
    .entries(datapoints)
  console.log(nested)
  // Draw your lines
  svg
    .selectAll('.temp-line')
    .data(nested)
    .enter()
    .append('path')
    .attr('class', 'temp-line')
    .attr('d', d => {
      return line(d.values)
    })
    .attr('stroke-width', 2)
    .attr('fill', 'none')
    .attr('stroke', function(d) {
      return colorScale(d.key)
    })

  svg
    .selectAll('.end-circle')
    .data(nested)
    .enter()
    .append('circle')
    .attr('class', 'end-circle')
    .attr('r', 5)
    .attr('cx', width)
    .attr('cy', function(d) {
      return yPositionScale(d.values[0].price)
    })
    .attr('fill', function(d) {
      return colorScale(d.key)
    })

  // Add your text on the right-hand side

  svg
    .selectAll('.region-label')
    .data(nested)
    .enter()
    .append('text')
    .text(d => {
      console.log(d.region)
      return d.values[0].region
    })

    .attr('class', 'region-label')
    .attr('x', width + 5)
    .attr('y', function(d) {
      return yPositionScale(d.values[0].price) + 4
    })

  // Add your title
  svg
    .append('text')
    .text('U.S housing prices fall in winter')
    .attr('x', width - 310)
    .attr('y', height - 640)

  // Add the shaded rectangle

var december_16 = parser('December-16')
var february_17 = parser('February-17')

  svg
    .selectAll('.winter-rect')
    .data(datapoints)
    .enter()
    .append('rect')
    .attr('class', 'winter-rect')
    .attr('width', 10)
    .attr('height', height)
    .attr('fill', '#DCDCDC')
    .attr('y', yPositionScale(d3.max(prices)))
    .attr('x', xPositionScale(december_16))
    .attr('width', xPositionScale(february_17) - xPositionScale(december_16))
    .attr('opacity', .10)
    .lower()


  // Add your axes
  var xAxis = d3.axisBottom(xPositionScale).tickFormat(d3.timeFormat('%b %y'))
  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)

  var yAxis = d3.axisLeft(yPositionScale)
  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)

}

export {xPositionScale, yPositionScale, width, height, colorScale, line, parser}
