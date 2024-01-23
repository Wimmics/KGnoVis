/**
 * 
 * @param {SPARQL_Result} results 
 * @param {Vizu_variables_parameters} config 
 * @returns 
 */
const buildSeries = (results, config) => {
    let label = []
    let data = []
    //TODO: Implementation
    return data
}

const makePieChartOption = (data, option, parameters) => {
    series_value = buildSeries(data, parameters.association)
    option["series"] = [
        {
            name: parameters.name,
            type : 'pie',
            data : series_value
        }
    ]
}

export { makePieChartOption }