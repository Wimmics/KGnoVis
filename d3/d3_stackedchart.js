import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm"

const databis = [
    {category :"Clouds", values : [{value : 5, label : "Wolf"}, {value : 8, label : "Eagle"}, {value : 12, label : "Deer"}, {value : 7, label : "Lion"}, {value : 9, label : "Dragon"}], fill : "black"},
    {category :"Flower", values : [{value : 10, label : "Wolf"}, {value : 20, label : "Eagle"}, {value : 15, label : "Deer"}, {value : 25, label : "Lion"}, {value : 30, label : "Dragon"}], fill : "crimson"},
    {category :"Snow", values :  [{value : 6, label : "Wolf"}, {value : 8, label : "Eagle"}, {value : 2, label : "Deer"}, {value : 4, label : "Lion"}, {value : 5, label : "Dragon"}], fill : "silver"},
    {category :"Wind", values :  [{value : 20, label : "Wolf"}, {value : 30, label : "Eagle"}, {value : 10, label : "Deer"}, {value : 12, label : "Lion"}, {value : 18, label : "Dragon"}], fill : "gold"},
    {category :"Moon", values :  [{value : 14, label : "Wolf"}, {value : 16, label : "Eagle"}, {value : 24, label : "Deer"}, {value : 8, label : "Lion"}, {value : 17, label : "Dragon"}], fill : "lightblue"}
]


const colors = ["black", "crimson", "silver", "gold", "steelblue"]

const svg_creator = (donnees, couleurs = [0], vertical_bar = true, is_log = false, longueur = 380) => {

    const margin = {left : 5, top : 5, bottom : 5, right : 5}
    let color = []

    donnees.forEach(d => {
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

    const svg = d3.select("#stacked").attr("width", longueur + margin.left + margin.right).attr("height", longueur + margin.top + margin.bottom)

    const x_scale = d3.scaleBand()
        .domain(dataset.map(d => d.group))
        .range([0, longueur])
        .padding(0.1)
  
  // Set up the y scale
    const y_scale = d3.scaleLinear()
        .domain([0, d3.max(dataset, d => d.Clouds + d.Flower + d.Snow + d.Wind + d.Moon)])
        .range([longueur, 0])

    svg.append("g")
    .selectAll("g")
    .data(item)
    .enter().append("g")
        .attr("fill", (d,i) => color[i])
    .selectAll("rect")
    .data(d => d)
    .enter().append("rect")
        .attr("x", d => x_scale(d.data.group))
        .attr("y", d => y_scale(d[1]))
        .attr("height", d => y_scale(d[0]) - y_scale(d[1]))
        .attr("width", x_scale.bandwidth())

    // Add axes
    svg.append("g")
    .attr("transform", `translate(0,${longueur})`)
    .call(d3.axisBottom(x_scale))

    svg.append("g")
        .call(d3.axisLeft(y_scale))


}

svg_creator(databis, colors)