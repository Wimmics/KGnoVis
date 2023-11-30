import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm"

const data = [
    { category: "A", value1: 10, value2: 5 },
    { category: "B", value1: 20, value2: 8 },
    { category: "C", value1: 15, value2: 12 },
    { category: "D", value1: 25, value2: 18 }
  ]



const graph2 = () => {
    const width = 960
    const height = 500
    const svg = d3.select("#d3_demo_bis").attr("width", width).attr("height", height)

    const x_scale = d3.scaleBand().domain(data.map(d => d.category)).range([0, width]).padding(0.1)
      
    const y_scale = d3.scaleLinear().domain([0, d3.max(data, d => Math.max(d.value1, d.value2))]).range([height, 0])    


    svg.selectAll("rect").data(data).join("rect").attr("class", "bar1")
        .attr("x", d => x_scale(d.category)).attr("y", d => y_scale(d.value1))
        .attr("width", x_scale.bandwidth() / 2).attr("height", d => height - y_scale(d.value1))
        .attr("fill", "steelblue")

    svg.selectAll("serie2").data(data).join("rect").attr("class", "bar2")
        .attr("x", d => x_scale(d.category) + x_scale.bandwidth() / 2).attr("y", d => y_scale(d.value2))
        .attr("width", x_scale.bandwidth() / 2).attr("height", d => height - y_scale(d.value2))
        .attr("fill", "orange")
}

graph2()