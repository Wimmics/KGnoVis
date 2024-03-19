import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm"

function recupererDonnees() {
    var texte = document.getElementById('user_text').value
    return texte
    }

const executeSPARQLRequest = async (endpoint, query) => {
    localStorage.clear()
    const url = `${endpoint}?query=${encodeURIComponent(query)}&format=json`

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

function linkAlreadyExist(link, linksList) {
    for (let l of linksList) {
        if (l.source === link.source && l.target === link.target && l.label === link.label) {
            return true
        } else if (l.source === link.target && l.target === link.source && l.label === link.label) {
            return true
        }
    }
    return false
}

function buildLinks(data, edge) {

    const links = []

    for (const triple of edge) {
        for (const row of data) {
            const s = row[triple.source].value      
            const target = row[triple.target].value
            const label = row[triple.relation].value
            const color = triple.color_link
            //console.log(triple.source)
            const link = {
                source : s,
                target : target,
                label : label,
                color : color
            }

            //console.log(link)

            if (!(linkAlreadyExist(link, links))) {
                links.push(link)
            }
        }
    }
    //console.log(links)
    return links
}

async function nodelink_creator(data, colors = [], strength = -400, width = 400, height = 400, node_named = false, link_named = false) {

    console.log("debut nodelink, dataset", data)
  
    const margin = {top: 5, right: 5, bottom: 5, left: 5}

    if (colors.length != 2) {
        colors = ["red", "steelblue"]
    }

    let svg_graph = d3.select("#nodelink_graph")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")

    const svg_label = d3.select("#labels_nodelink")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")

    const link = svg_graph.selectAll("line")
        .data(data.links)
        .join("line")
        .style("stroke", d => d.color)

    const node = svg_graph.selectAll("circle")
        .data(data.nodes)
        .join("circle")
        .attr("r", 20)
        .style("fill", d => d.color)
        .attr("label", d => d.label)

    let ticksCount = 0
    let nodes_label
    let link_label

    if (node_named === true) {

        nodes_label = svg_label.selectAll("nodes")
            .data(data.nodes)
            .enter().append("text")
            .style("text-align", "center")
            .style("visibility", "hidden")
            .text(d => d.label)

        svg_graph.selectAll("circle").on("mouseover", function(d){
            console.log(d.target.getAttribute("label")) ;  
            let choosen_node
           /* console.log(nodes_label)
            console.log(nodes_label._groups)
            console.log(nodes_label._groups[0])
            console.log("resultat cherché", nodes_label._groups[0][0].__data__.label)
            /*for (let elt in nodes_label._groups) { // Il n'y passe qu'une fois, pour le 0 : à skip
                console.log(elt)
                console.log(elt[0])
                /*if (elt.label === d.target.getAttribute("label")) {
                    choosen_node = elt
                    console.log(choosen_node)
                }
            }*/
            for (let elt in nodes_label._groups[0]) {
                //console.log(elt)
                //console.log(nodes_label._groups[0][elt].__data__.label)
                if (nodes_label._groups[0][elt].__data__.label === d.target.getAttribute("label")) {
                    choosen_node = nodes_label._groups[0][elt]
                    console.log("valeur choisie", choosen_node)
                    var element = document.querySelector('text'); // Sélection de l'élément <text>
                    console.log("elt", element)
                    var valeurTexte = element.textContent; // Récupération de la valeur du texte
                    console.log("val_txt", valeurTexte)
                    //let element = document.getElementById(choosen_node)
                    //console.log(element)
                    //document.getElementById("choosen_node").style.visibility = "visible"
                    
                }
                //console.log(elt[0])
                //console.log(elt[0].__data__)
            }
            //choosen_node.style("visibility", "visible")})
        /*.on("mouseout", function(d){d3.select(this).style("visibility", "hidden")*/})
            
    }

    if (link_named === true) {
        link_label = svg_label.selectAll("liens")
        .data(data.links)
        .enter().append("text")
        .text(d => d.label)
    }

    const simulation = d3.forceSimulation(data.nodes)       
        .force("link", d3.forceLink()                      
            .id(d => d.id)                
            .links(data.links)                                 
        )
        .force("charge", d3.forceManyBody().strength(strength))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .on("end", ticked)
        /*.on("tick", function () {

            ticked()
            ticksCount++; // Incrémenter le compteur de ticks à chaque itération
        
            if (ticksCount >= 50) {
                simulation.stop(); // Arrêter la simulation après le nombre spécifié de ticks
            }
        })
    */    
        
    function ticked() {

        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y)

        node
            .attr("cx", d => d.x+6)
            .attr("cy", d => d.y-6)


        if (node_named === true) {
            nodes_label.attr("x", d => d.x).attr("y", d => d.y)
        }
        
        if (link_named === true) {

            link_label.attr("x", d => {

                return (d.source.x + d.target.x) / 2
            })
            
            link_label.attr("y", d => {
                return (d.source.y + d.target.y) / 2
            })
        }
    }  
    
}

export {recupererDonnees, executeSPARQLRequest, recupererEtAfficherTableau, nodelink_creator, nodeAlreadyExist, buildNodes, linkAlreadyExist, buildLinks}