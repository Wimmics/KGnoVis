import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm"
import * as grid from 'https://unpkg.com/gridjs?module'

// Besoin de dl le fichier dans la librairie?
// Prendre exemple import dans index, je mets dans le lib, et pas besoin d'import dans le .js

function recupererDonnees() { // Cette fonction me permet de récupérer le texte compris dans le text_area
    var texte = document.getElementById('user_text').value
    return texte
    }

const executeSPARQLRequest = async (endpoint, query) => { // Cette fonction appelle une requête SparQL et l'exécute, et renvoie le dataset de sortie.
    localStorage.clear()
    const url = `${endpoint}?query=${encodeURIComponent(query)}&format=json`

    let result_data = await fetch(url, {
        mode: 'cors',
        headers: {
            'Content-Type': 'text/plain',
            'Accept': "application/sparql-results+json"
        }
    })
    return await result_data.json()
}

const query_select = `SELECT DISTINCT ?endpoint ?sparqlNorm (COUNT(DISTINCT ?activity) AS ?count) {
    GRAPH ?g {
    { ?curated <http://www.w3.org/ns/sparql-service-description#endpoint> ?endpoint . }
    UNION { ?curated <http://rdfs.org/ns/void#sparqlEndpoint> ?endpoint . }
    UNION { ?curated <http://www.w3.org/ns/dcat#endpointURL> ?endpoint . }
    ?metadata <http://ns.inria.fr/kg/index#curated> ?curated, ?dataset .
        { ?dataset <http://www.w3.org/ns/prov#wasGeneratedBy> ?activity . }
        UNION { ?metadata <http://www.w3.org/ns/prov#wasGeneratedBy> ?activity .}
        FILTER(CONTAINS(str(?activity), ?sparqlNorm))
        VALUES ?sparqlNorm { "SPARQL10" "SPARQL11" }
    }
    }
    GROUP BY ?endpoint ?sparqlNorm
    ORDER BY ?endpoint ?sparqlNorm`

const query_construct = `CONSTRUCT{ ?endpoint rdf:value ?sparqlNorm } {
    GRAPH ?g {
    { ?curated <http://www.w3.org/ns/sparql-service-description#endpoint> ?endpoint . }
    UNION { ?curated <http://rdfs.org/ns/void#sparqlEndpoint> ?endpoint . }
    UNION { ?curated <http://www.w3.org/ns/dcat#endpointURL> ?endpoint . }
    ?metadata <http://ns.inria.fr/kg/index#curated> ?curated, ?dataset .
        { ?dataset <http://www.w3.org/ns/prov#wasGeneratedBy> ?activity . }
        UNION { ?metadata <http://www.w3.org/ns/prov#wasGeneratedBy> ?activity .}
        FILTER(CONTAINS(str(?activity), ?sparqlNorm))
        VALUES ?sparqlNorm { "SPARQL10" "SPARQL11" }
    }
    }
    GROUP BY ?endpoint ?sparqlNorm
    ORDER BY ?endpoint ?sparqlNorm`

function recupererEtAfficherTableau(dataset) { // Cette fonction permet de créer un tableau de données à partir d'un dataset donné en entrée

    const tableau = new grid.Grid({
        columns : ["source", "label", "target"],
        sort : true,
        pagination : true,
        fixedHeader : true,
        height : "20rem",
        data : dataset.links,
        width : "90vw",
        resizable : true
    })
    
    tableau.render(document.getElementById('result_table'))

}

function nodeAlreadyExist(node, nodesList) { // Cette fonction récupère une node et une liste et vérifie si la node est déjà comprise dans la liste
    for (let n of nodesList) {
        if (n.id === node.id) {
            return true
        }
    }
    return false
}

