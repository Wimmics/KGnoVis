import {
    executeSPARQLRequest,
    makeBarChartOption,
    makeDotMapOption,
    makeNodeLinkChartOption,
    makeTreeMapChartOption,
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
        title: {
            text: parameters.title
        },
        dataZoom: {
            type: 'inside'
        },
        tooltip: {},
        legend: {
            right: 'right',
            type: 'scroll',
            orient: 'vertical',
            textStyle: {
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
const generateChart = (context, data, parameters) => {
    let option = makeMandatoryOption(parameters)
    let visualisation
    switch (parameters.type) {
        case 'bar':
            visualisation = echarts.init(
                document.querySelector(`#${context}`),
                null,
                {
                    renderer: 'canvas',
                    useDirtyRect: false
                })
            visualisation.showLoading();
            option = makeBarChartOption(context, data, option, parameters);

            visualisation.hideLoading();
            visualisation.setOption(option)
            break;
        case 'pie':
            visualisation = echarts.init(
                document.querySelector(`#${context}`),
                null,
                {
                    renderer: 'canvas',
                    useDirtyRect: false
                })
            visualisation.showLoading();
            makePieChartOption(data, option, parameters);
            visualisation.hideLoading();
            visualisation.setOption(option)
            break;
        case 'graph':
            visualisation = echarts.init(
                document.querySelector(`#${context}`),
                null,
                {
                    renderer: 'canvas',
                    useDirtyRect: false
                })
            visualisation.showLoading();
            makeNodeLinkChartOption(data, option, parameters);
            visualisation.hideLoading();
            visualisation.setOption(option)
            break;
        case 'treemap': makeTreeMapChartOption(data, option, parameters); break;
        case 'map': makeDotMapOption(context, data, option, parameters); break;
        default: throw new Error("Not implemented yet.");
    }
    return option


}

/**
 * Base function that load chart generation process
 * @param {HTMLTagID} context 
 * @param {Parameters_object} parameters 
 */
const loadChartViz = async (context, parameters) => {

    const data = await executeSPARQLRequest(parameters.endpoint, parameters.query);
    let option = generateChart(context, data, parameters)

}

export default loadChartViz;