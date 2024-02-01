import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm"

const databis = [
    {label :"Clouds", values : [5, 8, 12 , 7, 9], fill : "black"},
    {label :"Flower", values : [10, 20, 15, 25, 30], fill : "crimson"},
    {label :"Snow", values :  [6, 8, 2, 4, 5], fill : "silver"},
    {label :"Wind", values :  [20, 30, 10, 12, 18], fill : "gold"},
    {label :"Moon", values :  [14, 16, 24, 8, 17], fill : "lightblue"}
]

const color = ["black", "crimson", "silver", "gold", "steelblue"]

const svg_creator = (donnees, couleurs = [0], vertical_bar = true, is_log = false, is_stacked = false, longueur = 380) => {

    const taille = Math.max(donnees.length, 5)
    const margin = {left : 5, top : 5, bottom : 5, right : 5}
    const varPadding = 1
    const domaine = Math.max(...donnees.map(d => Math.max(...d.values)*1.05))

    const svg = d3.select("#d3_demo_3").attr("width", longueur + margin.left + margin.right).attr("height", longueur + margin.top + margin.bottom)
    const x_scale = d3.scaleBand().domain(donnees.map(d => d.label)).range([0, longueur]).padding(0.1) 
    let y_scale

    try {

        if (!is_log) {
            y_scale = d3.scaleLinear().domain([0, domaine]).range([longueur, 15])
        } else {
            y_scale = d3.scaleLog().domain([1, domaine]).range([longueur, 15]) 
        }
    } catch (error){
        console.error("is_log n'est pas un boolean", error)
    }

    let exploitable = []
    let keys = []
    let color = []

    // Transformation des données
    try {
        donnees.forEach((d,i) => {
            let object = {"Label" : d.label}
            object["Value"] = []

            for (let j = 0; j < d.values.length ; j++) {
                object.Value.push({"value" : d.values[j], "parents" : d.label, "color" : d.fill, "incr" : i})
            }

            exploitable.push(object)
            keys.push(object.Label)

            if (couleurs[0] === 0) {
                let couleurs = {"color" : d.fill}
                color.push(couleurs.color)
            } else {
                color = couleurs
            }
        })
    } catch (error) {
        console.error("Le dataset n'est pas au bon format : ", error)
    }

    let echelle_couleurs = d3.scaleOrdinal().domain(keys).range(color)


/*
    const stackedData = d3.stack()
    .keys(keys)
    .offset(d3.stackOffsetDiverging)
    .order(d3.stackOrderNone)
    (donnees)
*/
    console.log(exploitable)
    const reformattedData = exploitable.map(d => {
        return {
          label: d.Label,
          values: d.Value.map(v => v.value)
        }
      })
      // J'ai vraiment pas compris comment fonctionne le stackedchart...
      
      const stack = d3.stack()
        .keys(["values"])
        .order(d3.stackOrderNone) 
        .offset(d3.stackOffsetNone)
        (reformattedData)

    
    console.log(reformattedData)
    console.log(keys)
    console.log(stack)

    let group = svg.selectAll("g")
        .data(exploitable)
        .join(
            enter => enter.append("g")
                            .attr("class", (d, i) => d.Value[i]),
            update => update,
            exit => exit.remove()
        )

    // Création des rectangles

    let ecart = x_scale(exploitable[1].Label)-x_scale(exploitable[0].Label)
    let origin = x_scale(exploitable[0].Label)

    if (vertical_bar == true) {
        group.selectAll("rect")
            .data(d => d.Value)
            .join(
                enter => enter.append("rect")
                            .attr("class", "bar"),
                update => update,
                exit => exit.remove()
            )
            .attr("x", (d,i) => origin + i*ecart + d.incr*(x_scale.bandwidth() / taille))
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
            .attr("x", (d,i) => origin + i*ecart + d.incr*(x_scale.bandwidth() / taille))
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
            .attr("y", (d,i) => origin + i*ecart + d.incr*(x_scale.bandwidth() / taille))
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
            .attr("y", (d,i) => 2.5*origin + i*ecart + d.incr*(x_scale.bandwidth() / taille))
            .attr("x", d => longueur - (y_scale(d.value)))
    }

    // Légende

    svg.selectAll("mydots")
        .data(keys).enter()
        .append("circle")
        .attr("cx", function(d,i){ return 15 + i*75})
        .attr("cy", longueur)
        .attr("r", 7)
        .style("fill", (d, i) => color[i])

    svg.selectAll("mylabels")
        .data(keys).enter()
        .append("text")
        .attr("x", function(d,i){ return 25 + i*75})
        .attr("y", longueur)
        .style("fill", (d, i) => color[i])
        .text(function(d){ return d})
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")

}

svg_creator(databis, color, true, true, true)

