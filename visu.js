const executeSPARQLRequest = async (endpoint, query) => {
    const url = endpoint + "?query=" + encodeURIComponent(query) + "&format=json";
    return await fetch(url).then( response => response.json()).then(data => {return data})
}

/**
 * This function link data label with data category to be sorted as intended
 * Values in sparql can be not orderer or missing
 * @param {SPARQL_result} results 
 * @param {Vizu_variables_parameters} config 
 * @returns data
 */
const labelCategoryLinking = (results, config) => {
    let data = {}
    results.forEach(row => {

        key = config.label?row[config.label]["value"]:""

        /**
         * If key already exist, add new category value
         * Else, add new category
         */
        if(data.hasOwnProperty(key)){
            data[key][row[config.category]["value"]] = row[config.value]["value"]
        }else{
            data[key] = {}
            category = row[config.category]["value"]
            value = row[config.value]["value"]
            data[key][category] = value
        }  
    })
    return data
}

const buildSeries = (result, config) => {
    let series = []
    let label = []

    data = labelCategoryLinking(result["results"]["bindings"], config[0])
    
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

const buildLink = (result, binding_association, nodes) => {
    let values = []

    result["results"]["bindings"].forEach(row => {
        binding_association.forEach(association_rule => {
            let id_source
            nodes.forEach(node => {
                if(node.name === row[association_rule.variable]["value"]){
                    id_source = node.id
                }
            })

            let id_target
            nodes.forEach(node => {
                if(node.name === row[association_rule.associatedVariable]["value"]){
                    id_target = node.id
                }
            })

            values.push(
                {source : id_source, target: id_target}
            )
        })
    })
    return values
}

const nodeAlreadyExist = (node, nodesList) => {
    let exist = false;
    nodesList.forEach(n => {
        if(n.name === node.name){
            exist = true
        }
    })
    return exist;
}

const increaseSizeOfNode = (node, nodesList, size) => {
    let updateList = []

    nodesList.forEach(n => {
        if(n.name === node.name){
            updateList.push({
                id : n.id,
                name : n.name,
                value : n.value,
                symbolSize: n.symbolSize + size,
                itemStyle : n.itemStyle,
                label : n.label
            })
        }else{
            updateList.push(n)
        }
    })

    return updateList
}

const buildNodes = (result, binding_association) => {
    let nodes = []
    let i = 0

    result["results"]["bindings"].forEach(row => {
        binding_association.forEach(association_rule => {

            let submited_node_1 = {
                id : i,
                name : row[association_rule.variable]["value"],
                value : row[association_rule.variable]["value"],
                symbolSize : 10,
                itemStyle : {
                    color : "#c71969",
                    borderType : 'solid',
                    borderColor : "grey"
                }
            }
            i++
            
            if(!(nodeAlreadyExist(submited_node_1, nodes))){
                nodes.push(submited_node_1)
            } else {
                nodes = increaseSizeOfNode(submited_node_1, nodes, 1)
                i--
            }

            let submited_node_2 = {
                id : i,
                name : row[association_rule.associatedVariable]["value"],
                value : row[association_rule.associatedVariable]["value"],
                symbolSize : 10,
                itemStyle : {
                    color: "green",
                    borderType : 'solid',
                    borderColor : "black"
                },
                label : {show : true}
            }
            i++

            if(!(nodeAlreadyExist(submited_node_2, nodes))){
                nodes.push(submited_node_2)
            }else{
                nodes = increaseSizeOfNode(submited_node_2, nodes, 1)
                i--
            }
            
        })
    })
    return nodes
}

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

const makeBarChartOption = (data, option, parameters) => {

    series_value = buildSeries(data, parameters.config);
    //label = buildSeries(data, configuration.association)
    console.log(series_value[0])

    option["yAxis"] = [{
        type: 'value'
    }]
    option["xAxis"] = [{
        type : "category",
    }]
    option["series"] = series_value[1]
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

const makeNodeLinkChartOption = (data, option, parameters) => {
    nodes = buildNodes(data, parameters.config)
    links = buildLink(data, parameters.config, nodes)
    option["series"] = [
        {
            name : parameters.name,
            type : 'graph',
            data: nodes,
            links : links,
            layout : 'force',
            roam : true,
            emphasis : {
                focus : 'adjacency',
                scale : true
            },
            force : {
                initLayout : null,
                repulsion : 250,
                gravity : 0.2
            }
        }
    ]
}

const makeTreeMapChartOption = (data, option, parameters) => {
    option["series"] = [
        {
            type : 'treemap',
            label: {
                show: true,
                formatter: '{b}'
              },
              upperLabel: {
                show: true,
                height: 30
              },
              itemStyle: {
                borderColor: '#fff'
              },
            data : [
                {
                    name : "nodeA",
                    children : [
                        {
                            name : "nodeA-A",
                            value : 4
                        },
                        {
                            name : "nodeA-B",
                            value : 6
                        }
                    ]
                },
                {
                    name : "nodeB",
                    children : [
                        {
                            name : "nodeB-A",
                            value : 15,
                            children : [
                                {
                                    name : "nodeB-A-A",
                                    value : 9
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
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

    data = await executeSPARQLRequest(parameters.endpoint, parameters.query);

    let option = generateChart(data, parameters)

    nodeChart.hideLoading();
    nodeChart.setOption(option)
}