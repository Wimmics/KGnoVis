import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm"

/*
var data = [2, 4, 8, 10];
    var pie = d3.pie()
    console.log(pie(data))

*/
/*
const width = 450
const height = 450
const margin = 40

// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
const radius = Math.min(width, height) / 2 - margin

// append the svg object to the div called 'my_dataviz'
const svg = d3.select("#d3_demo")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

// Create dummy data
const data = {a: 9, b: 20, c:30, d:8, e:12}

// Compute the position of each group on the pie:
var pie = d3.pie()
  .value(function(d) {return d.value; })

const data_ready = pie(d3.entries(data))

console.log(data_ready)

// Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
svg
  .selectAll('whatever')
  .data(data_ready)
  .enter()
  .append('path')
  .attr('d', d3.arc()
    .innerRadius(0)
    .outerRadius(radius)
  )
  .attr('fill', "steelblue")
  .attr("stroke", "black")
  .style("stroke-width", "2px")
  .style("opacity", 0.7)
*/

var data = [2, 4, 8, 10]
const svg_creator = (donnees) => {

    const width = 300
    const height = 300
    const margin = {left : 5, top : 5, bottom : 5, right : 5}

    const svg = d3.select("#d3_demo").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom)

    const radius = Math.min(width, height) / 2

    const group = svg.append("g").attr("transform", "translate(" + (width + margin.left + margin.right) / 2 + "," + (height + margin.top + margin.bottom) / 2 + ")")

    const color = d3.scaleOrdinal(['#4daf4a','#377eb8','#ff7f00','#984ea3','#e41a1c'])

    // Generate the pie
    const pie = d3.pie()

    console.log(pie(data))

//data
//index
//padAngle
//startAngle
//endAngle
//value

    // Generate the arcs
    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius)

    //Generate groups
    const arcs = group.selectAll("arc")
        .data(pie(data))
        .enter()
        .append("g")
        .attr("class", "arc")

    //Draw arc paths
    arcs.append("path")
        .attr("fill", function(d, i) {
            return color(i)
        })
        .attr("d", arc)

}

svg_creator(data)