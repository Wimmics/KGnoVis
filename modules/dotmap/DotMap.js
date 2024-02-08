
const loadJSONMap = async () => {
    return await new Promise((resolve, reject) => {
        try {
            resolve(d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"))
        }catch(err){
            reject(`Could not resolve json: ${err}`)
        }
    }).then(p => p)

}
const buildGeoData = (results, parameters) => {
    const data = []
    for (const row of results.results.bindings) {
        for (const conf of parameters.config) {
            data.push({
                name: row[conf.label]["value"],
                coordinate: {
                    longitude: parseInt(row[conf.longitude]["value"]),
                    latitude: parseInt(row[conf.latitude]["value"]),
                    value: Math.floor(Math.random() * 100)
                }
            })
        }
    }
    return data
}

const drawSvgMap = async (context, data) => {

    let dataGeo = await loadJSONMap()

    // Get SVG context and parameters
    const svg = d3.select(`#${context}`),
        width = +svg.attr("width"),
        height = +svg.attr("height");

    // Map and projection
    const projection = d3.geoMercator()
        .center([0, 40])                // GPS of location to zoom on
        .scale(250)                       // This is like the zoom
        .translate([width / 2, height / 2])

    // Create a color scale
    const color = d3.scaleOrdinal()
        .domain(data.map(d => d.name))
        .range(d3.schemePaired);

    // Add a scale for bubble size
    const valueExtent = d3.extent(data, d => +d.coordinate.value)
    const size = d3.scaleSqrt()
        .domain(valueExtent)  // What's in the data
        .range([1, 20])  // Size in pixel

    // Draw the map
    svg.append("g")
        .selectAll("path")
        .data(dataGeo.features)
        .join("path")
        .attr("fill", "#b8b8b8")
        .attr("d", d3.geoPath()
            .projection(projection)
        )
        .style("stroke", "none")
        .style("opacity", .3)
    
    // Add circles:
    svg.selectAll("myCircles")
        .data(data)
        .join("circle")
        .attr("cx", d => projection([+d.coordinate.longitude, +d.coordinate.latitude])[0])
        .attr("cy", d => projection([+d.coordinate.longitude, +d.coordinate.latitude])[1])
        .attr("r", d => size(10))
        .style("fill", d => color(d.name))
        .attr("stroke", d => { if (d.n > 2000) { return "black" } else { return "none" } })
        .attr("stroke-width", 1)
        .attr("fill-opacity", .4)



    // Add title and explanation
    svg.append("text")
        .attr("text-anchor", "end")
        .style("fill", "black")
        .attr("x", width - 10)
        .attr("y", height - 30)
        .attr("width", 90)
        .html("Stations météo récupéré sur WeKG")
        .style("font-size", 14)

    // Add legend: circles
    /*const valuesToShow = [100, 4000, 15000]
    const xCircle = 40
    const xLabel = 90
    svg.selectAll("legend")
        .data(valuesToShow)
        .join("circle")
        .attr("cx", xCircle)
        .attr("cy", d => height - size(d))
        .attr("r", d => size(d))
        .style("fill", "none")
        .attr("stroke", "black")

    // Add legend: segments
    svg.selectAll("legend")
        .data(valuesToShow)
        .join("line")
        .attr('x1', d => xCircle + size(d))
        .attr('x2', xLabel)
        .attr('y1', d => height - size(d))
        .attr('y2', d => height - size(d))
        .attr('stroke', 'black')
        .style('stroke-dasharray', ('2,2'))

    // Add legend: labels
    svg.selectAll("legend")
        .data(valuesToShow)
        .join("text")
        .attr('x', xLabel)
        .attr('y', d => height - size(d))
        .text(d => d)
        .style("font-size", 10)
        .attr('alignment-baseline', 'middle')*/
    
    // Define a zoom event and a handle behaviour
    let zoom = d3.zoom().on('zoom', zoomTransformation);
    // Attach zoom on svg
    d3.select('svg').call(zoom)
    return svg
}

const zoomTransformation = (e) => {
    
    console.log(e)
    console.log(e.target)

}

const makeDotMapOption = (context, data, option, parameters) => {

    const geoData = buildGeoData(data, parameters)
    console.log(geoData)
    const svg = drawSvgMap(context, geoData)

}

export { makeDotMapOption }