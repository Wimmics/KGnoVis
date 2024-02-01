import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm"

const data = [
    {date: "2022-01-01", product1: 200, product2: 300, product3: 400},
    {date: "2022-02-01", product1: 250, product2: 350, product3: 450},
    {date: "2022-03-01", product1: 180, product2: 320, product3: 420}
]

const keys = ["product1", "product2", "product3"]; // Les clés des données correspondant à chaque produit

const stackedData = d3.stack()
  .keys(keys)
  .offset(d3.stackOffsetDiverging) // Vous pouvez également utiliser d3.stackOffsetNone, d3.stackOffsetSilhouette, etc.
  .order(d3.stackOrderNone) // Vous pouvez également utiliser d3.stackOrderAscending ou d3.stackOrderDescending
  (data)

//console.log(data)
//console.log(stackedData)

// prend les donnees, les regroupe par produitx (donc un groupe pour chaque clé). Chaque groupe contient ici 3 arrays de 3 éléments.
// Chaque élément correspond à une date (donc on a produit1 j1, produit2 j1, produit3 j1 dans le 1er array).
// A chaque array, on a la même suite d'éléement, mais ça cumule les chiffres à chaque donnée.

// Si je groupe par label, j'obtiendrais

const svg = d3.select("#test")
  .attr("width", 500)
  .attr("height", 300)

const xScale = d3.scaleBand()
  .domain(data.map(d => d.date))
  .range([0, 500])
  .padding(0.1)

const yScale = d3.scaleLinear()
  .domain([0, d3.max(stackedData[stackedData.length - 1], d => d[1])])
  .range([300, 0])

const color = d3.scaleOrdinal()
  .domain(keys)
  .range(d3.schemeCategory10)

svg.selectAll("g")
  .data(stackedData)
  .enter().append("g")
    .attr("fill", d => color(d.key))
  .selectAll("rect")
  .data(d => d)
  .enter().append("rect")
    .attr("x", (d, i) => xScale(data[i].date))
    .attr("y", d => yScale(d[1]))
    .attr("height", d => yScale(d[0]) - yScale(d[1]))
    .attr("width", xScale.bandwidth())