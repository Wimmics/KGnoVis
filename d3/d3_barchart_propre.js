import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm"

const databis = [
    {category :"Clouds", values : [5, 8, 12 , 7, 9], fill : "black"},
    {category :"Flower", values : [10, 20, 15, 25, 30], fill : "crimson"},
    {category :"Snow", values :  [6, 8, 2, 4, 5], fill : "silver"},
    {category :"Wind", values :  [20, 30, 10, 12, 18], fill : "gold"},
    {category :"Moon", values :  [14, 16, 24, 8, 17], fill : "lightblue"}
]

const color = ["black", "crimson", "silver", "gold", "steelblue"]

// Créer des labels, un par valeur de len(value), avec un nom particulier


const svg_creator = (donnees, couleurs = [0], vertical_bar = true, is_log = false) => {

    // Création des constantes du graphique et de ses contours
    const longueur = 380
    const taille = donnees.length
    const margin = {left : 5, top : 5, bottom : 5, right : 5}
    const varPadding = 1
    const domaine = Math.max(...donnees.map(d => Math.max(...d.values)*1.05))

    const svg = d3.select("#d3_demo_3").attr("width", longueur + margin.left + margin.right).attr("height", longueur + margin.top + margin.bottom)
    const x_scale = d3.scaleBand().domain(donnees.map(d => d.category)).range([0, longueur]).padding(0.1)  

    let y_scale   

    if (!is_log) {
        y_scale = d3.scaleLinear().domain([0, domaine]).range([longueur, 15])
    } else {
        y_scale = d3.scaleLog().domain([1, domaine]).range([longueur, 15]) 
    }

    // Transformation des données

    let exploitable = []
    let keys = []
    let color = []
    donnees.forEach(d => {
        let object = {"Category" : d.category}
        object["Value"] = []

        for (let i = 0; i < d.values.length ; i++) {
            object.Value.push({"value" : d.values[i], "parents" : d.category, "color" : d.fill, "incr" : i})
        }

        exploitable.push(object)
        keys.push(object.Category)
        if (couleurs[0] === 0) {
            let couleurs = {"color" : d.fill}
            color.push(couleurs.color)
        } else {
            color = couleurs
        }
    })

    let echelle_couleurs = d3.scaleOrdinal().domain(keys).range(couleurs)

    let group = svg.selectAll("g")
        .data(exploitable)
        .join(
            enter => enter.append("g")
                            .attr("class", (d, i) => d.Value[i]),
            update => update,
            exit => exit.remove()
        )

    // Ici, je créé différents groupes, à partir de chaque valeur?. Sur le graph c'est toujours groupé par catégorie. Peut-être changer dans le rect,
    // mais le problème c'est qu'à ce niveau-là je suis déjà sur mes valeurs et mes groupes sont faits.

    // Création des rectangles

    if (vertical_bar == true) {
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
            .attr("height", d => longueur - y_scale(d.value) - 10)
            .style("fill", d => echelle_couleurs(d.parents))

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
            .attr("x", d => x_scale(d.parents) + d.incr*(x_scale.bandwidth() / taille))
            .attr("y", d => y_scale(d.value) - 2)

    } else {
        group.selectAll("rect")
            .data(d => d.Value)
            .join(
                enter => enter.append("rect")
                            .attr("class", "bar"),
                update => update,
                exit => exit.remove()
            )
            .attr("y", d => (x_scale(d.parents) + d.incr*(x_scale.bandwidth() / taille)))
            .attr("x", 5)
            .attr("height", ((x_scale.bandwidth() / taille) - varPadding))
            .attr("width", d => (longueur - y_scale(d.value) - 10))
            .style("fill", d => echelle_couleurs(d.parents))
            
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
            .attr("y", d => x_scale(d.parents) + (d.incr+0.7)*(x_scale.bandwidth() / taille))
            .attr("x", d => longueur - (y_scale(d.value)))
    
    }

    // Légende

    svg.selectAll("mydots")
        .data(keys).enter()
        .append("circle")
        .attr("cx", function(d,i){ return 15 + i*75})
        .attr("cy", longueur)
        .attr("r", 7)
        .style("fill", (d,i) => color[i])

    svg.selectAll("mylabels")
        .data(keys).enter()
        .append("text")
        .attr("x", function(d,i){ return 25 + i*75})
        .attr("y", longueur)
        .style("fill", (d,i) => color[i])
        .text(function(d){ return d})
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")

}

svg_creator(databis, color, true, true)

