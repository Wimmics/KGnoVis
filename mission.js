import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm"

const test = () => {
    console.log("Ca marche")
}


function recupererDonnees() {
    var texte = document.getElementById('user_text').value
    console.log(texte)
    }

export {test, recupererDonnees}