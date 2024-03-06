import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm"

function recupererDonnees() {
    var texte = document.getElementById('user_text').value
    return texte
    console.log("texte")
    }

function remplirTableau() {

    console.log("tableau")

    var tableau = document.getElementById('test')

    while (tableau.rows.length > 0) {
        tableau.deleteRow(0);
    }

    var donnees = [
        ["Donnée 1", "Donnée 2", "Donnée 3", "Donnée 4", "Donnée 5"],
        ["Donnée 6", "Donnée 7", "Donnée 8", "Donnée 9", "Donnée 10"],
        ["Donnée 11", "Donnée 12", "Donnée 13", "Donnée 14", "Donnée 15"],
        ["Donnée 16", "Donnée 17", "Donnée 18", "Donnée 19", "Donnée 20"],
        ["Donnée 21", "Donnée 22", "Donnée 23", "Donnée 24", "Donnée 25"]
    ]
    
    for (var i = 0; i < donnees.length; i++) {
            var ligne = tableau.insertRow(i)
        for (var j = 0; j < donnees[i].length; j++) {
            var cellule = ligne.insertCell(j)
            cellule.innerHTML = donnees[i][j]
        }
    }
}

const executeSPARQLRequest = async (endpoint, query) => {
    localStorage.clear()
    const url = `${endpoint}?query=${encodeURIComponent(query)}&format=json`;

    let result_data = await fetch(url, {
        mode: 'cors',
        headers: {
            'Content-Type': 'text/plain',
            'Accept': "application/sparql-results+json"
        }
    })
    //console.log(JSON.stringify(await result_data.text()))
    return await result_data.json()
}

const query_deka = `SELECT DISTINCT ?endpoint ?sparqlNorm (COUNT(DISTINCT ?activity) AS ?count) {
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
    ORDER BY ?endpoint ?sparqlNorm`;


function recupererEtAfficherTableau(dataset) {

    console.log("resultat")
    console.log(dataset)
    
    let tableauHtml = document.getElementById('result_table')

    while (tableauHtml.rows.length > 0) {
        tableauHtml.deleteRow(0);
    }

    const l1 = dataset.head.vars

    console.log(l1)

    let ligne1 = tableauHtml.insertRow(l1)
    console.log(ligne1)

    for (const elt of l1) {
        let cellule = ligne1.insertCell(-1)
        cellule.innerHTML = elt
    }
    
    for (const element of dataset.results.bindings) {
        let ligne = tableauHtml.insertRow(-1)
        console.log(ligne)

        for (const elt of l1) {
        let cellule = ligne.insertCell(-1)
        cellule.innerHTML = element[elt]["value"]
        } 
    }

    console.log("terminé")
}

export {recupererDonnees, remplirTableau, executeSPARQLRequest, recupererEtAfficherTableau, query_deka}