function buildNodes(data, edge) { // Cette fonction récupère un dataset et une liste de triplets de colonnes, puis récupère les colonnes sources et target afin de créer des nodes pour chaque valeur unique.

    const nodes = []

    for (let triple of edge) {
        for (let row of data) {

            let node1
            let node2


            try {
                node1 = {
                    id : row[triple.source]["value"],
                    label : row[triple.source]["value"],
                    col : triple.source,
                    place : "source",
                    zoom : false
                }

                if (!(nodeAlreadyExist(node1, nodes))) {
                    nodes.push(node1)
                } else {
                    let dict_existant = nodes.find(dictionnaire => dictionnaire.id === node1.id)
                    if (dict_existant.place === "target") {
                        dict_existant.place = "mix"
                    }
                }
            } catch(error) {
                console.log("Le dataset ne contient pas les éléments nécessaires pour créer la 1ère node")
            }

            try {
                node2 = {
                    id : row[triple.target]["value"],
                    label : row[triple.target]["value"],
                    col : triple.target,
                    place : "target",
                    zoom : false
                }
            
                if (!(nodeAlreadyExist(node2, nodes))) {
                    nodes.push(node2)
                } else {
                    let dict_existant = nodes.find(dictionnaire => dictionnaire.id === node2.id)
                    if (dict_existant.place === "source") {
                        dict_existant.place = "mix"
                    }
                }

            } catch(error) {
                console.log("Le dataset ne contient pas les éléments nécessaires pour créer la 2ème node")
            }
            console.log("source", triple.source)
            console.log("target", triple.target)
            console.log("row target", row[triple.target]["value"])
            console.log("row source", row[triple.source]["value"])
        }
    }
    return nodes
}

function linkAlreadyExist(link, linksList) { // Cette fonction récupère un triplet (source, relation, cible) et une liste et vérifie si le triplet (ou le triplet avec source et cible inverse) est déjà comprise dans la liste
    for (let l of linksList) {
        if (l.source === link.source && l.target === link.target && l.label === link.label) {
            return true
        } else if (l.source === link.target && l.target === link.source && l.label === link.label) {
            return true
        }
    }
    return false
}

function buildLinks(data, edge) { // Cette fonction récupère un dataset et une liste de triplets de colonnes, puis récupère les colonnes dans le dataset afin de créer pour chaque triplet de colonnes les lignes associées pour chaque valeur unique.

    const links = []
    let number = 0
    
    for (const triple of edge) {
        for (const row of data) {
            try {
            const source = row[triple.source].value
            const target = row[triple.target].value
            const label = row[triple.relation].value
            const color = triple.color_link

            const link = {
                source : source,
                target : target,
                label : label,
                color : color,
                id : number
            }

            if (!(linkAlreadyExist(link, links))) {
                links.push(link)
            }
            number += 1
            } catch (error) {
                console.log("Le dataset ne contient pas les éléments nécessaires pour créer le lien")
            }
        }
    }
    
    return links
}

function buildLegend(edge) {

    const items = []

    for (const triple of edge) {

        items.push({
            label : "source", value : triple.source
        })
    //faire un mix des couleurs

        items.push({
            label : "target", value : triple.target
        })
        
    } 

    return items
}

const liste_test_couleur = {
    CouleurA : {valeurs : [255, 0, 0], poids : 0.5},
    CouleurB : {valeurs : [200, 120, 130], poids : 0.2},
    CouleurC : {valeurs : [0, 230, 140], poids : 0.3}
}

const liste_poids = [0.5, 0.3, 0.2]

function regrouperParValeur(objets) {
    const resultat = {};

    for (let i = 0; i < objets.length; i++) {
        const objet = objets[i];
        if (!resultat[objet.value]) {
            resultat[objet.value] = [];
        }
        resultat[objet.value].push(objet);
    }

    return resultat;
}

function fusion_couleurs(liste_couleur, liste_poids = null) {

    let red = [], blue = [], green = []

    console.log(liste_couleur)

    for (let elt in liste_couleur) {

        const new_red = liste_couleur[elt].valeurs[0] *  liste_couleur[elt].poids
        const new_blue = liste_couleur[elt].valeurs[1] *  liste_couleur[elt].poids
        const new_green = liste_couleur[elt].valeurs[2] *  liste_couleur[elt].poids

        red.push(new_red)
        blue.push(new_blue)
        green.push(new_green)

    }

    const moy_red = Math.round(red.reduce((a, b) => a + b, 0))
    const moy_blue = Math.round(blue.reduce((a, b) => a + b, 0))
    const moy_green = Math.round(green.reduce((a, b) => a + b, 0))

    console.log("red", red, moy_red)
    console.log("blue", blue, moy_blue)
    console.log("green", green, moy_green)
}

