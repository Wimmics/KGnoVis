import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm"

const data = [
    { category: "A", value1: 10, value2: 5, value3: 6, value4: 7, value5 : 12},
    { category: "B", value1: 20, value2: 8 },
    { category: "C", value1: 15, value2: 12 },
    { category: "D", value1: 25, value2: 18 }
  ]

const dataset = {
    category : ["A", "B", "C", "D", "E"],
    value1 : [10, 20, 15, 25, 30],
    value2 : [5, 8, 12 , 7, 10],
    value3 : [6, 8, 2, 4, 5],
    value4 : [20, 30, 10, 12, 18],
    value5 : [14, 16, 24, 8, 17]
}

const databis = [
    {category :"A", values : [10, 20, 15, 25, 30]},
    {category :"B", values : [5, 8, 12 , 7, 10]},
    {category :"C", values :  [6, 8, 2, 4, 5]},
    {category :"D", values :  [20, 30, 10, 12, 18]},
    {category :"E", values :  [14, 16, 24, 8, 17]}
]

const graph3 = () => {
    const width = 400
    const height = 300
    const svg = d3.select("#d3_demo_3").attr("width", width).attr("height", height)

    const x_scale = d3.scaleBand().domain(data.map(d => d.category)).range([0, width]).padding(0.1)
      
    const y_scale = d3.scaleLinear().domain([0, d3.max(data, d => Math.max(d.value1, d.value2))]).range([height, 0])    


    svg.selectAll("serie1").data(data).join("rect").attr("class", "bar1")
        .attr("x", d => x_scale(d.category)).attr("y", d => y_scale(d.value1))
        .attr("width", x_scale.bandwidth() / 2).attr("height", d => height - y_scale(d.value1))
        .attr("fill", "green")

    svg.selectAll("serie2").data(data).join("rect").attr("class", "bar2")
        .attr("x", d => x_scale(d.category) + x_scale.bandwidth() / 2).attr("y", d => y_scale(d.value2))
        .attr("width", x_scale.bandwidth() / 2).attr("height", d => height - y_scale(d.value2))
        .attr("fill", "orange")
}

//graph3()

/*const graph4 = () => {
    const width = 400
    const height = 300
    const svg = d3.select("#d3_demo_3").attr("width", width).attr("height", height)

    const x_scale = d3.scaleBand().domain(dataset.category).range([0, width]).padding(0.1)
      
    const y_scale = d3.scaleLinear().domain([0, d3.max(dataset.value1)]).range([height, 0]) 

    svg.selectAll("rect")
        .data(dataset.value1)
        .enter()
        .append("rect")
        .attr("class", "")
        .attr("x", (d, i) => x_scale(dataset.category[i]))
        .attr("y", d => y_scale(d))
        .attr("width", x_scale.bandwidth())
        .attr("height", d => height - y_scale(d))
        .attr("fill", "steelblue");
}
*/


const instantsvg = (donnees) =>  {
    const width = 400
    const height = 300
    const taille = Object.keys(donnees).length

    const svg = d3.select("#d3_demo_3").attr("width", width).attr("height", height)

    const x_scale = d3.scaleBand().domain(donnees.map(d => d.category)).range([0, width]).padding(0.1)
      
    const y_scale = d3.scaleLinear().domain([0, donnees.map(d => Math.max(...d.values))]).range([height, 0]) 

    for (let i = 1; i < taille; i++) {
        svg.selectAll("rect")
        .data(donnees[Object.keys(donnees)[i]])
        .join("rect")
        .attr("class", "bar")
        .attr("x", (d, i) => x_scale(d.category) + (i-1)*(x_scale.bandwidth() / taille))
        .attr("y", d => y_scale(d))
        .attr("width", x_scale.bandwidth() / taille)
        .attr("height", d => height - y_scale(d))
        //.attr("fill", "steelblue");
    }

}

instantsvg(databis)