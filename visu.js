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

const buildNodes = (result, binding_association) => {
    let nodes = []
    let i = 0
    result["results"]["bindings"].forEach(row => {
        binding_association.forEach(association_rule => {

            let submited_node_1 = {
                id : i,
                //id : row[association_rule.variable]["value"],
                name : row[association_rule.variable]["value"],
                value : row[association_rule.variable]["value"]
            }
            i++
            
            if(!(nodeAlreadyExist(submited_node_1, nodes))){
                nodes.push(submited_node_1)
            } else {
                i--
            }

            let submited_node_2 = {
                id : i,
                //id : row[association_rule.associatedVariable]["value"],
                name : row[association_rule.associatedVariable]["value"],
                value : row[association_rule.associatedVariable]["value"]
            }
            i++

            if(!(nodeAlreadyExist(submited_node_2, nodes))){
                nodes.push(submited_node_2)
            }else{
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
            force : {
                initLayout : null,
                repulsion : 50,
                gravity : 0.9
            }
        }
    ]
    console.log(option)
}

const generateChart = (data, configuration) => {
    let option = makeMandatoryOption(configuration)
    if (configuration.type === 'bar'){
        makeBarChartOption(data, option, configuration)
    } else if(configuration.type === 'pie') {
        makePieChartOption(data, option, configuration)
    } else if (configuration.type === 'graph'){
        makeNodeLinkChartOption(data, option, configuration)
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