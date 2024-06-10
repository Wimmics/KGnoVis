import {
    executeSPARQLRequest,
    makeBarChartOption,
    makeDotMapOption,
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
    switch (parameters.type) {
        case 'bar': makeBarChartOption(data, option, parameters); break;
        case 'pie': makePieChartOption(data, option, parameters); break;
        case 'graph': makeNodeLinkChartOption(data, option, parameters); break;
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
    /*let visualisation = echarts.init(document.getElementById(context), null, {
        renderer: 'canvas',
        useDirtyRect: false
    })
    visualisation.showLoading();*/

    const data = await executeSPARQLRequest(parameters.endpoint, parameters.query);
    let option = generateChart(context, data, parameters)

    /*visualisation.hideLoading();
    visualisation.setOption(option)



    visualisation.on('click', (params) => {
        //Get the specific object
        if(params.componentType === 'series'){
            if(params.dataType === 'node'){
                for(const serie of option.series){
                    console.log(params.dataIndex)
                    console.log(serie.data[params.dataIndex])
                }
            }else if(params.dataType === 'edge'){
                for(const serie of option.series){
                    console.log(params.dataIndex)
                    console.log(serie.links[params.dataIndex])
                }
            }
        }
        //window.open(params.name)
    })*/
}

export default loadChartViz;