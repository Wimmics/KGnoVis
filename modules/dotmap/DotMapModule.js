import { render as D3_Render } from "./D3GgeojsonRender.js"
import { render as leafletRender } from "./LeafletRender.js"

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

const makeDotMapOption = (context, data, option, parameters) => {
    const geoData = buildGeoData(data, parameters)

    let map;
    console.log(parameters)

    switch (parameters.option.render) {
        case "leaflet":
            map = leafletRender(context, geoData)
            break;
        case "simple":
            map = D3_Render(context, geoData)
            break;
        default:
            console.log("Error engine specification, simple engine is taken.")
            map = D3_Render(context, geoData)
    }
}

export { makeDotMapOption }