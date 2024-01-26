import {
    executeSPARQLRequest,
    makeBarChartOption,
    makeNodeLinkChartOption,
    makePieChartOption
 } from "./visualisationManagerDependencies.js";

 /**
  * This function add **mandatory field** for the visualisation object such as:
  * - The title of the visualisation
  * - The possibility to zoom
  * - The display of the legend
  * @param {Parameters_object} parameters 
  */
const makeMandatoryOption = (parameters) => {
    return {
        title : {
            text : parameters.title
        },
        dataZoom: {
            type: 'inside',
            
        },
        tooltip : {},
        animation: false,
        legend : {
            right : 'right',
            type: 'scroll',
            orient: 'vertical',
            textStyle : {
                fontSize: 10,
                width: '150',
                overflow: 'truncate',
                ellipsis: "..."
            }
        }
    }
}

/**
 * This function generate the intended visualisation
 * @param {SPARQL_Result} data 
 * @param {Parameters_object} parameters 
 * @returns {Object_option}
 */
const generateChart = (data, parameters) => {
    let option = makeMandatoryOption(parameters)
    if (parameters.type === 'bar'){
        makeBarChartOption(data, option, parameters)
    } else if(parameters.type === 'pie') {
        makePieChartOption(data, option, parameters)
    } else if (parameters.type === 'graph'){
        makeNodeLinkChartOption(data, option, parameters)
    } else if (parameters.type === 'treemap'){
        makeTreeMapChartOption(data, option, parameters)
    }
    return option


}

/**
 * Base function that load chart generation process
 * @param {HTMLTagID} context 
 * @param {Parameters_object} parameters 
 */
const loadChartViz = async (context, parameters) => {
    let nodeChart = echarts.init(document.getElementById(context))
    nodeChart.showLoading();

    const data = await executeSPARQLRequest(parameters.endpoint, parameters.query);

    let option = generateChart(data, parameters)

    nodeChart.hideLoading();
    nodeChart.setOption(option)
}
export default loadChartViz;