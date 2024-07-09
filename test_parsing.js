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

    for (let i = 0; i < edge.length; i++) {

        let node1, node2

        // node 1

        try {
            node1 = {
                id : edge[i].subject,
                label : edge[i].subject,
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
                id : edge[i].object,
                label : edge[i].object,
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
    }
    return nodes
}

function buildLinks(edge, link_color){

    const links = []

    for (let i = 0; i < edge.length; i++) {
        let link
        let number = 0

        // link

        try {
            const source = edge[i].subject
            const target = edge[i].object
            const label = edge[i].predicate

            link = {
                source : source,
                target : target,
                label : label,
                id : number,
                color : link_color
            }

            if (!(linkAlreadyExist(link, links))) {
                links.push(link)
            }

            number += 1
            } catch (error) {
                console.log("The dataset doesn't contain necessary elements to create the link.")
            }
    }
    return links
}

function graph_pattern(dataset, triples,  node_colors = ["red", "blue"], link_color = "gold", strength = -50, width = null, height = null) {

    // Initialisation

    console.log(dataset)
    console.log(triples)
    //console.log(triples[0])

    const margin = {top: 5, right: 5, bottom: 5, left: 5}

    const nb_graphs = triples.length + 1
    //console.log(nb_graphs)


        // Préparation des nodes et liens

    let nodes = buildNodes(triples, node_colors)
    let links = buildLinks(triples, link_color)
    
    console.log("nodes", nodes)
    console.log("links", links)


    // Création des SVG

    let width_used, height_used

    if (width === null) { 
        width_used = nb_graphs*100
    } else {
        width_used = width
    }

    if (height === null) { 
        height_used = nb_graphs*100
    } else {
        height_used = height
    }

    const svg_total = d3.select("#pattern_graph") // Define the svg containing the graph and the legend.
        .attr("width", width_used + margin.left + margin.right)
        .attr("height", height_used + margin.top + margin.bottom)


    const width2 = width_used*0.9
    const height2 = height_used*0.9

    let colors = ["blue", "red", "green", "purple"]

    let parent = svg_total.append("svg")
        .attr("id", "svg_enfant_0")
        .attr("x", width*0.05)
        .attr("y", height*0.05)
        .attr("width", width2)
        .attr("height", height2)
        .attr("style", `border: 1px solid ${colors[0]};`)

    for (let i = 1; i < nb_graphs; i++) {
        // Calcul de la taille réduite et le décalage pour chaque SVG imbriqué
        let scale = (nb_graphs - i) / nb_graphs
        let color = colors[i % colors.length]

        // Création du nouveau svg

        let enfant = parent.append("svg")
        .attr("id", "svg_enfant_" + i)
        .attr("x", width*scale)
        .attr("y", height*scale)
        .attr("width", width2*scale)
        .attr("height", height2*scale)
        .attr("style", `border: 1px solid ${color};`)

        parent = enfant
    }

    for (let i = nb_graphs-1; i >= 0; i--) {
        console.log(i)
        let graph = d3.select("#svg_enfant_" + i)
        console.log(graph)
    }

}



export {recolt_Data, graph_pattern}