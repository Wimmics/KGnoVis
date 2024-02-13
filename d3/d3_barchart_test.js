import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm"

const datatest = [
    {group : "Wolf", Clouds : 10, Flower : 10, Snow : 10, Wind : 10, Moon : 10},
    {group : "Eagle", Clouds : 8, Flower : 20, Snow : 8, Wind : 30, Moon : 16},
    {group : "Deer", Clouds : 12, Flower : 15, Snow : 40, Wind : 10, Moon : 24},
    {group : "Lion", Clouds : 7, Flower : 25, Snow : 4, Wind : 12, Moon : 8},
    {group : "Dragon", Clouds : 9, Flower : 30, Snow : 5, Wind : 18, Moon : 17}   
]

const colors = ["crimson", "steelblue", "gray", "gold", "green"]

const item = d3.stack().keys(["Clouds", "Flower", "Snow", "Wind", "Moon"])(datatest)

// Set up the dimensions and margins for the chart
const width = 380
const height = 380
const margin = {top: 5, right: 5, bottom: 5, left: 5}

// Create the SVG element
const svg = d3.select("#test")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`)

// Set up the x scale
const x_scale = d3.scaleBand()
  .domain(datatest.map(d => d.group))
  .range([0, width])
  .padding(0.1);

// Set up the y scale
const y_scale = d3.scaleLinear()
  .domain([0, d3.max(datatest, d => d.Clouds + d.Flower + d.Snow + d.Wind + d.Moon)])
  .range([height, 0]);

// Create the stacked chart
svg.append("g")
  .selectAll("g")
  .data(item)
  .enter().append("g")
    .attr("fill", (d,i) => colors[i])
  .selectAll("rect")
  .data(d => d)
  .enter().append("rect")
    .attr("x", d => x_scale(d.data.group))
    .attr("y", d => y_scale(d[1]))
    .attr("height", d => y_scale(d[0]) - y_scale(d[1]))
    .attr("width", x_scale.bandwidth());

// Add axes
svg.append("g")
  .attr("transform", `translate(0,${height})`)
  .call(d3.axisBottom(x_scale));

svg.append("g")
  .call(d3.axisLeft(y_scale));


/* Somme par label (clouds, flower, etc...)



*/