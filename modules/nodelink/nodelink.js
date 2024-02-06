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

            let value = ""
            if(result["head"]["vars"].includes(conf.relation)){
                value = row[conf.relation]["value"]
            }else if(conf.hasOwnProperty("relation")){
                value = conf.relation
            }else{ 
                value = `${conf.source} -> ${conf.target}`
            }

            let obj = {
                source : id_source,
                target: id_target,
                value: value,
                label: {
                    show: conf.show,
                    formatter: "{c}"
                }
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

const getShowLabelNode = (name, parameters) => {
    for(const option of parameters.options){
        if (option.hasOwnProperty("show") && option.name === name){
            return option.show
        }
    }
    return false
}

const buildNodes = (result, parameters, categories) => {
    const nodes = []
    let color
    let show
    for(const row of result["results"]["bindings"]){
        for(const conf of parameters.config){
            color = parameters.options ? getColorNode(conf.source, parameters) : "black"
            show = parameters.options ? getShowLabelNode(conf.source, parameters) : false
            let submited_node_1 = {
                id : row[conf.source]["value"],
                name : row[conf.source]["value"],
                category: getCategory(row, conf, result["head"], categories),
                symbolSize : 25,
                itemStyle : {
                    color: color,
                    borderType : 'solid',
                    borderColor : "grey"
                },
                label : {show : show, format: '{c}'}
            }
            if(!(nodeAlreadyExist(submited_node_1, nodes))){
                nodes.push(submited_node_1)
            }

            color = parameters.options ? getColorNode(conf.target, parameters) : "white";
            show = parameters.options ? getShowLabelNode(conf.target, parameters) : false
            let submited_node_2 = {
                id : row[conf.target]["value"],
                name : row[conf.target]["value"],
                category: getCategory(row, conf, result["head"], categories),
                symbolSize : 25,
                itemStyle : {
                    color: color,
                    borderType : 'solid',
                    borderColor : "black"
                },
                label : {show : show, format: '{b}'}
            }
            if(!(nodeAlreadyExist(submited_node_2, nodes))){
                nodes.push(submited_node_2)
            }
        }
    }
    return nodes
}

const getCategory = (row, conf, header,categories) => {
    if(!conf.hasOwnProperty('relation')){
        return categories.indexOf(`${conf.source} -> ${conf.target}`)
    }else if(!header['vars'].includes(conf.relation)){
        return categories.indexOf(conf.relation)
    }
    return categories.indexOf(row[conf.relation]["value"])
}

const getCategories = (data, parameters) => {
    const categories = []
    for(const row of data["results"]["bindings"]){
        for(const conf of parameters.config){
            if(!conf.hasOwnProperty("relation")){
                if(!categories.includes(`${conf.source} -> ${conf.target}`)){
                    categories.push(`${conf.source} -> ${conf.target}`)
                }
            }else if(data["head"]["vars"].includes(conf.relation) && !categories.includes(row[conf.relation]["value"])){
                categories.push(row[conf.relation]["value"])
            }else if(!data["head"]["vars"].includes(conf.relation) && !categories.includes(conf.relation)){
                categories.push(conf.relation)
            }else{

            }
            
        }
    }
    return categories
}

const setLayoutDisplay = (options, parameters) => {
    for(const series of options){
        switch(parameters.display) {
            case "force":
                series["layout"] = 'force';
                series["force"] = {
                    initLayout : null,
                    repulsion : 100000,
                    gravity : 10,
                    layoutAnimation: false
                }
                break;
            case "circular":
                series["layout"] = 'circular';
                break;
            default:
                throw new Error("Layout system error: display value must be a string fill with 'force' or 'circular'.")
        }
    }
    
}

const makeNodeLinkChartOption = (data, option, parameters) => {

    const categories = getCategories(data, parameters)
    const nodes = buildNodes(data, parameters, categories)
    const edges = buildLink(data, parameters, nodes)
    option["series"] = [
        {
            //name : "test",
            type : 'graph',
            data: nodes,
            links : edges,
            roam : true,
            categories: categories,
            edgeSymbol: parameters.oriented ? ['none', 'arrow'] : ['none','none'],
            emphasis : {
                focus : 'adjacency',
                scale : true
            }            
        }
    ];

    setLayoutDisplay(option["series"], parameters);
}

export { makeNodeLinkChartOption }