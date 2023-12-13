import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm"

const databis = [
    {category :"A", values : [10, 20, 15, 25, 30], fill : "SteelBlue"},
    {category :"B", values : [5, 8, 12 , 7, 9], fill : "red"},
    {category :"C", values :  [6, 8, 2, 4, 5], fill : "yellow"},
    {category :"D", values :  [20, 30, 10, 12, 18], fill : "green"},
    {category :"E", values :  [14, 16, 24, 8, 17], fill : "black"}
]

const svg_creator = (donnees) => {
    const width = 400
    const height = 300
    const taille = donnees.length
    const varPadding = 1
    let exploitable = []
    donnees.forEach(d => {
        let object = {"Category" : d.category}
        object["Value"] = []
        for (let i = 0; i < d.values.length ; i++) {
            object.Value.push({"value" : d.values[i], "parents" : d.category, "color" : d.fill, "incr" : i})
        }
        exploitable.push(object)       
        })
    const svg = d3.select("#d3_demo_3").attr("width", width).attr("height", height)

    const x_scale = d3.scaleBand().domain(donnees.map(d => d.category)).range([0, width]).padding(0.1)      
    const y_scale = d3.scaleLinear().domain([0, Math.max(...donnees.map(d => Math.max(...d.values)))]).range([height, 0]) 
    let group = svg.selectAll("g")
        .data(exploitable)
        .join(
            enter => enter.append("g")
                            .attr("class", d => d.Category),
            update => update,
            exit => exit.remove()
        )

    group.selectAll("rect")
        .data(d => d.Value)
        .join(
            enter => enter.append("rect")
                          .attr("class", "bar"),
            update => update,
            exit => exit.remove()
        ).attr("x", d => x_scale(d.parents) + d.incr*(x_scale.bandwidth() / taille)) // On a la taille avec x_scale(d.parents) et on se déplace à chaque catégorie, pas à chaque élément.
        // Il faudrait pouvoir augmenter de 1 le x_scale.bandwith à chaque valeur, pas chaque catégorie.
        .attr("y", d => y_scale(d.value))
        .attr("width", (x_scale.bandwidth() / taille) - varPadding)
        .attr("height", d => height - y_scale(d.value))
        .attr("fill", d => d.color)
        console.log(x_scale.bandwidth())
        console.log(taille)
}  

// Afficher les catégories en dessous des colonnes
// Afficher les valeurs en ordonnées
// Afficher la légende
// Changer la couleur pour chaque valeur => si on fait par catégorie
// Ajouter un tooltip (mouseover)

svg_creator(databis)