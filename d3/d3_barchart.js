import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm"

const dataset_barchart = [
    {category :"Clouds", values : [{value : 5, label : "Wolf"}, {value : 8, label : "Eagle"}, {value : 12, label : "Deer"}, {value : 7, label : "Lion"}, {value : 9, label : "Dragon"}], fill : "black"},
    {category :"Flower", values : [{value : 10, label : "Wolf"}, {value : 20, label : "Eagle"}, {value : 15, label : "Deer"}, {value : 25, label : "Lion"}, {value : 30, label : "Dragon"}], fill : "crimson"},
    {category :"Snow", values :  [{value : 6, label : "Wolf"}, {value : 8, label : "Eagle"}, {value : 2, label : "Deer"}, {value : 4, label : "Lion"}, {value : 5, label : "Dragon"}], fill : "silver"},
    {category :"Wind", values :  [{value : 20, label : "Wolf"}, {value : 30, label : "Eagle"}, {value : 10, label : "Deer"}, {value : 12, label : "Lion"}, {value : 18, label : "Dragon"}], fill : "gold"},
    {category :"Moon", values :  [{value : 14, label : "Wolf"}, {value : 16, label : "Eagle"}, {value : 24, label : "Deer"}, {value : 8, label : "Lion"}, {value : 17, label : "Dragon"}], fill : "lightblue"}
]

const couleurs = ["black", "crimson", "silver", "gold", "steelblue"]

const barchart_creator = (donnees, couleurs = [0], vertical_bar = true, is_log = false, longueur = 400) => {

    const taille = Math.max(donnees.length, 5)
    const margin = {left : 5, top : 5, bottom : 5, right : 5}
    const varPadding = 1
    const domaine = d3.max(donnees, d => d3.max(d.values, e => e.value))
    const long2 = longueur*0.8

    const svg = d3.select("#d3_demo_3").attr("width", longueur + margin.left + margin.right).attr("height", longueur + margin.top + margin.bottom)

    let svg2 = svg.append("svg")
        .attr("x", longueur*0.1)
        .attr("y", longueur*0.1)
        .attr("width", long2)
        .attr("height", long2)

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

        svg.selectAll("labels")
            .data(uniqueLabels).enter()
            .append("text")
            .attr("x", (d,i) => longueur/10 + origin + i*ecart)
            .attr("y", longueur*0.95)
            .text(function(d){ return d})
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")

    } else {

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

barchart_creator(dataset_barchart, couleurs, false, true, longueur = 300)

