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

