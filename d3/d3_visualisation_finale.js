import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm"

const couleurs = ["black", "crimson", "silver", "gold", "steelblue"]

const barchart_creator = (config_barchart) => {

    console.log(config_barchart)
    let longueur = config_barchart.options.longueur
    let donnees = config_barchart.data
    let is_log = config_barchart.options.is_log
    let vertical_bar = config_barchart.options.vertical_bar

    let colors = config_barchart.options.hasOwnProperty("colors") ? config_barchart.options.colors : couleurs
    console.log(colors)

    const margin = {left : 5, top : 5, bottom : 5, right : 5}
    const svg = d3.select("#d3_visualisation").attr("width", longueur + margin.left + margin.right).attr("height", longueur + margin.top + margin.bottom)

    const long2 = longueur*0.8

    let svg2 = svg.append("svg")
            .attr("x", longueur*0.1)
            .attr("y", longueur*0.1)
            .attr("width", long2)
            .attr("height", long2)

    const taille = Math.max(donnees.length, 5)
    const varPadding = 1
    const domaine = d3.max(donnees, d => d3.max(d.values, e => e.value))

    let x_scale
    let y_scale
    
    x_scale = d3.scaleBand().domain(donnees.map(d => d.category)).range([0, long2]).padding(0.1)
    if (!is_log) {
        y_scale = d3.scaleLinear().domain([0, domaine]).range([0, long2*0.9])
    } else {
        y_scale = d3.scaleLog().domain([1, domaine]).range([0, long2*0.9]) 
    }

    let exploitable = []
    let keys = []
    let color = []

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

            if (colors[0] === 0) {
                let couleurs = {"color" : d.fill}
                color.push(couleurs.color)
            } else {
                color = colors
            }
        })
    } catch (error) {
        console.error("Le dataset n'est pas au bon format : ", error)
    }
// ZENERHTBGQRQEGSNTEGHZTNBRGSEDFH ETBZGAZGSR4REBS 4GBDSZF4AEZBF4AZDS Question de la couleur
    let echelle_couleurs = d3.scaleOrdinal().domain(keys).range(color)

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
                val_choisie = y_scale(d.value)
            } else if (choice === "width") {
                val_choisie = (x_scale.bandwidth() / taille) - varPadding
            } else if (choice === "height") {
                val_choisie = longueur-10 - y_scale(d.value)
            } else {
                console.log("mauvais choice")
            }

        } else {
            if (choice === "x") {
                val_choisie = 10 // Longueur de la barre
            } else if (choice === "y") {
                val_choisie = origin + i*ecart + d.incr*(x_scale.bandwidth() / taille)
            } else if (choice === "width") {
                val_choisie = y_scale(d.value) //Décalage par rapport à la gauche !! => Point le plus à droite de chaque barre.
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
        .style("fill", d => echelle_couleurs(d.parents))

    // Légende

    svg.selectAll("categories_dots")
        .data(keys).enter()
        .append("circle")
        .attr("cx", function(d,i){ return 20 + i*75})
        .attr("cy", 15)
        .attr("r", 7)
        .style("fill", (d, i) => color[i])

    svg.selectAll("categories")
        .data(keys).enter()
        .append("text")
        .attr("x", function(d,i){ return 30 + i*75})
        .attr("y", 15)
        .style("fill", (d, i) => color[i])
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
            .attr("x", (d,i) => longueur/10 + origin + i*ecart)
            .attr("y", longueur*0.95)
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
            .attr("y", (d,i) => longueur/10 + 5*origin + i*ecart)
            .attr("x", 5)
            .text(d => d.substring(0, 5))
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")
    

    }

}

const stackedchart_creator = (config_stackedchart) => {

    // Initialisation

    let color = []
    let keys = []

    donnees.forEach(d => {
        
        let object = {"Category" : d.category}
        keys.push(object.Category)

        if (couleurs[0] === 0) {
            let couleurs = {"color" : d.fill}
            color.push(couleurs.color)
        } else {
            color = couleurs
        }
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

    // Création du svg

    const x_scale = d3.scaleBand()
        .domain(dataset.map(d => d.group))
        .range([0, long2])
        .padding(0.1)

    let y_scale

    // Fonction de choix

    function choix(choice, d, i) {

        let val_choisie = 0

        if (vertical_bar === true) {
            y_scale = d3.scaleLinear()
                .domain([0, d3.max(dataset, d => d.Clouds + d.Flower + d.Snow + d.Wind + d.Moon)])
                .range([long2*0.9, 0])
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
            y_scale = d3.scaleLinear()
                .domain([0, d3.max(dataset, d => d.Clouds + d.Flower + d.Snow + d.Wind + d.Moon)])
                .range([0, long2*0.9])
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
                    .attr("fill", (d,i) => color[i]),
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
        .style("fill", (d, i) => color[i])

    svg.selectAll("categories")
        .data(keys).enter()
        .append("text")
        .attr("x", function(d,i){ return 30 + i*75})
        .attr("y", 15)
        .style("fill", (d, i) => color[i])
        .text(function(d){ return d})
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")



    let ecart = x_scale(uniqueLabels[1])-x_scale(uniqueLabels[0])
    let origin = x_scale(uniqueLabels[0])

    if (vertical_bar == true) {

        svg.selectAll("labels")
            .data(uniqueLabels).enter()
            .append("text")
            .attr("x", (d,i) => longueur*0.15 + origin + i*ecart)
            .attr("y", longueur*0.95)
            .text(function(d){ return d})
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")

    } else {

        svg.selectAll("labels")
            .data(uniqueLabels).enter()
            .append("text")
            .attr("y", (d,i) => longueur*0.15 + 5*origin + i*ecart)
            .attr("x", 5)
            .text(d => d.substring(0, 5))
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")
    }    

}

const piechart_creator = (config_piechart) => {

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

    let color = []
    let keys = []

    try {
        donnees.forEach(d => {
            let object = {"Label" : d.label}
            keys.push(object.Label)

            if (couleurs[0] === 0) {
                let couleurs = {"color" : d.fill}
                color.push(couleurs.color)
            } else {
                color = couleurs
            }
        })
    } catch (error) {
        console.error("Le dataset n'est pas au bon format : ", error)
    }

    let echelle_couleurs = d3.scaleOrdinal().domain(keys).range(color)

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
            return echelle_couleurs(i)
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
        .attr("fill", "white")
        .attr("text-anchor", "middle")
        .style("font", "16px times")
        .attr("transform", function(d) { 
                    return "translate(" + label.centroid(d) + ")"; 
            })
        
}

function nodelink_creator(config_nodelink) {

    let coloration
    if (couleurs.length != 2) {
        coloration = ["red", "steelblue"]
    } else {
        coloration = couleurs
    }
    
    const link = svg.selectAll("line")
        .data(donnees.links)
        .join("line")
        .style("stroke", coloration[0])
    
    const node = svg.selectAll("circle")
        .data(donnees.nodes)
        .join("circle")
        .attr("r", 20)
        .style("fill", coloration[1])
        
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
        .force("center", d3.forceCenter(longueur / 2, longueur / 2))
        .on("end", ticked)
        
    }

const visualisation = (config) => {

      if (config.type === "barchart") { 
        barchart_creator(config)
      } else if (config.type === "stackedchart") {
        stackedchart_creator(config)
      } else if (config.type === "piechart") {
        piechart_creator(config)
      } else if (config.type === "nodelink") {
        nodelink_creator(config)
      }

}

export default visualisation;