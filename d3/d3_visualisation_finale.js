import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm"

const couleurs = ["green", "crimson", "silver", "gold", "steelblue"]


const barchart_creator = (config_barchart) => {

    console.log(config_barchart)

    let donnees = config_barchart.data

    let width = config_barchart?.options?.width ?? 400
    let height = config_barchart?.options?.height ?? 400
    let vertical_bar = config_barchart?.options?.vertical_bar ?? true
    let scale = config_barchart.options.scale ?? "linear"
    let colors = config_barchart.options.colors ?? 0

    const margin = {left : 5, top : 5, bottom : 5, right : 5}
    const svg = d3.select("#d3_visualisation").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom)

    const width2 = width*0.8
    const height2 = height*0.8

    let svg2 = svg.append("svg")
            .attr("x", width*0.1)
            .attr("y", height*0.1)
            .attr("width", width2)
            .attr("height", height2)

    const taille = Math.max(donnees.length, 5)
    const varPadding = 1
    const domaine = d3.max(donnees, d => d3.max(d.values, e => e.value))

    let x_scale
    let y_scale

    if (vertical_bar === true) {
        x_scale = d3.scaleBand().domain(donnees.map(d => d.category)).range([0, width2]).padding(0.1)
        if (scale === "log") {
            y_scale = d3.scaleLog().domain([1, domaine]).range([0, height2*0.9]) 
        } else {
            y_scale = d3.scaleLinear().domain([0, domaine]).range([0, height2*0.9])
        }
    } else if (vertical_bar === false) {
        x_scale = d3.scaleBand().domain(donnees.map(d => d.category)).range([0, height2]).padding(0.1)
        if (scale === "log") {
            y_scale = d3.scaleLog().domain([1, domaine]).range([0, width2*0.9]) 
        } else {
            y_scale = d3.scaleLinear().domain([0, domaine]).range([0, width2*0.9])
        }
    }
    
    

    let exploitable = []
    let keys = []

    // Transformation des données

    try {
        donnees.forEach((d,i) => {
            let object = {"Category" : d.category}
            object["Value"] = []

            for (let j = 0; j < d.values.length ; j++) {
                object.Value.push({"value" : d.values[j].value, "labels" : d.values[j].label, "parents" : d.category, "color" : d.fill, "incr" : i})
            }

            exploitable.push(object)
            keys.push(object.Category)

        })
    } catch (error) {
        console.error("Le dataset n'est pas au bon format : ", error)
    }

    let colorScale
    
    if (colors == [0]) {
        colorScale = d3.scaleOrdinal(d3.schemeCategory10).domain(keys)
        colors = d3.schemeCategory10
    } else {
        colorScale = d3.scaleOrdinal().domain(keys).range(colors)
    }

    let uniqueLabels = []
    donnees.forEach(item => {
        item.values.forEach(val => {
            if (!uniqueLabels.includes(val.label)) {
                uniqueLabels.push(val.label)
            }
        })
    })

    let ecart = x_scale(exploitable[1].Category)-x_scale(exploitable[0].Category)
    let origin = x_scale(exploitable[0].Category)

    function choix(choice, d, i) {

        let val_choisie = 0

        if (vertical_bar === true) {
            if (choice === "x") {
                val_choisie = origin + i*ecart + d.incr*(x_scale.bandwidth() / taille)
            } else if (choice === "y") {
                val_choisie = height2 - y_scale(d.value)
            } else if (choice === "width") {
                val_choisie = (x_scale.bandwidth() / taille) - varPadding
            } else if (choice === "height") {
                val_choisie = y_scale(d.value)
            } else {
                console.log("mauvais choice")
            }

        } else {
            if (choice === "x") {
                val_choisie = 10
            } else if (choice === "y") {
                val_choisie = origin + i*ecart + d.incr*(x_scale.bandwidth() / taille)
            } else if (choice === "width") {
                val_choisie = y_scale(d.value)
            } else if (choice === "height") {
                val_choisie = (x_scale.bandwidth() / taille) - varPadding
            } else {
                console.log("Mauvais choice")
            }
        }

        return val_choisie
    }

    let group = svg2.selectAll("g")
        .data(exploitable)
        .join(
            enter => enter.append("g")
                            .attr("class", (d, i) => d.Value[i]),
            update => update,
            exit => exit.remove()
        )

    // Création des rectangles

    group.selectAll("rect")
        .data(d => d.Value)
        .join(
            enter => enter.append("rect")
                        .attr("class", "bar"),
            update => update,
            exit => exit.remove()
        )
        .attr("x", (d,i) => choix("x", d, i))
        .attr("y", (d,i) => choix("y", d, i))
        .attr("width", (d,i) => choix("width", d, i))
        .attr("height", (d,i) => choix("height", d, i))
        .style("fill", d => colorScale(d.parents))

    // Légende

    svg.selectAll("categories_dots")
        .data(keys).enter()
        .append("circle")
        .attr("cx", function(d,i){ return 20 + i*75})
        .attr("cy", 15)
        .attr("r", 7)
        .style("fill", (d, i) => colors[i])

    svg.selectAll("categories")
        .data(keys).enter()
        .append("text")
        .attr("x", function(d,i){ return 30 + i*75})
        .attr("y", 15)
        .style("fill", (d, i) => colors[i])
        .text(function(d){ return d})
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")

    if (vertical_bar == true) {

        group.selectAll("text")
        .data(d => d.Value)
        .join(
            enter => enter.append("text").text((d => d.value))
                        .attr("class", "text"),
            update => update,
            exit => exit.remove()
        )
        .attr("fill","black")
        .attr("text-anchor", "start")
        .style("font", "12px times")
        .attr("x", (d,i) => choix("x", d, i))
        .attr("y", (d,i) => choix("y", d, i) - 5)

        svg.selectAll("labels")
            .data(uniqueLabels).enter()
            .append("text")
            .attr("x", (d,i) => width/10 + origin + i*ecart)
            .attr("y", height*0.95)
            .text(function(d){ return d})
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")

    } else {

        group.selectAll("text")
        .data(d => d.Value)
        .join(
            enter => enter.append("text").text((d => d.value))
                        .attr("class", "text"),
            update => update,
            exit => exit.remove()
        )
        .attr("fill","black")
        .attr("text-anchor", "start")
        .style("font", "12px times")
        .attr("x", (d,i) => choix("x", d, i)+choix("width", d, i) + 2)
        .attr("y", (d,i) => choix("y", d, i)+choix("height", d, i))
        
        svg.selectAll("labels")
            .data(uniqueLabels).enter()
            .append("text")
            .attr("y", (d,i) => width/10 + 5*origin + i*ecart)
            .attr("x", 5)
            .text(d => d.substring(0, 5))
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")
    

    }

}

