import {
    executeSPARQLRequest,
    makeBarChartOption,
    makeNodeLinkChartOption,
    makePieChartOption
 } from "./modulesDependencies.js";

const makeMandatoryOption = (parameters) => {
    return {
        title : {
            text : parameters.title
        },
        dataZoom: {
            type: 'inside',
            
        },
        tooltip : {},
        legend : {
            right : 'right'
        }
    }
}

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

const loadChartViz = async (context, parameters) => {
    let nodeChart = echarts.init(document.getElementById(context))
    nodeChart.showLoading();

    const data = await executeSPARQLRequest(parameters.endpoint, parameters.query);

    let option = generateChart(data, parameters)

    nodeChart.hideLoading();
    nodeChart.setOption(option)
}
export default loadChartViz;