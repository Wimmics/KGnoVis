import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm"

const dataset = {
  nodes: [
    {"id": 1, "name": "A"},
    {"id": 2, "name": "B"},
    {"id": 3, "name": "C"},
    {"id": 4, "name": "D"},
    {"id": 5, "name": "E"},
    {"id": 6, "name": "F"},
    {"id": 7, "name": "G"},
    {"id": 8, "name": "H"},
    {"id": 9, "name": "I"},
    {"id": 10, "name": "J"}
  ],
  links: [
    {"source": 1, "target": 2},
    {"source": 1, "target": 5},
    {"source": 1, "target": 6},
    {"source": 2, "target": 3},
    {"source": 2,"target": 7},
    {"source": 3, "target": 4},
    {"source": 8, "target": 3},
    {"source": 4, "target": 5},
    {"source": 4, "target": 9},
    {"source": 5, "target": 10}
  ]
}


const margin = {top: 10, right: 10, bottom: 10, left: 10}
const width = 400 - margin.left - margin.right
const height = 350 - margin.top - margin.bottom

// append the svg object to the body of the page
const svg = d3.select("#d3_demo2")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`)

function test_node_link(data) {

  // Initialize the links
  const link = svg
    .selectAll("line")
    .data(data.links)
    .join("line")
      .style("stroke", "#aaa")

  // Initialize the nodes
  const node = svg
    .selectAll("circle")
    .data(data.nodes)
    .join("circle")
      .attr("r", 20)
      .style("fill", "#69b3a2")

  // Let's list the force we wanna apply on the network
  const simulation = d3.forceSimulation(data.nodes)                 // Force algorithm is applied to data.nodes
      .force("link", d3.forceLink()                               // This force provides links between nodes
            .id(function(d) { return d.id; })                     // This provide  the id of a node
            .links(data.links)                                    // and this the list of links
      )
      .force("charge", d3.forceManyBody().strength(-200))         // This adds repulsion between nodes. Play with the -400 for the repulsion strength
      .force("center", d3.forceCenter(width / 2, height / 2))     // This force attracts nodes to the center of the svg area
      .on("end", ticked)

  // This function is run at each iteration of the force algorithm, updating the nodes position.
  function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; })

    node
         .attr("cx", function (d) { return d.x+6; })
         .attr("cy", function(d) { return d.y-6; })
  }

}

test_node_link(dataset)