
const GEOJSON_FILE_PATH = "../../lib/countries.geo.json"
let scale = 170
let width = 1024
let height = 660
let projection = d3.geoMercator().center([0, 40])

const loadJSONMap = async () => {
    return await new Promise((resolve, reject) => {
        try {
            resolve(d3.json(GEOJSON_FILE_PATH))
        } catch (err) {
            reject(`Could not resolve json: ${err}`)
        }
    }).then(p => p)

}

const drawSvgMap = async (context, data) => {

    let dataGeojsonPath = await loadJSONMap()

    // Get SVG context and parameters
    const canvas = d3.select(`#${context}`).append('svg').attr("class", `${context}-svg`).attr("width", width).attr("height", height)
    const svg = d3.select(`.${context}-svg`)

    // Create a color scale
    const color = d3.scaleOrdinal()
        .domain(data.map(d => d.name))
        .range(d3.schemePaired);

    // Add a scale for bubble size
    const valueExtent = d3.extent(data, d => +d.coordinate.value)
    const size = d3.scaleSqrt()
        .domain(valueExtent)  // What's in the data
        .range([1, 10])  // Size in pixel

    // Draw the map
    let mapGroup = svg.append("g")
        .attr('class', 'map-group')

    mapGroup.selectAll("path")
        .data(dataGeojsonPath.features)
        //.data(topojson.feature(dataGeojsonPath, dataGeojsonPath.objects.countries).features)
        .join("path")
        .attr('class', 'map-tiles')
        .attr("fill", "#b8b8b8")
        .attr('stroke', "#000")
        .attr("d", d3.geoPath()
            .projection(projection.translate([width / 2, height / 2]))
        )
        .style("opacity", .3)

    // Add circles:
    const t = svg.selectAll("myCircles")
        .data(data)
        .join("circle")
        .attr("class", "user-dot")
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
        .html("Geolocalisation des endpoints")
        .style("font-size", 14)

    // Define a zoom event and a handle behaviour
    const zoom = d3.zoom().scaleExtent([1, 8]).on('zoom', zoomTransformation);
    svg.call(zoom)
    return svg
}


const zoomTransformation = (e) => {
    d3.selectAll('.map-tiles')
        .transition()
        .duration(50)
        .attr('transform', e.transform)

    //const zoomPath = d3.geoPath().projection(projection.scale(e.transform * scale).translate([width / 2, height / 2]))
    const current_radius = d3.selectAll(".user-dot").attr("r")
    d3.selectAll(".user-dot").attr('transform', e.transform).attr('r', current_radius)
    //.attr("cx", d => projection([+d.coordinate.longitude, +d.coordinate.latitude])[0])
    //.attr("cy", d => projection([+d.coordinate.longitude, +d.coordinate.latitude])[1])
}


const render = (ctx, data) => {
    return drawSvgMap(ctx, data)
}

export { render };