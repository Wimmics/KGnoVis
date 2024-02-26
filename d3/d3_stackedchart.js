import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm"

const dataset_stackedchart = [
    {category :"Clouds", values : [{value : 5, label : "Wolf"}, {value : 8, label : "Eagle"}, {value : 12, label : "Deer"}, {value : 7, label : "Lion"}, {value : 9, label : "Dragon"}], fill : "black"},
    {category :"Flower", values : [{value : 10, label : "Wolf"}, {value : 20, label : "Eagle"}, {value : 15, label : "Deer"}, {value : 25, label : "Lion"}, {value : 30, label : "Dragon"}], fill : "crimson"},
    {category :"Snow", values :  [{value : 6, label : "Wolf"}, {value : 8, label : "Eagle"}, {value : 2, label : "Deer"}, {value : 4, label : "Lion"}, {value : 5, label : "Dragon"}], fill : "silver"},
    {category :"Wind", values :  [{value : 20, label : "Wolf"}, {value : 30, label : "Eagle"}, {value : 10, label : "Deer"}, {value : 12, label : "Lion"}, {value : 18, label : "Dragon"}], fill : "gold"},
    {category :"Moon", values :  [{value : 14, label : "Wolf"}, {value : 16, label : "Eagle"}, {value : 24, label : "Deer"}, {value : 8, label : "Lion"}, {value : 17, label : "Dragon"}], fill : "lightblue"}
]


const colors = ["black", "crimson", "silver", "gold", "steelblue"]

const stackedchart_creator = (donnees, couleurs = [0], vertical_bar = true, longueur = 400) => {

    // Initialisation

    const margin = {left : 5, top : 5, bottom : 5, right : 5}
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

    const svg = d3.select("#stacked").attr("width", longueur + margin.left + margin.right).attr("height", longueur + margin.top + margin.bottom)

    const long2 = longueur*0.8

    let svg2 = svg.append("svg")
        .attr("x", longueur*0.15)
        .attr("y", longueur*0.15)
        .attr("width", long2)
        .attr("height", long2)

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
                val_choisie = y_scale(d[0])// Longueur de la barre
            } else if (choice === "y") {
                val_choisie = x_scale(d.data.group)
            } else if (choice === "width") {
                val_choisie = (y_scale(d[1]) - y_scale(d[0])) //Décalage par rapport à la gauche !! => Point le plus à droite de chaque barre.
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

stackedchart_creator(dataset_stackedchart, colors, false)