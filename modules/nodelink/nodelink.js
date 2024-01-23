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

export { makeNodeLinkChartOption }