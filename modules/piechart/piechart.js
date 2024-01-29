/**
 * 
 * @param {SPARQL_Result} results 
 * @param {Vizu_variables_parameters} config 
 * @returns 
 */
const buildSeries = (results, config) => {
    let data = []
    for(const row of results["results"]["bindings"]){
        for(const conf of config){
            data.push({
                name:row[conf.label]["value"],
                value: row[conf.value]["value"]
            })
        }
    }

    return data
}

const makePieChartOption = (data, option, parameters) => {
    const series_value = buildSeries(data, parameters.config)

    option["series"] = [
        {
            name: parameters.label,
            radius: "40%",
            type : 'pie',
            center: ['30%', '50%'],
            data : series_value
        }
    ]
}

export { makePieChartOption }