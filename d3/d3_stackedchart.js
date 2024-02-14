import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm"

const databis = [
    {category :"Clouds", values : [{value : 5, label : "Wolf"}, {value : 8, label : "Eagle"}, {value : 12, label : "Deer"}, {value : 7, label : "Lion"}, {value : 9, label : "Dragon"}], fill : "black"},
    {category :"Flower", values : [{value : 10, label : "Wolf"}, {value : 20, label : "Eagle"}, {value : 15, label : "Deer"}, {value : 25, label : "Lion"}, {value : 30, label : "Dragon"}], fill : "crimson"},
    {category :"Snow", values :  [{value : 6, label : "Wolf"}, {value : 8, label : "Eagle"}, {value : 2, label : "Deer"}, {value : 4, label : "Lion"}, {value : 5, label : "Dragon"}], fill : "silver"},
    {category :"Wind", values :  [{value : 20, label : "Wolf"}, {value : 30, label : "Eagle"}, {value : 10, label : "Deer"}, {value : 12, label : "Lion"}, {value : 18, label : "Dragon"}], fill : "gold"},
    {category :"Moon", values :  [{value : 14, label : "Wolf"}, {value : 16, label : "Eagle"}, {value : 24, label : "Deer"}, {value : 8, label : "Lion"}, {value : 17, label : "Dragon"}], fill : "lightblue"}
]


const colors = ["black", "crimson", "silver", "gold", "steelblue"]

const svg_creator = (donnees, couleurs = [0], vertical_bar = true, longueur = 380) => {

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

    const x_scale = d3.scaleBand()
        .domain(dataset.map(d => d.group))
        .range([0, longueur])
        .padding(0.1)
  
  // Set up the y scale
    const y_scale = d3.scaleLinear()
        .domain([0, d3.max(dataset, d => d.Clouds + d.Flower + d.Snow + d.Wind + d.Moon)])
        .range([longueur, 40])

    if (vertical_bar = true) {
        let group = svg.selectAll("g")
            .data(item)
            .join(
                enter => enter.append("g")
                        .attr("fill", (d,i) => color[i]),
                update => update,
                exit => exit.remove()
            )

        //console.log(item)
        //console.log(donnees)

        group.selectAll("rect")
            .data(d => d)
            .join(
                enter => enter.append("rect")
                        .attr("class", "stackedbar"),
                update => update,
                exit => exit.remove()
            )
            .attr("x", d => x_scale(d.data.group))
            .attr("y", d => y_scale(d[1])-10)
            .attr("height", d => (y_scale(d[0]) - y_scale(d[1])))
            .attr("width", x_scale.bandwidth())

    } else {
        let group = svg.selectAll("g")
        .data(item)
        .join(
            enter => enter.append("g")
                    .attr("fill", (d,i) => color[i]),
            update => update,
            exit => exit.remove()
        )

        //console.log(item)
        //console.log(donnees)

        group.selectAll("rect")
            .data(d => d)
            .join(
                enter => enter.append("rect")
                        .attr("class", "stackedbar"),
                update => update,
                exit => exit.remove()
            )
            .attr("y", d => x_scale(d.data.group))
            .attr("x", d => y_scale(d[1])-10)
            .attr("width", d => (y_scale(d[0]) - y_scale(d[1])))
            .attr("height", x_scale.bandwidth())
    }

    svg.selectAll("labels")
        .data(uniqueLabels).enter()
        .append("text")
        .attr("x", function(d,i){ return 15 + i*75})
        .attr("y", longueur)
        .text(function(d){ return d})
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")

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
}

svg_creator(databis, colors, false)