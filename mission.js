import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm"

function recupererDonnees() {
    var texte = document.getElementById('user_text').value
    return texte
    }

function remplirTableau() {

    var tableau = document.getElementById('test')

    while (tableau.rows.length > 0) {
        tableau.deleteRow(0)
    }

    var donnees = [
        ["Donnée 1", "Donnée 2", "Donnée 3", "Donnée 4", "Donnée 5"],
        ["Donnée 6", "Donnée 7", "Donnée 8", "Donnée 9", "Donnée 10"],
        ["Donnée 11", "Donnée 12", "Donnée 13", "Donnée 14", "Donnée 15"],
        ["Donnée 16", "Donnée 17", "Donnée 18", "Donnée 19", "Donnée 20"],
        ["Donnée 21", "Donnée 22", "Donnée 23", "Donnée 24", "Donnée 25"]
    ]
    
    for (var i = 0; i < donnees.length; i++) {
            var ligne = tableau.insertRow(i)
        for (var j = 0; j < donnees[i].length; j++) {
            var cellule = ligne.insertCell(j)
            cellule.innerHTML = donnees[i][j]
        }
    }
}

const executeSPARQLRequest = async (endpoint, query) => {
    localStorage.clear()
    const url = `${endpoint}?query=${encodeURIComponent(query)}&format=json`;

    let result_data = await fetch(url, {
        mode: 'cors',
        headers: {
            'Content-Type': 'text/plain',
            'Accept': "application/sparql-results+json"
        }
    })
    //console.log(JSON.stringify(await result_data.text()))
    return await result_data.json()
}

const query_select = `SELECT DISTINCT ?endpoint ?sparqlNorm (COUNT(DISTINCT ?activity) AS ?count) {
    GRAPH ?g {
    { ?curated <http://www.w3.org/ns/sparql-service-description#endpoint> ?endpoint . }
    UNION { ?curated <http://rdfs.org/ns/void#sparqlEndpoint> ?endpoint . }
    UNION { ?curated <http://www.w3.org/ns/dcat#endpointURL> ?endpoint . }
    ?metadata <http://ns.inria.fr/kg/index#curated> ?curated, ?dataset .
        { ?dataset <http://www.w3.org/ns/prov#wasGeneratedBy> ?activity . }
        UNION { ?metadata <http://www.w3.org/ns/prov#wasGeneratedBy> ?activity .}
        FILTER(CONTAINS(str(?activity), ?sparqlNorm))
        VALUES ?sparqlNorm { "SPARQL10" "SPARQL11" }
    }
    }
    GROUP BY ?endpoint ?sparqlNorm
    ORDER BY ?endpoint ?sparqlNorm`

const query_construct = `CONSTRUCT{ ?endpoint rdf:value ?sparqlNorm } {
    GRAPH ?g {
    { ?curated <http://www.w3.org/ns/sparql-service-description#endpoint> ?endpoint . }
    UNION { ?curated <http://rdfs.org/ns/void#sparqlEndpoint> ?endpoint . }
    UNION { ?curated <http://www.w3.org/ns/dcat#endpointURL> ?endpoint . }
    ?metadata <http://ns.inria.fr/kg/index#curated> ?curated, ?dataset .
        { ?dataset <http://www.w3.org/ns/prov#wasGeneratedBy> ?activity . }
        UNION { ?metadata <http://www.w3.org/ns/prov#wasGeneratedBy> ?activity .}
        FILTER(CONTAINS(str(?activity), ?sparqlNorm))
        VALUES ?sparqlNorm { "SPARQL10" "SPARQL11" }
    }
    }
    GROUP BY ?endpoint ?sparqlNorm
    ORDER BY ?endpoint ?sparqlNorm`

function recupererEtAfficherTableau(dataset) {

    console.log(dataset)
    
    let tableauHtml = document.getElementById('result_table')

    while (tableauHtml.rows.length > 0) {
        tableauHtml.deleteRow(0)
    }

    const l1 = dataset.head.vars

    console.log(l1)

    let ligne1 = tableauHtml.insertRow(l1)

    for (const elt of l1) {
        let cellule = ligne1.insertCell(-1)
        cellule.innerHTML = elt
    }
    
    for (const element of dataset.results.bindings) {
        let ligne = tableauHtml.insertRow(-1)

        for (const elt of l1) {
        let cellule = ligne.insertCell(-1)
        cellule.innerHTML = element[elt]["value"]
        } 
    }

}

function displayRDFGraph(rdfGraph) {

    const valeurs = rdfGraph.results.bindings

    console.log(rdfGraph)
    console.log(valeurs)
    // Loop through the RDF data to construct the display in the HTML document
    valeurs.forEach(triple => { // Pas une fonction : à tester
        const subject = triple.s.value
        const predicate = triple.p.value
        const object = triple.o.value

        // Create HTML elements to represent the triple and add them to the document body
        const tripleElement = document.createElement('div')
        tripleElement.textContent = `${subject} ${predicate} ${object}`
        document.body.appendChild(tripleElement)
        console.log(tripleElement)
    })
}

let couleurs = ["gold", "green"]

function nodelink_creator(data, colors = [], strength = -200, width = 1000, height = 1000) {
  
  const donnees = data
  const margin = {top: 5, right: 5, bottom: 5, left: 5}

  if (colors.length != 2) {
    colors = ["red", "steelblue"]
  }

  const svg = d3.select("#nodelink_graph")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")

  const link = svg.selectAll("line")
    .data(donnees.links)
    .join("line")
    .style("stroke", colors[0])

  const node = svg.selectAll("circle")
    .data(donnees.nodes)
    .join("circle")
    .attr("r", 20)
    .style("fill", colors[1])
    
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

export {recupererDonnees, remplirTableau, executeSPARQLRequest, recupererEtAfficherTableau, displayRDFGraph, nodelink_creator}