import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm"

const dataset_piechart = [
    {label :"Clouds", value : 12},
    {label :"Flower", value : 19},
    {label :"Snow", value :  10},
    {label :"Wind", value :  20},
    {label :"Moon", value :  8}
]

const couleurs = ["green", "steelblue", "gold", "gray", "crimson"]

const piechart_creator = (data, colors = 0, width = 400, height = 400) => {

    const longueur = Math.min(width, height)

    let pie = []
    let data_pie = []

    try{
        pie = d3.pie().value(d => d.value)
        data_pie = pie(data)
    } catch (error) {
        console.log("Le dataset ne peut être pie : ", error)
    }
    // Récupération du pie des données et de l'arc
    
    const radius = longueur / 2

    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius)

    // Initialisation du svg
    
    const svg = d3.select("#d3_piechart").attr("width", width).attr("height", height)

    const group = svg.append("g")
        .attr("transform", "translate(" + (width) / 2 + "," + (height) / 2 + ")")


    // Récupération des labels et des colors

    let keys = []

    try {
        data.forEach(d => {
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
        .attr("fill", "white")
        .attr("text-anchor", "middle")
        .style("font", "16px times")
        .attr("transform", function(d) { 
                 return "translate(" + label.centroid(d) + ")"; 
         })
     
}

piechart_creator(dataset_piechart)