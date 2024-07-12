import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm"


function recolt_Data() { // Get the text written in the text_area.
    var text = document.getElementById('user_text').value
    return text
}

function nodeAlreadyExist(node, nodesList) { // Call a node and a list of nodes, and check if the id in the node match the id of one of the nodes in the list.
    for (let n of nodesList) {
        if (n.id === node.id) {
            return true
        }
    }
    return false
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

function buildNodes(edge, node_colors) { // Call a dataset and a list of patterns (source, target, relation). For each unique value in the source and target columns, create a node. If a node is both in source and target, give the node the status of "mix".
    
    const nodes = []

    let node1, node2

    // node 1

    try {
        node1 = {
            id : edge.subject,
            label : edge.subject,
            color : node_colors[0],
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
        console.log("The dataset doesn't contain a subject")
    }

    // node 2

    try {
        node2 = {
            id : edge.object,
            label : edge.object,
            color : node_colors[1],
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
        console.log("The dataset doesn't contain a target")
    }

    return nodes
}

function buildLinks(edge, link_color){

    const links = []
    let link

    // link

    try {
        const source = edge.subject
        const target = edge.object
        const label = edge.predicate

        link = {
            source : source,
            target : target,
            label : label,
            color : link_color
        }

        if (!(linkAlreadyExist(link, links))) {
            links.push(link)
        }

        } catch (error) {
            console.log("The dataset doesn't contain necessary elements to create the link.")
        }

    return links
}

function nodelink_creator(data, triples, nomgraph, node_colors = ["red", "blue"], link_color = "gold", mixed_color = null, strength = -50, width = 400, height = 400, node_named = true, link_named = true, node_zoom = true, zoom_strenght = 2, number_ticks = 500) {

    let nodes = buildNodes(triples, node_colors)
    let links = buildLinks(triples, link_color)

    console.log(triples)
    
    console.log("nodes", nodes)
    console.log("links", links)

    let dataset_pattern = {nodes : nodes, links : links}
    console.log(dataset_pattern)

    const data_used = JSON.parse(JSON.stringify(dataset_pattern))
  
    const margin = {top: 5, right: 5, bottom: 5, left: 5}

    const svg_used= d3.select("#"+nomgraph)

    const width2 = width*0.9
    const height2 = height*0.9

    const surface = Math.min(width2, height2)

    const zoom = d3.zoom()
        .scaleExtent([0.1, 10]) // Define the zoom limits
        .on('zoom', function(event) {
            svg_graph.attr("transform", event.transform)
        }, {passive : true})

    d3.select("#nodelink_graph").call(zoom,
        d3.zoom()
            .on('zoom', function(event) {
                svg_graph.attr('transform', event.transform)
        }), {passive: true})


    const link = svg_used.selectAll("line") // Create the multiple links between the nodes. Must be placed in the code BEFORE the nodes.
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
    }

    const node = svg_used.selectAll("circle") // Create the multiples nodes on the graph
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

function graph_pattern(dataset, triples, node_colors = ["red", "blue"], link_color = "gold", strength = -50, width = null, height = null) {

    // Initialisation

    console.log(dataset)
    console.log(triples)

    const margin = {top: 5, right: 5, bottom: 5, left: 5}

    const nb_graphs = triples.length

    // Création des SVG

    /*let width_used, height_used

    if (width === null) { 
        width_used = nb_graphs*100
    } else {
        width_used = width
    }

    if (height === null) { 
        height_used = nb_graphs*100
    } else {
        height_used = height
    }*/


    let width_used = 100
    let height_used = 100

    const svg_total = d3.select("#pattern_graph") 
        .attr("width", width_used + margin.left + margin.right)
        .attr("height", height_used + margin.top + margin.bottom)

    const width2 = width_used*0.9
    const height2 = height_used*0.9

    let colors = ["blue", "red", "green", "purple"]

    let parent = svg_total.append("svg")
        .attr("id", "svg_enfant_0")
        .attr("x", width_used*0.1)
        .attr("y", height_used*0.1)
        .attr("width", width_used*0.5)
        .attr("height", height_used*0.5)
        .attr("viewBox", "0 0 50 50")
        .attr("style", `border: 1px solid ${colors[0]};`)

    console.log(nb_graphs)
    let i=1

    do {
        // Calcul de la taille réduite et le décalage pour chaque SVG imbriqué
        let scale = (nb_graphs - i) / nb_graphs
        console.log(scale)
        let color = colors[i % colors.length]
        console.log(width_used)
        console.log(height_used)

        // Création du nouveau svg

        let enfant = parent.append("svg")
        .attr("id", "svg_enfant_" + i)
        .attr("x", width_used*scale)
        .attr("y", height_used*scale)
        .attr("width", width2*scale)
        .attr("height", height2*scale)
        .attr("style", `border: 1px solid ${color};`)

        parent = enfant

        i++

    } while (i < nb_graphs+1)

    for (let i = nb_graphs-1; i >= 0; i--) {
        let nomgraph = "svg_enfant_" +i
        //nodelink_creator(dataset, triples[i], nomgraph, node_colors = ["red", "blue"], link_color = "gold", strength = -50, width = null, height = null)
    }

}



export {recolt_Data, graph_pattern}