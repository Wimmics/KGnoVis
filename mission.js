import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm"

const test = () => {
    console.log("Ca marche")
}

function recupererDonnees() {
    var texte = document.getElementById('user_text').value
    console.log(texte)
    }

function remplirTableau() {
    var tableau = document.getElementById('monTableau')

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

export {test, recupererDonnees, remplirTableau}