import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm"

const databis = [
    {label :"Clouds", value : 12, fill : "black"},
    {label :"Flower", value : 19, fill : "crimson"},
    {label :"Snow", value :  10, fill : "silver"},
    {label :"Wind", value :  20, fill : "gold"},
    {label :"Moon", value :  8, fill : "lightblue"}
]

const svg_creator = (donnees, couleurs = [0], longueur = 350, margin = {left : 5, top : 5, bottom : 5, right : 5}) => {

    // Récupération du pie des données et de l'arc
    const pie = d3.pie().value(d => d.value)
    const data_pie = pie(donnees)
    const radius = longueur / 2
    const arc = d3.arc()
    .innerRadius(0)
    .outerRadius(radius)

    // Initialisation du svg
    const svg = d3.select("#d3_demo_bis")
        .attr("width", longueur)
        .attr("height", longueur)

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

}

svg_creator(databis)