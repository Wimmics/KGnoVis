const buildLink = (result, config, nodes) => {
    let values = []
    for(const row of result["results"]["bindings"]){
        for(const conf of config.config){
            let id_source, id_target;

            for(let node of nodes){
                if(node.name === row[conf.source]["value"]){
                    id_source = node.id
                }

                if(node.name === row[conf.target]["value"]){
                    id_target = node.id
                }
            }

            let obj = {
                source : id_source,
                target: id_target,
                //label: {show: false, formatter: "{c}"},
                value: result["head"]["vars"].includes(conf.label) ? row[conf.label]["value"] : conf.label,
            }

            if(config.oriented){
                obj["symbolSize"] = 10
                /*obj["lineStyle"] = {
                    curveness: 0.2
                }*/
            }
            values.push(obj)
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

const getColorNode = (name, config) => {
    for(let option of config.options){
        if(option.name === name){
            return option.color
        }
    }
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

const buildNodes = (result, parameters) => {
    const nodes = []
    let color
    for(const row of result["results"]["bindings"]){
        for(const conf of parameters.config){
            color = parameters.options ? getColorNode(conf.source, parameters) : ""
            let submited_node_1 = {
                id : row[conf.source]["value"],
                name : row[conf.source]["value"],
                category: 0,
                symbolSize : 40,
                itemStyle : {
                    color: color,
                    borderType : 'solid',
                    borderColor : "grey"
                },
                //label : {show : true}
            }

            if(!(nodeAlreadyExist(submited_node_1, nodes))){
                nodes.push(submited_node_1)
            }
            color = parameters.options ? getColorNode(conf.target, parameters) : ""
            let submited_node_2 = {
                id : row[conf.target]["value"],
                name : row[conf.target]["value"],
                category: 1,
                symbolSize : 40,
                itemStyle : {
                    color: color,
                    borderType : 'solid',
                    borderColor : "black"
                },
                //label : {show : true}
            }

            if(!(nodeAlreadyExist(submited_node_2, nodes))){
                nodes.push(submited_node_2)
            }
        }
    }
    return nodes
}

const makeNodeLinkChartOption = (data, option, parameters) => {
    const nodes = buildNodes(data, parameters)
    const edges = buildLink(data, parameters, nodes)
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
            edgeSymbol: parameters.oriented ? ['none', 'arrow'] : ['none','none'],
            emphasis : {
                focus : 'adjacency',
                scale : true
            },
            force : {
                initLayout : null,
                repulsion : 100000,
                gravity : 8,
                layoutAnimation: parameters.animation
            }
        }
    ]
}

export { makeNodeLinkChartOption }