const stackedchart_creator = (config_stackedchart) => {

    console.log(config_stackedchart)

    let donnees = config_stackedchart.data

    let width = config_stackedchart.options.hasOwnProperty("width") ? config_stackedchart.options.width : 400
    let height = config_stackedchart.options.hasOwnProperty("height") ? config_stackedchart.options.height : 400
    let vertical_bar = config_stackedchart.options.hasOwnProperty("vertical_bar") ? config_stackedchart.options.vertical_bar : true
    let colors = config_stackedchart.options.hasOwnProperty("colors") ? config_stackedchart.options.colors : d3.schemeCategory10

    const margin = {left : 5, top : 5, bottom : 5, right : 5}
    const svg = d3.select("#d3_visualisation").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom)

    const width2 = width*0.8
    const height2 = height*0.8

    let svg2 = svg.append("svg")
            .attr("x", width*0.15)
            .attr("y", height*0.15)
            .attr("width", width2)
            .attr("height", height2)

    // Initialisation

    let keys = []

    donnees.forEach(d => {
        
        let object = {"Category" : d.category}
        keys.push(object.Category)

    })

    const dataset = donnees[0].values.map((_, i) => {
        let obj = {group: donnees[0].values[i].label }
        donnees.forEach(data => {
            obj[data.category] = data.values[i].value
        })
        return obj
    })

    const item = d3.stack().keys(["Clouds", "Flower", "Snow", "Wind", "Moon"])(dataset)

    let uniqueLabels = []
    donnees.forEach(item => {
        item.values.forEach(val => {
            if (!uniqueLabels.includes(val.label)) {
                uniqueLabels.push(val.label)
            }
        })
    })

    let x_scale
    let y_scale

    if (vertical_bar === true) {
        x_scale = d3.scaleBand().domain(dataset.map(d => d.group)).range([0, width2]).padding(0.1)
        y_scale = d3.scaleLinear().domain([0, d3.max(dataset, d => d.Clouds + d.Flower + d.Snow + d.Wind + d.Moon)]).range([height2*0.9, 0])
    } else {
        x_scale = d3.scaleBand().domain(dataset.map(d => d.group)).range([0, width2]).padding(0.1)
        y_scale = d3.scaleLinear().domain([0, d3.max(dataset, d => d.Clouds + d.Flower + d.Snow + d.Wind + d.Moon)]).range([0, width2*0.9])
    }

    // Fonction de choix

    function choix(choice, d, i) {

        let val_choisie = 0

        if (vertical_bar === true) {
            if (choice === "x") {
                val_choisie = x_scale(d.data.group)
            } else if (choice === "y") {
                val_choisie = y_scale(d[1])
            } else if (choice === "width") {
                val_choisie = x_scale.bandwidth()
            } else if (choice === "height") {
                val_choisie = (y_scale(d[0]) - y_scale(d[1]))
            } else {
                console.log("mauvais choice")
            }

        } else {
            if (choice === "x") {
                val_choisie = y_scale(d[0])
            } else if (choice === "y") {
                val_choisie = x_scale(d.data.group)
            } else if (choice === "width") {
                val_choisie = (y_scale(d[1]) - y_scale(d[0]))
            } else if (choice === "height") {
                val_choisie = x_scale.bandwidth()
            } else {
                console.log("Mauvais choice")
            }
        }

        return val_choisie
    }

    let group = svg2.selectAll("g")
        .data(item)
        .join(
            enter => enter.append("g")
                    .attr("fill", (d,i) => colors[i]),
            update => update,
            exit => exit.remove()
        )

    group.selectAll("rect")
        .data(d => d)
        .join(
            enter => enter.append("rect")
                    .attr("class", "stackedbar"),
            update => update,
            exit => exit.remove()
        )
        .attr("x", (d,i) => choix("x", d, i))
        .attr("y", (d,i) => choix("y", d, i))
        .attr("width", (d,i) => choix("width", d, i))
        .attr("height", (d,i) => choix("height", d, i))

    svg.selectAll("categories_dots")
        .data(keys).enter()
        .append("circle")
        .attr("cx", function(d,i){ return 20 + i*75})
        .attr("cy", 15)
        .attr("r", 7)
        .style("fill", (d, i) => colors[i])

    svg.selectAll("categories")
        .data(keys).enter()
        .append("text")
        .attr("x", function(d,i){ return 30 + i*75})
        .attr("y", 15)
        .style("fill", (d, i) => colors[i])
        .text(function(d){ return d})
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")



    let ecart = x_scale(uniqueLabels[1])-x_scale(uniqueLabels[0])
    let origin = x_scale(uniqueLabels[0])

    if (vertical_bar == true) {

        svg.selectAll("labels")
            .data(uniqueLabels).enter()
            .append("text")
            .attr("x", (d,i) => width*0.15 + origin + i*ecart)
            .attr("y", height*0.95)
            .text(d => d)
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")

    } else {

        svg.selectAll("labels")
            .data(uniqueLabels).enter()
            .append("text")
            .attr("y", (d,i) => height*0.15 + 5*origin + i*ecart)
            .attr("x", 5)
            .text(d => d.substring(0, 5))
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")
    }    

}

