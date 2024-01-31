import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm"

const databis = [
    {label :"Clouds", values : [5, 8, 12 , 7, 9], fill : "black"},
    {label :"Flower", values : [10, 20, 15, 25, 30], fill : "crimson"},
    {label :"Snow", values :  [6, 8, 2, 4, 5], fill : "silver"},
    {label :"Wind", values :  [20, 30, 10, 12, 18], fill : "gold"},
    {label :"Moon", values :  [14, 16, 24, 8, 17], fill : "lightblue"}
]

const data_test = [
    {label :"Clouds", values : [5, 8, 12 , 7, 9], fill : "black"},
    {label :"Flower", values : [10, 20, 15, 25, 30], fill : "crimson"}
]

const color = ["black", "crimson", "silver", "gold", "steelblue"]

// Créer des labels, un par valeur de len(value), avec un nom particulier


const svg_creator = (donnees, couleurs = [0], vertical_bar = true, is_log = false) => {

    // Création des constantes du graphique et de ses contours
    const longueur = 380
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
    let cat = 0;



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

    console.log(exploitable)
    console.log(exploitable[0].Label)
    console.log(x_scale(exploitable[0].Label))

    let ecart = x_scale(exploitable[1].Label)-x_scale(exploitable[0].Label)
    let origin = x_scale(exploitable[0].Label)
    let growing = 0
    console.log(ecart)

    console.log(x_scale.bandwidth())
    console.log(x_scale.bandwidth()/taille)
    growing = growing + 1
    console.log(growing)
    
    // L'objectif est d'augmenter de 200 à chaque barre, et de 32 à chaque catégorie.
    // x_scale(label) = 18 et 199 => endroit où débutent leurs parties. Problème : je veux pas que le 2ème commence là
    // Est-ce que je peux récupérer le bandwith pour chaque parent, et augmenter de 1 un nombre incr à chaque itération de rect?
    // x_scale.bandwith doit augmenter en fonction du label.
    // x_scale(d.parents) donne l'espacement entre chaque zone, et x_bandwith me donne la taille de chaque barre (et un +1 à chaque barre)
            

    if (vertical_bar == true) {
        group.selectAll("rect")
            .data(d => d.Value)
            .join(
                enter => enter.append("rect")
                            .attr("class", "bar"),
                update => update,
                exit => exit.remove()
            )
            .attr("x", (d,i) => origin + i*ecart + d.incr*(x_scale.bandwidth() / taille))   //x_scale(d.parents) + d.incr*(x_scale.bandwidth() / taille))
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

svg_creator(databis, undefined, true, true)

