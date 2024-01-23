/**
 * This function extract all categories in the sparql result in a variable
 * Usage: get all category to harmononize and complete barchart to avoid missing and/or misaligne values
 * @param {SPARQL_Result} results 
 * @param {Vizu_variables_parameters} config 
 * @returns 
 */
const labelExtraction = (results,config) => {
    const categories = [];
    results.forEach(row => {
        if(!categories.includes(row[config.category]["value"])){
            categories.push(row[config.category]["value"])
        }
    });
    return categories
}

/**
 * This function link data label with data category to be sorted as intended.
 * Values in sparql can be not ordered (misalign) or missing (due to count(0) for example).
 * @param {SPARQL_result} results 
 * @param {Vizu_variables_parameters} config 
 * @returns data
 */
const labelCategoryLinking = (results, config) => {
    let data = {}
    let categories = labelExtraction(results, config);

    results.forEach(row => {

        let key = config.label?row[config.label]["value"]:""

        if(!data.hasOwnProperty(key)){
            data[key] = {}
            categories.forEach( category => {
                data[key][category] = 0
            })
        }
        data[key][row[config.category]["value"]] = row[config.value]["value"]
    })
    return data
}

/**
 * This function builds the complient data object format for the visualisation 
 * based on the SPARQL variables given in the config object. This implementation
 * is currently based on ECharts data object and is only complient with ECharts engine.
 * @param {SPARQL_result} results 
 * @param {Vizu_variables_parameters} config 
 * @returns [label, series]
 */
const buildSeries = (results, config) => {
    let series = []
    let label = []

    let data = labelCategoryLinking(results["results"]["bindings"], config[0])
    
    for(let key in data){

        label.push(key)

        for(let subkey in data[key]){
            let element = series.find(elt => elt.name === subkey)
            if(element){
                element.data.push({name : key, value: parseInt(data[key][subkey])})
            }else{
                series.push({
                    name: subkey,
                    type : 'bar',
                    colorBy: 'series',
                    emphasis : {
                        focus : 'series'
                    },
                    data: [{name: key, value: parseInt(data[key][subkey])}]
                })
            }

        }
    }
    return [label, series]
}

const makeBarChartOption = (data, option, parameters) => {

    let series_value = buildSeries(data, parameters.config);
    console.log(series_value[0])

    option["yAxis"] = [{
        type: 'value'
    }]
    option["xAxis"] = [{
        type : "category",
    }]
    option["series"] = series_value[1]
}

export { makeBarChartOption };