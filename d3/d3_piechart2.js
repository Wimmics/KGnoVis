import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm"

const databis = [
    {label :"Clouds", values : [5, 8, 12 , 7, 9], fill : "black"},
    {label :"Flower", values : [10, 20, 15, 25, 30], fill : "crimson"},
    {label :"Snow", values :  [6, 8, 2, 4, 5], fill : "silver"},
    {label :"Wind", values :  [20, 30, 10, 12, 18], fill : "gold"},
    {label :"Moon", values :  [14, 16, 24, 8, 17], fill : "lightblue"}
]

console.log("Bonjour")

const svg_creator = (donnees, longueur = 350, margin = {left : 5, top : 5, bottom : 5, right : 5}) => {

    const svg = d3.select("#d3_demo_bis").attr("width", longueur + margin.left + margin.right).attr("height", longueur + margin.top + margin.bottom)
    
}

svg_creator(databis)