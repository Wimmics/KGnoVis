const buildLink = (result, config, nodes) => {
    let values = []
    for(const row of result["results"]["bindings"]){
        for(const conf of config){
            let id_source
            nodes.forEach(node => {
                if(node.name === row[conf.source]["value"]){
                    id_source = node.id
                }
            })

            let id_target
            nodes.forEach(node => {
                if(node.name === row[conf.target]["value"]){
                    id_target = node.id
                }
            })
            values.push(
                {source : id_source, target: id_target, label: {show: false, formatter: "{c}"}, value: row[conf.label]["value"]}
            )
        }
    }

    return values
}

const nodeAlreadyExist = (node, nodesList) => {

    for(let n of nodesList){
        if(n.id === node.id){
            return true
        }
    }
    return false;
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

const buildNodes = (result, config) => {
    const nodes = []

    for(const row of result["results"]["bindings"]){
        for(const conf of config){

            let submited_node_1 = {
                id : row[conf.source]["value"],
                name : row[conf.source]["value"],
                category: 0,
                symbolSize : 40,
                itemStyle : {
                    color : "#c71969",
                    borderType : 'solid',
                    borderColor : "grey"
                },
                label : {show : true}
            }

            if(!(nodeAlreadyExist(submited_node_1, nodes))){
                nodes.push(submited_node_1)
            }

            let submited_node_2 = {
                id : row[conf.target]["value"],
                name : row[conf.target]["value"],
                category: 1,
                symbolSize : 40,
                itemStyle : {
                    color: "green",
                    borderType : 'solid',
                    borderColor : "black"
                },
                label : {show : true}
            }

            if(!(nodeAlreadyExist(submited_node_2, nodes))){
                nodes.push(submited_node_2)
            }
        }
    }
    return nodes
}

const makeNodeLinkChartOption = (data, option, parameters) => {
    const nodes = buildNodes(data, parameters.config)
    const edges = buildLink(data, parameters.config, nodes)
    const categories = [parameters.config[0].source, parameters.config[0].target]
    option["series"] = [
        {
            name : parameters.titre,
            type : 'graph',
            data: nodes,
            links : edges,
            layout : 'force',
            roam : true,
            categories: categories,
            emphasis : {
                focus : 'adjacency',
                scale : true
            },
            force : {
                initLayout : null,
                repulsion : 1000,
                gravity : 0.2
            }
        }
    ]
}

export { makeNodeLinkChartOption }