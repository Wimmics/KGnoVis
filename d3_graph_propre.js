import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm"

const databis = [
    {category :"Clouds", values : [10, 20, 15, 25, 30], fill : "black"},
    {category :"Flower", values : [5, 8, 12 , 7, 9], fill : "crimson"},
    {category :"Snow", values :  [6, 8, 2, 4, 5], fill : "silver"},
    {category :"Wind", values :  [20, 30, 10, 12, 18], fill : "gold"},
    {category :"Moon", values :  [14, 16, 24, 8, 17], fill : "lightblue"}
]

const color = ["black", "crimson", "silver", "gold", "lightblue"]

const svg_creator = (donnees, couleurs) => {

    // Création des constantes du graphique et de ses contours
    const width = 380
    const height = 290
    const taille = donnees.length
    const margin = {left : 5, top : 5, bottom : 5, right : 5}
    const varPadding = 1
    const domaine = Math.max(...donnees.map(d => Math.max(...d.values)))

    const svg = d3.select("#d3_demo_3").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom)
    const x_scale = d3.scaleBand().domain(donnees.map(d => d.category)).range([0, width]).padding(0.1)      
    const y_scale = d3.scaleLinear().domain([0, domaine]).range([height, 15]) 

    // Transformation des données

    let exploitable = []
    let keys = []
    let color = []
    donnees.forEach(d => {
        let object = {"Category" : d.category}
        object["Value"] = []
        let couleurs = {"color" : d.fill}
        for (let i = 0; i < d.values.length ; i++) {
            object.Value.push({"value" : d.values[i], "parents" : d.category, "color" : d.fill, "incr" : i})
        }

        exploitable.push(object)
        keys.push(object.Category)
        color.push(couleurs.color)

    })

    let group = svg.selectAll("g")
        .data(exploitable)
        .join(
            enter => enter.append("g")
                            .attr("class", d => d.Category),
            update => update,
            exit => exit.remove()
        )

    // Création des rectangles

    group.selectAll("rect")
        .data(d => d.Value)
        .join(
            enter => enter.append("rect")
                          .attr("class", "bar"),
            update => update,
            exit => exit.remove()
        )
        .attr("x", d => x_scale(d.parents) + d.incr*(x_scale.bandwidth() / taille))
        .attr("y", d => y_scale(d.value))
        .attr("width", (x_scale.bandwidth() / taille) - varPadding)
        .attr("height", d => height - y_scale(d.value) - 10)
        .attr("fill", (d,i) => couleurs[i])
        console.log(couleurs)

    // Légende

    svg.selectAll("mydots")
        .data(keys).enter()
        .append("circle")
        .attr("cx", function(d,i){ return 15 + i*75})
        .attr("cy", height)
        .attr("r", 7)
        .style("fill", (d,i) => color[i])

    svg.selectAll("mylabels")
        .data(keys).enter()
        .append("text")
        .attr("x", function(d,i){ return 25 + i*75})
        .attr("y", height)
        .style("fill", (d,i) => color[i])
        .text(function(d){ return d})
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")


    // Hauteur des rectangles

    group.selectAll("text")
        .data(d => d.Value)
        .join(
            enter => enter.append("text").text((d => d.value))
                          .attr("class", "text"),
            update => update,
            exit => exit.remove()
        )
	    .attr("fill","black")
        .attr("text-anchor", "start")
        .style("font", "12px times")
        .attr("x", d => x_scale(d.parents) + d.incr*(x_scale.bandwidth() / taille)) // On a la taille avec x_scale(d.parents) et on se déplace à chaque catégorie, pas à chaque élément.
        // Il faudrait pouvoir augmenter de 1 le x_scale.bandwith à chaque valeur, pas chaque catégorie.
        .attr("y", d => y_scale(d.value) - 2)
        .attr("fill", d => "black")

}

svg_creator(databis, color)

// Prochaine tâche : mouseover