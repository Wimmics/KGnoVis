import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm"
import * as grid from 'https://unpkg.com/gridjs?module'

/*
function loadXML() {
    let xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            displayXML(this)
        }
    }
    xhttp.open("GET", "exemple.xml", true)
    xhttp.send()
}

function displayXML(xml) {
    const xmlDoc = xml.responseXML;
    const content = "";
    const books = xmlDoc.getElementsByTagName("book");
    for (let i = 0; i < books.length; i++) {
        const title = books[i].getElementsByTagName("title")[0].childNodes[0].nodeValue;
        const author = books[i].getElementsByTagName("author")[0].childNodes[0].nodeValue;
        const year = books[i].getElementsByTagName("year")[0].childNodes[0].nodeValue;
        content += "<p><strong>" + title + "</strong> - " + author + " (" + year + ")</p>";
    }
    document.getElementById("xmlContent").innerHTML = content;
}

// Charger le fichier XML au chargement de la page
window.onload = loadXML;
*/

function recolt_Data() { // Get the text written in the text_area.
    var text = document.getElementById('user_text').value
    return text
    }

const executeSPARQLRequest = async (endpoint, query) => { // Call a SPARQL request and use it, then return the dataset collected.
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

function table_creator(dataset) { // Create a grid and complete it with the called dataset.

    const table = new grid.Grid({
        columns : ["source", "label", "target"],
        sort : true,
        pagination : true,
        fixedHeader : true,
        height : "20rem",
        data : dataset.links,
        width : "50vw",
        resizable : true
    })
    
    table.render(document.getElementById('result_table'))
}

function nodeAlreadyExist(node, nodesList) { // Call a node and a list of nodes, and check if the id in the node match the id of one of the nodes in the list.
    for (let n of nodesList) {
        if (n.id === node.id) {
            return true
        }
    }
    return false
}

function buildNodes(data, edge) { // Call a dataset and a list of patterns (source, target, relation). For each unique value in the source and target columns, create a node. If a node is both in source and target, give the node the status of "mix".
    
    const nodes = []

    for (let triple of edge) {
        for (let row of data) {

            let node1
            let node2

            try {
                node1 = {
                    id : row[triple.source]["value"],
                    label : row[triple.source]["value"],
                    col : triple.source,
                    place : "source",
                    zoom : false
                }

                if (!(nodeAlreadyExist(node1, nodes))) {
                    nodes.push(node1)
                } else {
                    let old_node = nodes.find(node => node.id === node1.id)
                    if (old_node.place === "target") {
                        old_node.place = "mix"
                    }
                }
            } catch(error) {
                console.log("The dataset doesn't contain necessary elements to create the 1st node.")
            }

            try {
                node2 = {
                    id : row[triple.target]["value"],
                    label : row[triple.target]["value"],
                    col : triple.target,
                    place : "target",
                    zoom : false
                }
            
                if (!(nodeAlreadyExist(node2, nodes))) {
                    nodes.push(node2)
                } else {
                    let old_node = nodes.find(node => node.id === node2.id)
                    if (old_node.place === "source") {
                        old_node.place = "mix"
                    }
                }
            } catch(error) {
                console.log("The dataset doesn't contain necessary elements to create the 2nd node.")
            }
        }
    }
    return nodes
}

function linkAlreadyExist(link, linksList) { // Call a pattern (source, target, relation) and a list of patterns. Check if the pattern (or an alternative pattern where source and target are reversed) is in the list.
    for (let l of linksList) {
        if (l.source === link.source && l.target === link.target && l.label === link.label) {
            return true
        } else if (l.source === link.target && l.target === link.source && l.label === link.label) {
            return true
        }
    }
    return false
}

function buildLinks(data, edge) { // Call a dataset and a list of patterns. For each pattern and row in the dataset, create all the unique links.
   
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
                console.log("The dataset doesn't contain necessary elements to create the link.")
            }
        }
    }
    return links
}

function buildLegend(edge) { // Call a list of patterns. Create a list of each source and target.

    const items = []

    for (const triple of edge) {

        items.push({
            label : "source", value : triple.source
        })

        items.push({
            label : "target", value : triple.target
        })
        
    } 
    return items
}

function rgbToHex(color) { // Call a rgb color, and convert it in hexadecimal values.

    const r = color[0]
    const b = color[1]
    const g = color[2]

    if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
        return "The RGB values are out of bounds"
    }

    const rHex = r.toString(16).padStart(2, '0')
    const gHex = g.toString(16).padStart(2, '0')
    const bHex = b.toString(16).padStart(2, '0')

    const hexColor = '#' + rHex + gHex + bHex

    return hexColor
}