function nodelink_creator(data, node_colors = ["red", "blue"], mixed_colors = "purple", strength = -50, width = 400, height = 400, node_named = true, link_named = true, node_zoom = true, zoom_strenght = 2) { // Cette fonction récupère un dataset et un certain nombre d'options, puis créé le nodelink et ses 

    console.log("debut nodelink, dataset", data)

    const data_used = JSON.parse(JSON.stringify(data))
  
    const margin = {top: 5, right: 5, bottom: 5, left: 5}

    const svg_total = d3.select("#nodelink_graph") // Créé la zone qui contiendra le nodelink
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)

    const width2 = width*0.9
    const height2 = height*0.9

    const largeur = Math.min(width2, height2)

    const svg_graph = svg_total.append("svg")
        .attr("x", width*0.05)
        .attr("y", height*0.05)
        .attr("width", width2)
        .attr("height", height2)    
        .append("g")
        
    const svg_label = d3.select("#labels") // Créé une zone qui contiendra les labels

    const zoom = d3.zoom()
        .scaleExtent([0.1, 10]) // Définir les limites de l'échelle de zoom
        .on('zoom', function(event) {
            svg_graph.attr("transform", event.transform)
        }, {passive : true})

    d3.select("#nodelink_graph").call(zoom,
        d3.zoom()
            //.filter(() => !event.ctrlKey && !event.button) // Permet de forcer l'appuie sur ctrl pour le zoom
            //.touchable() // Permet l'accès au tactile
            .on('zoom', function(event) {
                svg_graph.attr('transform', event.transform)
        }), {passive: true})

    const link = svg_graph.selectAll("line") // Créé les liens qui vont relier les différents noeuds
        .data(data_used.links)
        .join("line")
        .attr("label", d => d.label)
        .attr("id", d => d.id)
        .style("stroke", d => d.color)

    const node = svg_graph.selectAll("circle") // Créé les noeuds
        .data(data_used.nodes)
        .join("circle")
        .attr("r", 0.01*largeur)
        .attr("label", d => d.label)
        .attr("id", d => d.id)
        .style("fill", function(d) {
            console.log(d.place)
            if (d.place === "source") {
                return node_colors[0]
            } else if (d.place === "target") {
                return node_colors[1]
            } else {
                return mixed_colors
            }
        })

    let nodes_label
    let link_label
    let zoomScale = 1

    if (node_zoom === true) { // Cette sous-fonction contrôle le zoom des nodes

        node.on("click", d => {
            const choosen_id = d.target.getAttribute("id")  
            const choosen_node = d3.select('circle[label="' + choosen_id + '"]') // Ces 2 lignes permettent d'obtenir la node cible
            console.log(choosen_node)

            let choosen_x
            let choosen_y

            if (choosen_node._groups[0][0].__data__.label === d.target.getAttribute("label")) { // Cette sous-fonction récupère l'emplacement de la node
                choosen_x = choosen_node._groups[0][0].__data__.x
                choosen_y = choosen_node._groups[0][0].__data__.y
            }

            if (choosen_node._groups[0][0].__data__.zoom === false) { // Permet de zoomer
                zoomScale = zoom_strenght // Puissance de zoom choisie par l'utilisateur
                choosen_node.transition().attr("transform", `translate(${choosen_x}, ${choosen_y}) scale(${zoomScale}) translate(${-choosen_x}, ${-choosen_y})`)
                //scale => remplace toutes les transformations précédentes, y compris l'assignation, et du coup supprime la position
                
                choosen_node._groups[0][0].__data__.zoom = true

            } else { // Permet de dézoomer
                zoomScale = 1 // Remet le zoom à 1
                choosen_node.transition().attr("transform", `translate(${choosen_x}, ${choosen_y}) scale(${zoomScale}) translate(${-choosen_x}, ${-choosen_y})`)
                choosen_node._groups[0][0].__data__.zoom = false
            }

            // Le double déplacement est nécessaire pour conserver le noeud au même point, sans cela il se téléporte au loin

        }, {passive : true})

    }

    if (node_named === true) {

        nodes_label = svg_label.selectAll("nodes") // Créé un texte dans le svg des labels, pour chaque node, puis le cache.
            .data(data_used.nodes)
            .enter().append("p")
            .style("text-align", "center")
            .style("font-size", "12px")
            .style("display", "none")
            .attr("id", d => d.label)
            .attr("label", d => d.label)
            .text(d => d.label)
            .attr("x", d => 10)
            .attr("y", d => 30)
            

        svg_graph.selectAll("circle") // Sélectionne les différentes nodes lorsque la souris passe sur la node ou la quitte
        .on("mouseover", d => {
            let choosen_node

            for (let elt in nodes_label._groups[0]) { // Sélectionne la node dans le svg label qui possède le même label que celle sélectionnée, puis affiche son texte.
                if (nodes_label._groups[0][elt].__data__.label === d.target.getAttribute("label")) {
                    choosen_node = nodes_label._groups[0][elt]
                    choosen_node.style.display = "inline"           
                }
            }
        })
        .on("mouseout", d => {  // Sélectionne la node dans le svg label qui possède le même label que celle sélectionnée, puis cache son texte.
            let choosen_node
            for (let elt in nodes_label._groups[0]) {
                if (nodes_label._groups[0][elt].__data__.label === d.target.getAttribute("label")) {
                    choosen_node = nodes_label._groups[0][elt]
                    choosen_node.style.display = "none"
                }
            }
            
        })
    }

    if (link_named === true) {
        link_label = svg_label.selectAll("liens") // Créé un texte dans le svg des labels, pour chaque lien, puis le cache.
        .data(data_used.links)
        .enter().append("p")
        .text(d => d.label)
        .attr("label", d => d.label)
        .attr("id", d => d.id)
        .style("text-align", "center")
        .style("font-size", "12px")
        .style("display", "none")
        .attr("x", 10)
        .attr("y", 30)

        //console.log(link_label)
        
        svg_graph.selectAll("line") // Sélectionne les différents liens lorsque la souris passe sur un lien ou le quitte
        .on("mouseover", d => { 
            let choosen_link
        
            for (let elt in link_label._groups[0]) { // Sélectionne le lien dans le svg label qui possède le même label que celui sélectionné, puis affiche son texte.
                if (parseInt(link_label._groups[0][elt].__data__.id) === parseInt(d.target.getAttribute("id"))) {
                    choosen_link = link_label._groups[0][elt]
                    choosen_link.style.display = "inline"
                }
            }
        })
        .on("mouseout", d => { 
            let choosen_link       

            for (let elt in link_label._groups[0]) { // Sélectionne le lien dans le svg label qui possède le même label que celui sélectionné, puis affiche son texte.
                if (parseInt(link_label._groups[0][elt].__data__.id) === parseInt(d.target.getAttribute("id"))) { 
                    choosen_link = link_label._groups[0][elt]
                    choosen_link.style.display = "none"           
                }
            }
        })
    }

    const number_legend = data.legend.length
    //console.log(number_legend)


        
    const dots = svg_total.selectAll("legend_dots")
        .data(data.legend)
        .join("circle")
        .attr("cx", (d, i) => (1/number_legend)*0.20*width + (1/number_legend)*i*width)
        .attr("cy", 0.02*height)
        .attr("r", 0.01*largeur)
        .style("fill", (d, i) => d.color)

    const legend_text = svg_total.selectAll("legend_names")
        .data(data.legend)
        .join("text")
        .text(d => d.value)
        .attr("label", d => d.label)
        .attr("x", (d, i) => (1/number_legend)*0.25*width + 20 + (1/number_legend)*i*width)
        .attr("y", 0.02*height + 5)
        .style("font-size", "1rem")

    let ticksCount = 0

    // Cette ligne est liée à la partie .on("tick"). Cela permet de montrer l'apparition des nodes, et la vitesse à laquelle elles s'écartent les unes des autres.

    const simulation = d3.forceSimulation(data_used.nodes) // Cette simulation correspond au calcul de positionnement des nodes, et est réalisée par d3.
        .force("link", d3.forceLink()                      
            .id(d => d.id)                
            .links(data_used.links)                                 
        )
        .force("charge", d3.forceManyBody().strength(strength))
        .force("center", d3.forceCenter(width2 / 2, height2 / 2))
        //.on("end", ticked)

        .on("tick", function () {

            ticked()
            ticksCount++; // Incrémente le compteur de ticks à chaque itération
            //console.log(ticksCount)

            if (ticksCount >= 500) {
                simulation.stop() // Arrête la simulation après le nombre spécifié de ticks
            }
        })
     
        
    function ticked() { // Cette fonction assigne les nodes et labels au positionnement indiqué par la simulation

        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y)

        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
    }  
    
}

export {recupererDonnees, executeSPARQLRequest, recupererEtAfficherTableau, regrouperParValeur, fusion_couleurs, nodelink_creator, buildNodes, buildLinks, buildLegend}