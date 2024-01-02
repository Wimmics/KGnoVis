import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm"

const databis = [
    {category :"A", values : [10, 20, 15, 25, 30], fill : "SteelBlue"},
    {category :"B", values : [5, 8, 12 , 7, 9], fill : "red"},
    {category :"C", values :  [6, 8, 2, 4, 5], fill : "orange"},
    {category :"D", values :  [20, 30, 10, 12, 18], fill : "green"},
    {category :"E", values :  [14, 16, 24, 8, 17], fill : "black"}
]

// Si données à charger, faire une promesse pour récupérer

/*
const svg_creator = (donnees) => {
    const width = 400
    const height = 300
    const taille = donnees.length
    const varPadding = 1
    const domaine = Math.max(...donnees.map(d => Math.max(...d.values)))
    console.log(typeof(domaine/2))
    console.log(typeof(domaine))
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
    const y_scale = d3.scaleLinear().domain([0, domaine]).range([height, 0]) 
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
*/

/*
const svg_creator = (donnees) => {
    const width = 400
    const height = 300
    const taille = donnees.length
    const taille_pourcent = donnees.length/100
    const taille_pourcentage = taille_pourcent.toString().concat("%")
    const aspectRatio= '400:300'
    const viewBox = '0 0 ' + aspectRatio.split(':').join(' ')
    const varPadding = 1
    const domaine = Math.max(...donnees.map(d => Math.max(...d.values)))
    console.log(typeof(taille_pourcentage))
    console.log(taille_pourcentage)
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
    const y_scale = d3.scaleLinear().domain([0, domaine]).range([height, 0]) 
    let group = svg.selectAll("g")
        .data(exploitable)
        .join(
            enter => enter.append("g")
                            .attr("class", d => d.Category),
            update => update,
            exit => exit.remove()
        ).attr('width', '100%')
        .attr('viewBox', viewBox)

    group.selectAll("rect")
        .data(d => d.Value)
        .join(
            enter => enter.append("rect")
                          .attr("class", "bar"),
            update => update,
            exit => exit.remove()
        )
        .attr("x", d => x_scale(d.parents) + d.incr*(x_scale.bandwidth() / taille)) // On a la taille avec x_scale(d.parents) et on se déplace à chaque catégorie, pas à chaque élément.
        // Il faudrait pouvoir augmenter de 1 le x_scale.bandwith à chaque valeur, pas chaque catégorie.
        .attr("y", d => y_scale(d.value))
        .attr('width', "10%")
        .attr('height', "10%") //Bien trop grand, j'dois pas faire tout le graphique => emplacements bizarres, pourquoi? => Viewbox fait plein de petites boites, mais pas des colonnes, ça gère pas tout le doc
        //.attr("width", (x_scale.bandwidth() / taille) - varPadding)
        //.attr("height", d => height - y_scale(d.value))
        /*.attr("transform", "scale(0.5)") // N'affiche aucun changement, ptet car appliqué à tout, il me faudrait l'échelle pour vérifier
        .attr('transform', `translate(${domaine/2}, ${domaine*(-1)})`) // Déplacer l'axe vers la droite
        .call(d3.axisLeft(y_scale)) //scale 0.5
        .attr("fill", d => d.color)
        
        console.log(x_scale.bandwidth())
        console.log(taille)
}  
*/

// Viewbox fait plein de petites boites, mais pas des colonnes, ça gère pas tout le doc => J'abandonne la viewbox, je pense que ce n'est pas du tout ce que je cherche. Je pense que la fonction
// transform correspond bien plus à mes besoins actuellement.

const svg_creator = (donnees) => {
    const width = 380
    const height = 290
    const taille = donnees.length
    const margin = {left : 5, top : 5, bottom : 5, right : 5}
    const varPadding = 1
    const domaine = Math.max(...donnees.map(d => Math.max(...d.values)))
    let exploitable = []
    let keys = []
    let color = []
    //var color = d3.scaleOrdinal().domain(keys).range(d3.schemeSet2) //Récupère une couleur par catégorie

    donnees.forEach(d => {
        let object = {"Category" : d.category}
        object["Value"] = []
        for (let i = 0; i < d.values.length ; i++) {
            object.Value.push({"value" : d.values[i], "parents" : d.category, "color" : d.fill, "incr" : i})
        }
        let couleurs = {"color" : d.fill}
        exploitable.push(object)
        keys.push(object.Category)
        color.push(couleurs.color)
        })
    
        console.log(color)

    const svg = d3.select("#d3_demo_3").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom)

    const x_scale = d3.scaleBand().domain(donnees.map(d => d.category)).range([0, width]).padding(0.1)      
    const y_scale = d3.scaleLinear().domain([0, domaine]).range([height, 0]) 

    let group = svg.selectAll("g")
        .data(exploitable)
        .join(
            enter => enter.append("g")
                            .attr("class", d => d.Category),
            update => update,
            exit => exit.remove()
        )
    
    /*group.append("g")
        .attr("transform", "scale(0.5)") // N'affiche aucun changement, ptet car appliqué à tout, il me faudrait l'échelle pour vérifier
        .attr('transform', `translate(${domaine/2}, ${domaine*(-1)})`) // Déplacer l'axe vers la droite
        .call(d3.axisBottom(x_scale)) //scale 0.5
*/

    group.selectAll("rect")
        .data(d => d.Value)
        .join(
            enter => enter.append("rect")
                          .attr("class", "bar"),
            update => update,
            exit => exit.remove()
        )
        .attr("x", d => x_scale(d.parents) + d.incr*(x_scale.bandwidth() / taille)) // On a la taille avec x_scale(d.parents) et on se déplace à chaque catégorie, pas à chaque élément.
        // Il faudrait pouvoir augmenter de 1 le x_scale.bandwith à chaque valeur, pas chaque catégorie.
        .attr("y", d => y_scale(d.value))
        .attr("width", (x_scale.bandwidth() / taille) - varPadding)
        .attr("height", d => height - y_scale(d.value) + 9) // C'est en changeant ici que je place la hauteur de base des graphs.
        .attr("fill", d => d.color)

        // Un exemple met x_scale et y_scale dans le groupe
        
        console.log(x_scale.bandwidth())
        console.log(taille)

        
        svg.selectAll("mydots")
        .data(keys).enter()
        .append("circle")
        .attr("cx", 100)
        .attr("cy", function(d,i){ return 100 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("r", 7)
        .style("fill", (d,i) => color[i])

        svg.selectAll("mylabels")
        .data(keys).enter()
        .append("text")
        .attr("x", 120)
        .attr("y", function(d,i){ return 100 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", (d,i) => color[i])
        .text(function(d){ return d})
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")


}  


// Afficher les catégories en dessous des colonnes

svg_creator(databis)

// Afficher les valeurs en ordonnées
// Afficher la légende
// Changer la couleur pour chaque valeur => si on fait par catégorie
// Ajouter un tooltip (mouseover)


/*
// Usually you have a color scale in your chart already
var color = d3.scaleOrdinal()
  .domain(keys)
  .range(d3.schemeSet2);

*/


  