function color_merger(color_list, weight_list = null) { // Call a list of colors, and in bonus parameters the possibility to give a weight to each color. Mix the colors then convert them thanks to the rgbToHex function.

    let weight

    if (weight_list === null) {
        weight = color_list.length
    } else {
        weight = weight_list
    }

    let red = [], blue = [], green = []

    for (let elt in color_list) {

        let item = color_list[elt]._source

        const new_red = item[0]
        const new_green = item[2]
        const new_blue = item[1]

        red.push(new_red)
        green.push(new_green)
        blue.push(new_blue)

    }

    const avg_red = Math.round(red.reduce((a, b) => a + b, 0)/weight)
    const avg_green = Math.round(green.reduce((a, b) => a + b, 0)/weight)
    const avg_blue = Math.round(blue.reduce((a, b) => a + b, 0)/weight)
    
    let fused_color = [avg_red, avg_green, avg_blue]

    let hex_color = rgbToHex(fused_color)

    return hex_color
}

/*
The next function is the big part. It calls a dataset and a long list of optionnal parameters (ie they all have a default parameter).

Node_colors and mixed_color grants the user the choice of the color of the nodes. The first color of node_colors is the source, the second the target.
Mixed_color is the color of nodes that are both source and target in the edges.
The default parameter of mixed_color is null because it allows to use the color_merger function.
Strength is the repulsive force between the nodes.
Width and height are the dimensions of the svg.
node_named and link_named let the user choose if he wants to see the name of the nodes above the graph
node_zoom allow to zoom on node when the user click on them, and zoom strengh define at which point the node is zoomed.
*/

