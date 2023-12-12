import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm"

const data = [
    { category: "A", value1: 10, value2: 5, value3: 6, value4: 7, value5 : 12},
    { category: "B", value1: 20, value2: 8 },
    { category: "C", value1: 15, value2: 12 },
    { category: "D", value1: 25, value2: 18 }
  ]

const dataset = {
    category : ["A", "B", "C", "D", "E"],
    value1 : [10, 20, 15, 25, 30],
    value2 : [5, 8, 12 , 7, 10],
    value3 : [6, 8, 2, 4, 5],
    value4 : [20, 30, 10, 12, 18],
    value5 : [14, 16, 24, 8, 17]
}

const databis = [
    {category :"A", values : [10, 20, 15, 25, 30]},
    {category :"B", values : [5, 8, 12 , 7, 9]},
    {category :"C", values :  [6, 8, 2, 4, 5]},
    {category :"D", values :  [20, 30, 10, 12, 18]},
    {category :"E", values :  [14, 16, 24, 8, 17]}
]

const datatris = [
    {category : "A", value1 : 10}, {category : "A", value1 : 20}, {category : "A", value1 : 15}, {category : "A", value1 : 25}, {category : "A", value1 : 30},
    {category : "B", value1 : 5}, {category : "B", value1 : 8}, {category : "B", value1 : 12}, {category : "B", value1 : 7}, {category : "B", value1 : 10}, 
    {category : "C", value1 : 6}, {category : "C", value1 : 8}, {category : "C", value1 : 2}, {category : "C", value1 : 4}, {category : "C", value1 : 5}, 
]

const datatest = [
    {category :"A", values : [10]},
    {category :"B", values : [5]}
]

// créer fonction qui prend 
/*
const graph3 = () => {
    const width = 400
    const height = 300
    const svg = d3.select("#d3_demo_3").attr("width", width).attr("height", height)

    const x_scale = d3.scaleBand().domain(data.map(d => d.category)).range([0, width]).padding(0.1)
      
    const y_scale = d3.scaleLinear().domain([0, d3.max(data, d => Math.max(d.value1, d.value2))]).range([height, 0])    


    svg.selectAll("serie1").data(data).join("rect").attr("class", "bar1")
        .attr("x", d => x_scale(d.category)).attr("y", d => y_scale(d.value1))
        .attr("width", x_scale.bandwidth() / 2).attr("height", d => height - y_scale(d.value1))
        .attr("fill", "green")

    svg.selectAll("serie2").data(data).join("rect").attr("class", "bar2")
        .attr("x", d => x_scale(d.category) + x_scale.bandwidth() / 2).attr("y", d => y_scale(d.value2))
        .attr("width", x_scale.bandwidth() / 2).attr("height", d => height - y_scale(d.value2))
        .attr("fill", "orange")
}

//graph3()


 const graph4 = () => {
    const width = 400
    const height = 300
    const svg = d3.select("#d3_demo_3").attr("width", width).attr("height", height)

    const x_scale = d3.scaleBand().domain(dataset.category).range([0, width]).padding(0.1)
      
    const y_scale = d3.scaleLinear().domain([0, d3.max(dataset.value1)]).range([height, 0]) 

    svg.selectAll("rect")
        .data(dataset.value1)
        .enter()
        .append("rect")
        .attr("class", "")
        .attr("x", (d, i) => x_scale(dataset.category[i]))
        .attr("y", d => y_scale(d))
        .attr("width", x_scale.bandwidth())
        .attr("height", d => height - y_scale(d))
        .attr("fill", "steelblue");
}

graph4()



const graph5 = () => {
    const width = 400
    const height = 300
    const svg = d3.select("#d3_demo_3").attr("width", width).attr("height", height)

    const x_scale = d3.scaleBand().domain(databis.map(d => d.category)).range([0, width]).padding(0.1)

    const y_scale = d3.scaleLinear().domain([0, databis.map(d => Math.max(...d.values))]).range([height, 0])

    svg.selectAll("rect")
    .data(databis[0])
    .enter()
    .append("rect")
    .attr("class", "")
    .attr("x", d => x_scale(d.category))
    .attr("y", d => y_scale(d.values))
    .attr("width", x_scale.bandwidth())
    .attr("height", d => height - y_scale(d.values))
    .attr("fill", "steelblue");
}

graph5()*/

