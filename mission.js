import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm"
import * as grid from "https://unpkg.com/gridjs?module"

function recupererDonnees() { // Cette fonction me permet de récupérer le texte compris dans le text_area
    var texte = document.getElementById('user_text').value
    return texte
    }

const executeSPARQLRequest = async (endpoint, query) => { // Cette fonction appelle une requête SparQL et l'exécute, et renvoie le dataset de sortie.
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

function recupererEtAfficherTableau(dataset) { // Cette fonction permet de créer un tableau de données à partir d'un dataset donné en entrée

    //console.log(dataset)

    const tableau = new grid.Grid({
        columns : ["source", "label", "target"],
        sort : true,
        pagination : true,
        fixedHeader : true,
        height : "20rem",
        data : dataset.links
    })
    
    tableau.render(document.getElementById('result_table'))

}

function nodeAlreadyExist(node, nodesList) { // Cette fonction récupère une node et une liste et vérifie si la node est déjà comprise dans la liste
    for (let n of nodesList) {
        if (n.id === node.id) {
            return true
        }
    }
    return false
}

function buildNodes(data, edge) { // Cette fonction récupère un dataset et une liste de triplets de colonnes, puis récupère les colonnes sources et target afin de créer des nodes pour chaque valeur unique.

    const nodes = []

    for (let triple of edge) {
        for (let row of data) {

            let node1
            let node2

            try {
                node1 = {
                    id : row[triple.source]["value"],
                    label : row[triple.source]["value"],
                    color : triple.color[0], 
                    col : triple.source,
                    zoom : false
                }
            
                if (!(nodeAlreadyExist(node1, nodes))) {
                    nodes.push(node1)
                }
            } catch(error) {
                console.log("Le dataset ne contient pas les éléments nécessaires pour créer la 1ère node")
            }

            try {
                node2 = {
                    id : row[triple.target]["value"],
                    label : row[triple.target]["value"],
                    color : triple.color[1],
                    col : triple.target,
                    zoom : false
                }
            
                if (!(nodeAlreadyExist(node2, nodes))) {
                    nodes.push(node2)
                }
            } catch(error) {
                console.log("Le dataset ne contient pas les éléments nécessaires pour créer la 2ème node")
            }
        }
    }
    return nodes
}

function linkAlreadyExist(link, linksList) { // Cette fonction récupère un triplet (source, relation, cible) et une liste et vérifie si le triplet (ou le triplet avec source et cible inverse) est déjà comprise dans la liste
    for (let l of linksList) {
        if (l.source === link.source && l.target === link.target && l.label === link.label) {
            return true
        } else if (l.source === link.target && l.target === link.source && l.label === link.label) {
            return true
        }
    }
    return false
}

function buildLinks(data, edge) { // Cette fonction récupère un dataset et une liste de triplets de colonnes, puis récupère les colonnes dans le dataset afin de créer pour chaque triplet de colonnes les lignes associées pour chaque valeur unique.

    const links = []
    let number = 0
    
    for (const triple of edge) {
        for (const row of data) {
            try {
            const source = row[triple.source].value
            const target = row[triple.target].value
            const label = row[triple.relation].value
            const color = triple.color_link


            const link = {
                source : source,
                target : target,
                label : label,
                color : color,
                id : number
            }

            if (!(linkAlreadyExist(link, links))) {
                links.push(link)
            }
            number += 1
            } catch (error) {
                console.log("Le dataset ne contient pas les éléments nécessaires pour créer le lien")
            }
        }
    }
    
    return links
}

function buildLegend(edge) {

    const items = []

    for (const triple of edge) {
/*
        items.push({
            source : triple.source,
            target : triple.target,
            link : triple.relation,
            color : {source : triple.color[0], target : triple.color[1], link : triple.color_link}
        })
*/
        items.push({
            label : "source", value : triple.source, color : triple.color[0]
        })

        items.push({
            label : "target", value : triple.target, color : triple.color[1],
        })

        items.push({
            label : "link", value : triple.relation, color : triple.color_link
        })




    }

    console.log(items)

    return items
}

function nodelink_creator(data, strength = -400, width = 400, height = 400, node_named = false, link_named = false, node_zoom = true, zoom_strenght = 2) { // Cette fonction récupère un dataset et un certain nombre d'options, puis créé le nodelink et ses 

    console.log("debut nodelink, dataset", data)

    const data_used = JSON.parse(JSON.stringify(data))
  
    const margin = {top: 5, right: 5, bottom: 5, left: 5}

    const svg_total = d3.select("#nodelink_graph") // Créé la zone qui contiendra le nodelink
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)

    const width2 = width*0.9
    const height2 = height*0.9

    const svg_graph = svg_total.append("svg")
        .attr("x", width*0.05)
        .attr("y", height*0.05)
        .attr("width", width2)
        .attr("height", height2)    
        .append("g")
        
    const svg_label = d3.select("#labels") // Créé une zone qui contiendra les labels

    const zoom = d3.zoom()
        .scaleExtent([0.1, 10]) // Définir les limites de l'échelle de zoom
        .on('zoom', function(event) {
            svg_graph.attr("transform", event.transform)
        }, {passive : true})

    d3.select("#nodelink_graph").call(zoom,
        d3.zoom()
            //.filter(() => !event.ctrlKey && !event.button) // Permet de forcer l'appuie sur ctrl pour le zoom
            //.touchable() // Permet l'accès au tactile
            .on('zoom', function(event) {
                svg_graph.attr('transform', event.transform)
        }), {passive: true})

    const link = svg_graph.selectAll("line") // Créé les liens qui vont relier les différents noeuds
        .data(data_used.links)
        .join("line")
        .attr("label", d => d.label)
        .attr("id", d => d.id)
        .style("stroke", d => d.color)

    const node = svg_graph.selectAll("circle") // Créé les noeuds
        .data(data_used.nodes)
        .join("circle")
        .attr("r", 20)
        .style("fill", d => d.color)
        .attr("label", d => d.label)
        .attr("id", d => d.label)

    let nodes_label
    let link_label
    let zoomScale = 1

    if (node_zoom === true) { // Cette sous-fonction contrôle le zoom des nodes

        node.on("click", d => {
            const choosen_id = d.target.getAttribute("id")  
            const choosen_node = d3.select('circle[label="' + choosen_id + '"]') // Ces 2 lignes permettent d'obtenir la node cible
            console.log(choosen_node)

            let choosen_x
            let choosen_y

            if (choosen_node._groups[0][0].__data__.label === d.target.getAttribute("label")) { // Cette sous-fonction récupère l'emplacement de la node
                choosen_x = choosen_node._groups[0][0].__data__.x
                choosen_y = choosen_node._groups[0][0].__data__.y
            }

            if (choosen_node._groups[0][0].__data__.zoom === false) { // Permet de zoomer
                zoomScale = zoom_strenght // Puissance de zoom choisie par l'utilisateur
                choosen_node.transition().attr("transform", `translate(${choosen_x}, ${choosen_y}) scale(${zoomScale}) translate(${-choosen_x}, ${-choosen_y})`)
                //scale => remplace toutes les transformations précédentes, y compris l'assignation, et du coup supprime la position
                
                choosen_node._groups[0][0].__data__.zoom = true

            } else { // Permet de dézoomer
                zoomScale = 1 // Remet le zoom à 1
                choosen_node.transition().attr("transform", `translate(${choosen_x}, ${choosen_y}) scale(${zoomScale}) translate(${-choosen_x}, ${-choosen_y})`)
                choosen_node._groups[0][0].__data__.zoom = false
            }

            // Le double déplacement est nécessaire pour conserver le noeud au même point, sans cela il se téléporte au loin

        }, {passive : true})

    }

    if (node_named === true) {

        nodes_label = svg_label.selectAll("nodes") // Créé un texte dans le svg des labels, pour chaque node, puis le cache.
            .data(data_used.nodes)
            .enter().append("p")
            .style("text-align", "center")
            .style("display", "none")
            .attr("id", d => d.label)
            .attr("label", d => d.label)
            .text(d => d.label)
            .attr("x", d => 10).attr("y", d => 30)
            

        svg_graph.selectAll("circle") // Sélectionne les différentes nodes lorsque la souris passe sur la node ou la quitte
        .on("mouseover", d => {
            let choosen_node

            for (let elt in nodes_label._groups[0]) { // Sélectionne la node dans le svg label qui possède le même label que celle sélectionnée, puis affiche son texte.
                if (nodes_label._groups[0][elt].__data__.label === d.target.getAttribute("label")) {
                    choosen_node = nodes_label._groups[0][elt]
                    choosen_node.style.display = "inline"  
                    choosen_node.style.fontSize = "24px"            
                }
            }
        })
        .on("mouseout", d => {  // Sélectionne la node dans le svg label qui possède le même label que celle sélectionnée, puis cache son texte.
            let choosen_node
            for (let elt in nodes_label._groups[0]) {
                if (nodes_label._groups[0][elt].__data__.label === d.target.getAttribute("label")) {
                    choosen_node = nodes_label._groups[0][elt]
                    choosen_node.style.display = "none"
                }
            }
            
        })
    }

    if (link_named === true) {
        link_label = svg_label.selectAll("liens") // Créé un texte dans le svg des labels, pour chaque lien, puis le cache.
        .data(data_used.links)
        .enter().append("p")
        .text(d => d.label)
        .attr("label", d => d.label)
        .attr("id", d => d.id)
        .attr("display", "none")
        .style("fontsize", "70px")
        .attr("x", 10).attr("y", 30)
        
        svg_graph.selectAll("line") // Sélectionne les différents liens lorsque la souris passe sur un lien ou le quitte
        .on("mouseover", d => { 
            let choosen_link
        
            for (let elt in link_label._groups[0]) { // Sélectionne le lien dans le svg label qui possède le même label que celui sélectionné, puis affiche son texte.
                if (parseInt(link_label._groups[0][elt].__data__.id) === parseInt(d.target.getAttribute("id"))) {
                    choosen_link = link_label._groups[0][elt]
                    choosen_link.style.visibility = "visible"   
                    choosen_link.style.fontSize = "24px"
                }
            }
        })
        .on("mouseout", d => { 
            let choosen_link       

            for (let elt in link_label._groups[0]) { // Sélectionne le lien dans le svg label qui possède le même label que celui sélectionné, puis affiche son texte.
                if (parseInt(link_label._groups[0][elt].__data__.id) === parseInt(d.target.getAttribute("id"))) { 
                    choosen_link = link_label._groups[0][elt]
                    choosen_link.style.visibility = "hidden"            
                }
            }
        })
    }
/*
    console.log(data)
    console.log(data.legend)
    console.log(data.legend[0].color)*/
    //const legend_colors = Object.values(data.legend[0].color)
    //console.log(legend_colors)

        
    const dots = svg_total.selectAll("legend_dots")
    .data(data.legend)
    .enter().append("circle") //Changer data legend pour être itérable
    .attr("cx", (d, i) => 25 + i*125)
    .attr("cy", 25)
    .attr("r", 20)
    .style("fill", (d, i) => {console.log(d); return d.color})

    console.log(dots)

/*

    const node = svg_graph.selectAll("circle") // Créé les noeuds
        .data(data_used.nodes)
        .join("circle")
        .attr("r", 20)
        .style("fill", d => d.color)
        .attr("label", d => d.label)
        .attr("id", d => d.label)

    svg.selectAll("categories")
        .data(keys).enter()
        .append("text")
        .attr("x", (d,i) => 30 + i*75)
        .attr("y", 15)
        .style("fill", (d, i) => colors[i])
        .text(d => d)
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
*/




    let ticksCount = 0

    // Cette ligne est liée à la partie .on("tick"). Cela permet de montrer l'apparition des nodes, et la vitesse à laquelle elles s'écartent les unes des autres.

    const simulation = d3.forceSimulation(data_used.nodes) // Cette simulation correspond au calcul de positionnement des nodes, et est réalisée par d3.
        .force("link", d3.forceLink()                      
            .id(d => d.id)                
            .links(data_used.links)                                 
        )
        .force("charge", d3.forceManyBody().strength(strength))
        .force("center", d3.forceCenter(width2 / 2, height2 / 2))
        //.on("end", ticked)

        .on("tick", function () {

            ticked()
            ticksCount++; // Incrémenter le compteur de ticks à chaque itération
            //console.log(ticksCount)

            if (ticksCount >= 500) {
                simulation.stop() // Arrêter la simulation après le nombre spécifié de ticks
            }
        })
     
        
    function ticked() { // Cette fonction assigne les nodes et labels au positionnement indiqué par la simulation

        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y)

        node
            .attr("cx", d => d.x+6)
            .attr("cy", d => d.y-6)
    }  
    
}

export {recupererDonnees, executeSPARQLRequest, recupererEtAfficherTableau, nodelink_creator, nodeAlreadyExist, buildNodes, linkAlreadyExist, buildLinks, buildLegend}