function nodelink_creator(data, node_colors = ["red", "blue"], mixed_color = null, strength = -50, width = 400, height = 400, node_named = true, link_named = true, node_zoom = true, zoom_strenght = 2, number_ticks = 500) {

    console.log(data)

    const data_used = JSON.parse(JSON.stringify(data))
  
    const margin = {top: 5, right: 5, bottom: 5, left: 5}

    const svg_total = d3.select("#nodelink_graph") // Define the svg containing the graph and the legend.
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)

    const width2 = width*0.9
    const height2 = height*0.9

    const surface = Math.min(width2, height2)

    const svg_graph = svg_total.append("svg") // Create a sub-svg that will only contain the graph.
        .attr("x", width*0.05)
        .attr("y", height*0.05)
        .attr("width", width2)
        .attr("height", height2)    
        .append("g")
        
    const svg_label = d3.select("#labels") // Define the svg containing the labels.

    const zoom = d3.zoom()
        .scaleExtent([0.1, 10]) // Define the zoom limits
        .on('zoom', function(event) {
            svg_graph.attr("transform", event.transform)
        }, {passive : true})

    d3.select("#nodelink_graph").call(zoom,
        d3.zoom()
            //.filter(() => !event.ctrlKey && !event.button) // Force the user to use ctrl to zoom (can allow to not zoom while trying to move on the page).
            //.touchable() // For mobile users : allow touch-sensitive screen to zoom
            .on('zoom', function(event) {
                svg_graph.attr('transform', event.transform)
        }), {passive: true})


    const link = svg_graph.selectAll("line") // Create the multiple links between the nodes. Must be placed in the code BEFORE the nodes.
        .data(data_used.links)
        .join("line")
        .attr("label", d => d.label)
        .attr("id", d => d.id)
        .style("stroke", d => d.color)

    const col1 = new fabric.Color(node_colors[0])
    const col2 = new fabric.Color(node_colors[1])

    let rgb_node_colors = [col1, col2]    
    let color_mixed

    if (mixed_color === null) { // Allow to use the color for the mix elements defined by the user, or to use the mix of the 2 node colors if none was choosen
        color_mixed = color_merger(rgb_node_colors)
    } else {
        color_mixed = mixed_color
    } //Ajouter un if #

    const node = svg_graph.selectAll("circle") // Create the multiples nodes on the graph
        .data(data_used.nodes)
        .join("circle")
        .attr("r", 0.01*surface)
        .attr("label", d => d.label)
        .attr("id", d => d.id)
        .style("fill", function(d) {
            if (d.place === "source") {
                return node_colors[0]
            } else if (d.place === "target") {
                return node_colors[1]
            } else {
                return color_mixed
            }
        })

    let nodes_label
    let link_label
    let zoomScale = 1

    if (node_zoom === true) { // Allow to zoom on click on the nodes. Can be disabled by the user.

        node.on("click", d => {
            const choosen_id = d.target.getAttribute("id")  
            const choosen_node = d3.select('circle[label="' + choosen_id + '"]') // Focus on the clicked node
            console.log(choosen_node)

            let choosen_x
            let choosen_y

            if (choosen_node._groups[0][0].__data__.label === d.target.getAttribute("label")) {
                choosen_x = choosen_node._groups[0][0].__data__.x
                choosen_y = choosen_node._groups[0][0].__data__.y
            }

            if (choosen_node._groups[0][0].__data__.zoom === false) { 
                zoomScale = zoom_strenght 
                choosen_node.transition().attr("transform", `translate(${choosen_x}, ${choosen_y}) scale(${zoomScale}) translate(${-choosen_x}, ${-choosen_y})`)
                // The zoom function contain some translations because without them, the zoom would replace all other changes, and that include the position.
                
                choosen_node._groups[0][0].__data__.zoom = true
            } else { // This part is for the dezoom.
                zoomScale = 1
                choosen_node.transition().attr("transform", `translate(${choosen_x}, ${choosen_y}) scale(${zoomScale}) translate(${-choosen_x}, ${-choosen_y})`)
                choosen_node._groups[0][0].__data__.zoom = false
            }
        }, {passive : true})

    }

    if (node_named === true) {

        nodes_label = svg_label.selectAll("nodes") // Create a text in the labels svg for each node, and hide it.
            .data(data_used.nodes)
            .enter().append("p")
            .style("text-align", "center")
            .style("font-size", "12px")
            .style("display", "none")
            .attr("id", d => d.label)
            .attr("label", d => d.label)
            .text(d => d.label)
            .attr("x", d => 10)
            .attr("y", d => 30)
            

        svg_graph.selectAll("circle") // Select the node when the mouse pass over it.
        .on("mouseover", d => {
            let choosen_node

            for (let elt in nodes_label._groups[0]) { // Print the associated label.
                if (nodes_label._groups[0][elt].__data__.label === d.target.getAttribute("label")) {
                    choosen_node = nodes_label._groups[0][elt]
                    choosen_node.style.display = "flex"           
                }
            }
        })
        .on("mouseout", d => {  // Same function but to hide the label when mouse quit the node.
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
        link_label = svg_label.selectAll("liens") // Create a text in the labels svg for each link, and hide it.
        .data(data_used.links)
        .enter().append("p")
        .text(d => d.label)
        .attr("label", d => d.label)
        .attr("id", d => d.id)
        .style("text-align", "center")
        .style("font-size", "12px")
        .style("display", "none")
        .attr("x", 10)
        .attr("y", 30)
        
        svg_graph.selectAll("line") // Select the link when the mouse pass over it.
        .on("mouseover", d => { 
            let choosen_link
        
            for (let elt in link_label._groups[0]) { // Print the associated label.
                if (parseInt(link_label._groups[0][elt].__data__.id) === parseInt(d.target.getAttribute("id"))) {
                    choosen_link = link_label._groups[0][elt]
                    choosen_link.style.display = "flex"
                }
            }
        })
        .on("mouseout", d => { // Same function but to hide the label when mouse quit the node.
            let choosen_link       

            for (let elt in link_label._groups[0]) {
                if (parseInt(link_label._groups[0][elt].__data__.id) === parseInt(d.target.getAttribute("id"))) { 
                    choosen_link = link_label._groups[0][elt]
                    choosen_link.style.display = "none"           
                }
            }
        })
    }

    const legend = [
        {label : "source"},
        {label : "target"},
        {label : "mix"}
    ]

    const dots = svg_total.selectAll("legend_dots")
        .data(legend)
        .join("circle")
        .attr("cx", (d, i) => (1/3)*0.20*width + (1/3)*i*width)
        .attr("cy", 0.02*height)
        .attr("r", 0.01*surface)
        .style("fill", function(d) {
            if (d.label === "source") {
                return node_colors[0]
            } else if (d.label === "target") {
                return node_colors[1]
            } else {
                return color_mixed
            }
        })

     const legend_text = svg_total.selectAll("legend_names")
        .data(legend)
        .join("text")
        .text(d => d.label)
        .attr("label", d => d.label)
        .attr("x", (d, i) => (1/3)*0.25*width + 20 + (1/3)*i*width)
        .attr("y", 0.02*height + 5)
        .style("font-size", "1rem")
    



    let ticksCount = 0
    // That line is linked to the .on("tick") in the next part. It allows the user to see the deployment of the nodes.

    const simulation = d3.forceSimulation(data_used.nodes) // Compute the places of the nodes.
        .force("link", d3.forceLink()                      
            .id(d => d.id)                
            .links(data_used.links)                                 
        )
        .force("charge", d3.forceManyBody().strength(strength))
        .force("center", d3.forceCenter(width2 / 2, height2 / 2))
        //.on("end", ticked)

        .on("tick", function () {

            ticked()
            ticksCount++

            if (ticksCount >= number_ticks) {
                simulation.stop() // Stop the simulation after the specified number of ticks.
            }
        })
     
        
    function ticked() { // Place the nodes and links.

        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y)

        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
    }  
    
}

export {recolt_Data, executeSPARQLRequest, table_creator, color_merger, nodelink_creator, buildNodes, buildLinks, buildLegend}