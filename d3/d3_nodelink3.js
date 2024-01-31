import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm"

const dataset = {
  "nodes": [
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
  "links": [
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


let recup_data = async() => {
  return await fetch('nodelink-dataset.json')
    .then(response => response.json())
    .then(data =>  data)
    .catch(error => {
      console.error('Une erreur s\'est produite lors du chargement du fichier JSON :', error)
    })
  }

let couleurs = ["green", "red"]

async function autonode(data, colors = [0], strength = -400) {
  
  const donnees = await data()

  const width = 380
  const height = 380
  const margin = {top: 5, right: 5, bottom: 5, left: 5}

  const svg = d3.select("#nodelink_auto")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")

  const link = svg.selectAll("line")
    .data(donnees.links)
    .join("line")
    .style("stroke", "red")

  const node = svg.selectAll("circle")
    .data(donnees.nodes)
    .join("circle")
    .attr("r", 20)
    .style("fill", "steelblue")
    
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

  const simulation = d3.forceSimulation(donnees.nodes)       
    .force("link", d3.forceLink()                      
      .id(function(d) { return d.id; })                
      .links(donnees.links)                                 
    )
    .force("charge", d3.forceManyBody().strength(strength))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .on("end", ticked)
    
}



autonode(recup_data)

















