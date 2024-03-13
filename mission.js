import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm"

function recupererDonnees() {
    var texte = document.getElementById('user_text').value
    return texte
    }
/*
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
*/
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
    
    let tableauHtml = document.getElementById('result_table')

    while (tableauHtml.rows.length > 0) {
        tableauHtml.deleteRow(0)
    }

    const l1 = dataset.head.vars

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
/*
function displayRDFGraph(rdfGraph) {

    const valeurs = rdfGraph.results.bindings

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

// Dataset transformation = datasetgraph.results.bindings

function transformation(dataset) {

    console.log(dataset)
    const donnees = dataset.results.bindings

    let noeuds = []

    for (const ligne of donnees) {
        let presence = false

        for (const known of noeuds) {
            if (noeuds[known] === ligne) {
                presence = true
            }
        
            if (presence === false) {
                noeuds.push(known)
            }
        }
    }

    console.log(noeuds)
}
*/

function nodeAlreadyExist(node, nodesList) {
    for (let n of nodesList) {
        if (n.id === node.id) {
            return true
        }
    }
    return false
}

function buildNodes(data) {

    const nodes = []

    for (const row of data) {
        let node1 = {
            id : row["s"]["value"],
            label : row["s"]["value"]
        }
        if (!(nodeAlreadyExist(node1, nodes))) {
            nodes.push(node1)
        }

        let node2 = {
            id : row["o"]["value"],
            label : row["o"]["value"]
        }
        if (!(nodeAlreadyExist(node2, nodes))) {
            nodes.push(node2)
        }
    }
    
    return nodes

}

async function nodelink_creator(data, colors = [], strength = -400, width = 400, height = 400) {

    console.log(data)
  
    const margin = {top: 5, right: 5, bottom: 5, left: 5}

    if (colors.length != 2) {
        colors = ["red", "steelblue"]
    }

    const svg = d3.select("#nodelink_graph")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")

    const link = svg.selectAll("line")
        .data(data.links)
        .join("line")
        .style("stroke", colors[0])

    const node = svg.selectAll("circle")
        .data(data.nodes)
        .join("circle")
        .attr("r", 20)
        .style("fill", colors[1])

    let ticksCount = 0

    /*let link_label = svg.selectAll("links")
        .data(donnees.links)
        .enter().append("text")
        .text(d => d.relation)
    */

    /*let nodes_label = svg.selectAll("nodes")
        .data(donnees.nodes)
        .enter().append("text")
        .text(d => d.label)
    */

        /*link_label.attr("x", d => (d.source.x + d.target.x) / 2)
            .attr("y", d => (d.source.y + d.target.y) / 2)
        */

        /*nodes_label.attr("x", d => d.x)
            .attr("y", d => d.y)
        */

    

    const simulation = d3.forceSimulation(data.nodes)       
        .force("link", d3.forceLink()                      
            .id(function(d) { return d.id; })                
            .links(data.links)                                 
        )
        .force("charge", d3.forceManyBody().strength(strength))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .on("end", ticked)
        /*
        .on("tick", function () {

            ticked()
            ticksCount++; // Incrémenter le compteur de ticks à chaque itération
        
            if (ticksCount >= 50) {
                simulation.stop(); // Arrêter la simulation après le nombre spécifié de ticks
            }
        })
        */
        
    function ticked() {

        link
            .attr("x1", function(d) {
                
                let bonne_node = []

                for(let elt of data.nodes) {
                    if (elt.id === d.source.value) {
                        bonne_node = elt
                    }
                };
                return bonne_node.x })

            .attr("y1", function(d) {
                
                let bonne_node = []

                for(let elt of data.nodes) {
                    if (elt.id === d.source.value) {
                        bonne_node = elt
                    }
                };
                return bonne_node.y })

            .attr("x2", function(d) {
                
                let bonne_node = []

                for(let elt of data.nodes) {
                    if (elt.id === d.target.value) {
                        bonne_node = elt
                    }
                };
                return bonne_node.x })

            .attr("y2", function(d) {
                
                let bonne_node = []

                for(let elt of data.nodes) {
                    if (elt.id === d.target.value) {
                        bonne_node = elt
                    }
                };
                return bonne_node.y })
    
        node
            .attr("cx", function (d) { return d.x+6; })
            .attr("cy", function(d) { return d.y-6; })

    }

        
}

export {recupererDonnees, executeSPARQLRequest, recupererEtAfficherTableau, nodelink_creator, nodeAlreadyExist, buildNodes}