/*
const instantsvg = (donnees) =>  {
    const width = 400
    const height = 300
    const taille = donnees.length

    const svg = d3.select("#d3_demo_3").attr("width", width).attr("height", height)

    const x_scale = d3.scaleBand().domain(donnees.map(d => d.category)).range([0, width]).padding(0.1) 
      
    const y_scale = d3.scaleLinear().domain([0, donnees.map(d => Math.max(...d.values))]).range([height, 0]) 

// pas faire une boucle mais un groupe avec call

    for (let i = 0; i < taille; i++) {
        console.log(donnees.length)

        svg.selectAll("rect.serie" + i)
        .data(donnees[i].values) // On sélectionne que des valeurs dans l'autre => mets une erreur ici, NaN pour x et height
        .join("rect")
        .attr("class", "bar")
        .attr("x", (d) => x_scale(d.category) + i*(x_scale.bandwidth() / taille)) // j'vais avoir besoin de changer le type et prendre à nouveau
        .attr("y", d => y_scale(d.values))
        .attr("width", x_scale.bandwidth() / taille)
        .attr("height", d => height - y_scale(d.values))
        .attr("fill", "steelblue")
        
    }

}

instantsvg(databis) */


/*
const svg_creator = (donnees) => {
    const width = 400
    const height = 300
    const taille = donnees.length
    const valeur = []
    donnees.forEach((d) => valeur.push(d.value1))

    const svg = d3.select("#d3_demo_3").attr("width", width).attr("height", height)

    const x_scale = d3.scaleBand().domain(donnees.map(d => d.category)).range([0, width]).padding(0.1) 
      
    const y_scale = d3.scaleLinear().domain([0, donnees.map(d => Math.max(...valeur))]).range([height, 0]) 
    let group = svg.selectAll("g")
        .data(donnees)
        .join(
            enter => enter.append("g")
                            .attr("class", d => d.value1),
            update => update,
            exit => exit.remove()
        )
console.log(group)
    group.selectAll("rect")
        .data(d => d.value1)
        .join(
            enter => enter.append("rect")
                          .attr("class", "bar")
                          .attr("x", d => x_scale(d.category) + (x_scale.bandwidth() / taille))
                          .attr("y", d => y_scale(d.value1))
                          .attr("width", x_scale.bandwidth() / taille)
                          .attr("height", d => height - y_scale(d.value1))
                          .attr("fill", "steelblue"),
            update => update,
            exit => exit.remove()
        )
}  

//svg_creator(datatris)

*/

const svg_creator = (donnees) => {
    const width = 400
    const height = 300
    const taille = donnees.length
    let exploitable = []
    donnees.forEach(d => {
         for (let i = 0; i < d.values.length ; i++) {
            exploitable.push({"Category" : d.category,
                                "Values" : {"value" : d.values[i], "parents" : d.category}
                            })
                        }
                    })

    const svg = d3.select("#d3_demo_3").attr("width", width).attr("height", height)

    const x_scale = d3.scaleBand().domain(donnees.map(d => d.category)).range([0, width]).padding(0.1)
    console.log(exploitable) 
      
    const y_scale = d3.scaleLinear().domain([0, donnees.map(d => Math.max(...d.values))]).range([height, 0]) 
    let group = svg.selectAll("g")
        .data(exploitable)
        .join(
            enter => enter.append("g")
                            .attr("class", d => d.Category),
            update => update,
            exit => exit.remove()
        )

    group.selectAll("rect")
        .data(d => d.Values)
        .join(
            enter => enter.append("rect")
                          .attr("class", "bar"),
            update => update,
            exit => exit.remove()
        ).attr("x", x_scale(d.parents) + (x_scale.bandwidth() / taille))
        .attr("y", d => y_scale(d.value))
        .attr("width", x_scale.bandwidth() / taille)
        .attr("height", d => height - y_scale(d.value))

}  

svg_creator(datatest)