const piechart_creator = (config_piechart) => {

    console.log(config_piechart)
    let donnees = config_piechart.data

    let width = config_piechart.options.hasOwnProperty("width") ? config_piechart.options.width : 400
    let height = config_piechart.options.hasOwnProperty("height") ? config_piechart.options.height : 400
    let colors = config_piechart.options.hasOwnProperty("colors") ? config_piechart.options.colors : 0
    let color_text = config_piechart.options.hasOwnProperty("color_text") ? config_piechart.options.color_text : d3.schemeCategory10[0]

    const margin = {left : 5, top : 5, bottom : 5, right : 5}
    const svg = d3.select("#d3_visualisation").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom)

    const longueur = Math.min(width, height)

    let pie = []
    let data_pie = []

    try{
        pie = d3.pie().value(d => d.value)
        data_pie = pie(donnees)
    } catch (error) {
        console.log("Le dataset ne peut être pie : ", error)
    }
    // Récupération du pie des données et de l'arc
    
    const radius = longueur / 2

    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius)

    // Initialisation du svg
    
    const group = svg.append("g")
        .attr("transform", "translate(" + (longueur) / 2 + "," + (longueur) / 2 + ")")

    // Récupération des labels et des couleurs

    let keys = []

    try {
        donnees.forEach(d => {
            let object = {"Label" : d.label}
            keys.push(object.Label)
        })
    } catch (error) {
        console.error("Le dataset n'est pas au bon format : ", error)
    }

    let colorScale
    
    if (colors === 0) {
        colorScale = d3.scaleOrdinal(d3.schemeCategory10).domain(keys)
        colors = d3.schemeCategory10
    } else {
        colorScale = d3.scaleOrdinal().domain(keys).range(colors)
    }

    let label = d3.arc()
                    .outerRadius(radius)
                    .innerRadius(radius - 80)

    const arcs = group.selectAll("arc")
    .data(data_pie)
    .enter()
    .append("g")
    .attr("class", "arc")

    arcs.append("path")
        .attr("fill", function(d, i) {
            return colorScale(i)
        })
        .attr("d", arc)

    group.selectAll("text")
        .data(data_pie)
        .join(
            enter => enter.append("text").text((d => d.data.label))
                            .attr("class", "text"),
            update => update,
            exit => exit.remove()
        )
        .attr("fill", color_text)
        .attr("text-anchor", "middle")
        .style("font", "16px times")
        .attr("transform", function(d) { 
                    return "translate(" + label.centroid(d) + ")"; 
            })
        
}

function nodelink_creator(config_nodelink) {

    
    let donnees = config_nodelink.data

    let width = config_nodelink.options.hasOwnProperty("width") ? config_nodelink.options.width : 400
    let height = config_nodelink.options.hasOwnProperty("height") ? config_nodelink.options.height : 400
    let colors = config_nodelink.options.hasOwnProperty("colors") ? config_nodelink.options.colors : d3.schemeCategory10
    let strength = config_nodelink.options.hasOwnProperty("strength") ? config_nodelink.options.strength : -400

    const margin = {left : 5, top : 5, bottom : 5, right : 5}
    const svg = d3.select("#d3_visualisation").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom)
    
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

const visualisation = (config) => {
    console.log("Loading visualisation: ", config.type)
    switch(config.type){
    case "barchart":
        barchart_creator(config); 
        break;
    case "stackedchart":
        stackedchart_creator(config); 
        break;
    case "piechart":
        piechart_creator(config); 
        break;
    case "nodelink":
        nodelink_creator(config); 
        break;
    default:
        console.error("No valid type of vizualisation given")
    }
}

export default visualisation;