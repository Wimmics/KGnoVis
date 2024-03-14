import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm"

function recupererDonnees() {
    var texte = document.getElementById('user_text').value
    return texte
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

function nodeAlreadyExist(node, nodesList) {
    for (let n of nodesList) {
        if (n.id === node.id) {
            return true
        }
    }
    return false
}

function buildNodes(data, edge) {

    const nodes = []

    for (let triple of edge) {
        for (let row of data) {

            let node1 = {
                id : row[triple.source]["value"],
                label : row[triple.source]["value"],
                color : triple.color[0],
                col : triple.source
            }
            if (!(nodeAlreadyExist(node1, nodes))) {
                nodes.push(node1)
            }
    
            let node2 = {
                id : row[triple.target]["value"],
                label : row[triple.target]["value"],
                color : triple.color[1],
                col : triple.target
            }
            if (!(nodeAlreadyExist(node2, nodes))) {
                nodes.push(node2)
            }
        }
    }
    return nodes

}

async function nodelink_creator(data, colors = [], strength = -400, width = 400, height = 400, node_named = false, link_named = false) {

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
    let nodes_label
    let link_label

    if (node_named === true) {
        nodes_label = svg.selectAll("nodes")
            .data(data.nodes)
            .enter().append("text")
            .text(d => d.label)
    }

    if (link_named === true) {
        link_label = svg.selectAll("links")
        .data(data.links)
        .enter().append("text")
        .text(d => d.relation)
    }

    const simulation = d3.forceSimulation(data.nodes)       
        .force("link", d3.forceLink()                      
            .id(function(d) { return d.id; })                
            .links(data.links)                                 
        )
        .force("charge", d3.forceManyBody().strength(strength))
        .force("center", d3.forceCenter(width / 2, height / 2))
        //.on("end", ticked)
        .on("tick", function () {

            ticked()
            ticksCount++; // Incrémenter le compteur de ticks à chaque itération
        
            if (ticksCount >= 50) {
                simulation.stop(); // Arrêter la simulation après le nombre spécifié de ticks
            }
        })
        
        
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


        if (node_named === true) {
            nodes_label.attr("x", d => d.x)
            .attr("y", d => d.y)
        }
        
        if (link_named === true) {

            link_label.attr("x", d => {

                let node_source
                let node_target

                for(let elt of data.nodes) {
                    if (elt.id === d.source.value) {
                        node_source = elt
                    }
                }

                for(let elt of data.nodes) {
                    if (elt.id === d.target.value) {
                        node_target = elt
                    }
                }

                return (node_source.x + node_target.x) / 2
            })
            
            link_label.attr("y", d => {

                let node_source
                let node_target

                for(let elt of data.nodes) {
                    if (elt.id === d.source.value) {
                        node_source = elt
                    }
                }

                for(let elt of data.nodes) {
                    if (elt.id === d.target.value) {
                        node_target = elt
                    }
                }

                return (node_source.y + node_target.y) / 2
            })
        }
    }  
}

export {recupererDonnees, executeSPARQLRequest, recupererEtAfficherTableau, nodelink_creator, nodeAlreadyExist, buildNodes}