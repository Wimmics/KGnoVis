const executeSPARQLRequest = async (endpoint, query) => {
    const url = endpoint + "?query=" + encodeURIComponent(query) + "&format=json";
    return await fetch(url).then( response => response.json()).then(data => {return data})
}

const buildSeries = (result, binding_association) => {
    let values = []
    
    result["results"]["bindings"].forEach(row => {
        binding_association.forEach(association_rule => {
            let name = association_rule.hasOwnProperty("name") ? row[association_rule.name]["value"] : row[association_rule.variable]["value"];
            values.push(
                {
                    id: row[association_rule.variable]["value"],
                    name : name,
                    value: row[association_rule.associatedVariable]["value"],
                }
            )
        })
    })
    return values
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

const makeMandatoryOption = (configuration) => {
    return {
        title : {
            text : configuration.title
        },
        tooltip : {},
        legend : {
            right : 'right'
        }
    }
}

const makeBarChartOption = (data, option, configuration) => {

    series_value = buildSeries(data, configuration.association);
    //label = buildSeries(data, configuration.association)

    option["xAxis"] = {
        type: 'category',
        data : []
    }
    option["yAxis"] = {}
    option["series"] = [
        {
            name: configuration.name,
            type: 'bar',
            data: series_value
        }
    ]
}

const makePieChartOption = (data, option, configuration) => {
    series_value = buildSeries(data, configuration.association)
    option["series"] = [
        {
            name: configuration.name,
            type : 'pie',
            data : series_value
        }
    ]
}

const makeNodeLinkChartOption = (data, option, configuration) => {
    nodes = buildNodes(data, configuration.association)
    links = buildLink(data, configuration.association, nodes)
    option["series"] = [
        {
            name : configuration.name,
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
    console.log(option)
}

const makeTreeMapChartOption = (data, option, configuration) => {
    option["series"] = [
        {
            type : 'treemap',
            data : [
                {
                    name : "nodeA",
                    value : 10,
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
                    value : 20,
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

const generateChart = (data, configuration) => {
    let option = makeMandatoryOption(configuration)
    if (configuration.type === 'bar'){
        makeBarChartOption(data, option, configuration)
    } else if(configuration.type === 'pie') {
        makePieChartOption(data, option, configuration)
    } else if (configuration.type === 'graph'){
        makeNodeLinkChartOption(data, option, configuration)
    } else if (configuration.type === 'treemap'){
        makeTreeMapChartOption(data, option, configuration)
    }
    return option


}

const loadChartViz = async (context, configuration) => {
    let nodeChart = echarts.init(document.getElementById(context))
    nodeChart.showLoading();

    data = await executeSPARQLRequest(configuration.endpoint, configuration.query);

    let option = generateChart(data, configuration)

    nodeChart.hideLoading();
    nodeChart.setOption(option)
}