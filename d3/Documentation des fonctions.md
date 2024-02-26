---
title: "Automatisation de graphiques contenant des requêtes SparQL de données RDF"
subtitle: "Explication des fonctions"
author: "Hugo Carton"
date: today
title-block-banner: true
format:
  html:
    embed-resources: true
    number-sections: true
    toc: true
    df-print: paged
execute: 
  warning: false
  message: false
  include: true
knitr:
  opts_chunk:
    tidy: true
    out.width: 100%
    fig-width: 6
    fig.asp: 0.618
    fig.align: center
    R.options:
      width: 80
editor: 
  markdown: 
    wrap: sentence
---


# Introduction

Ce document va me permettre d'expliquer les différentes fonctions réalisées dans l'objectif d'automatiser la représentation de données RDF récupérées avec des requêtes SparQL.

# Sommaire

Je vais expliquer les fonctions réalisées dans l'ordre suivant :

- Bar chart : Graphique à barres
- Stacked chart : Graphique à barre empilées
- Pie chart : Diagramme circulaire
- Nodelink

# Bar chart

## Explications

La fonction barchart_creator appelle un paramètre obligatoire et 4 paramètres optionnels.

### Paramètre obligatoire

Le paramètre obligatoire est le dataset obtenu après la requête SparQL. Ce dataset doit être une liste de dictionnaires. Chaque dictionnaire est défini en premier lieu par sa catégorie, puis par des valeurs et potentiellement des couleurs.

Il doit donc posséder une variable "category" qui contient simplement le nom de la catégorie,  une variable "values" qui est en réalité un sous dataset, donc une autre liste de dictionnaires.
Ce sous-dataset doit contenir 2 éléments : une variable "label", et une variable "value" qui correspond à la valeur de ce label et de cette catégorie.

Enfin, la variable "fill", qui pourra être remplacée par l'un des paramètres optionnels, sert à déterminer la couleur de chaque catégorie. Elle peut contenir un code couleur ou un nom de couleur reconnu dans les SVG.

### Exemple de dataset obligatoire

dataset_barchart = [

{**category** :"Clouds", **values** : [{value : 5, label : "Wolf"}, {value : 8, label : "Eagle"}, {value : 12, label : "Deer"}, {value : 7, label : "Lion"}, {value : 9, label : "Dragon"}], **fill** : "black"},
    
{**category** :"Flower", **values** : [{value : 10, label : "Wolf"}, {value : 20, label : "Eagle"}, {value : 15, label : "Deer"}, {value : 25, label : "Lion"}, {value : 30, label : "Dragon"}], **fill** : "crimson"},
    
{**category** :"Snow", **values** :  [{value : 6, label : "Wolf"}, {value : 8, label : "Eagle"}, {value : 2, label : "Deer"}, {value : 4, label : "Lion"}, {value : 5, label : "Dragon"}], **fill** : "silver"},
    
{**category** :"Wind", **values** :  [{value : 20, label : "Wolf"}, {value : 30, label : "Eagle"}, {value : 10, label : "Deer"}, {value : 12, label : "Lion"}, {value : 18, label : "Dragon"}], **fill** : "gold"},
    
{**category** :"Moon", **values** :  [{value : 14, label : "Wolf"}, {value : 16, label : "Eagle"}, {value : 24, label : "Deer"}, {value : 8, label : "Lion"}, {value : 17, label : "Dragon"}], **fill** : "lightblue"}

]

### Paramètres optionnels

Le premier paramètre optionnel est une liste de couleurs. Si ce paramètre n'est pas renseigné, la variable fill sera utilisée, mais s'il est renseigné, les couleurs de fill seront remplacées par celles de colors.

Le deuxième paramètre optionnel est vertical bar. C'est un boolean, qui détermine si les barres seront verticales ou horizontales, et donc le sens du graphique. Si non renseigné, sa valeur de base est true. 

Le troisième paramètre optionnel est is_log. C'est encore un boolean, qui offre la possibilité d'appliquer un logarithme népérien aux données avant de les utiliser. Cela permet de comparer des données de différentes échelles. Par défaut, sa valeur est false.

Enfin, le dernier paramètre est la longueur du SVG (qui sera toujours un carré). Cela influencera simplement la taille du graphique.

### Exemple de dataset optionnel

couleurs = ["black", "crimson", "silver", "gold", "steelblue"]

### Exemples d'appels de la fonction

barchart_creator(dataset_barchart)

barchart_creator(dataset_barchart, couleurs, false, true, 300)

barchart_creator(dataset_barchart, undefined, undefined, true)


# Stacked Chart

## Explications

La fonction stackedchart_creator appelle un paramètre obligatoire et 3 paramètres optionnels.

### Paramètre obligatoire

Le paramètre obligatoire est le dataset obtenu après la requête SparQL. Ce dataset doit être une liste de dictionnaires. Chaque dictionnaire est défini en premier lieu par sa catégorie, puis par des valeurs et potentiellement des couleurs. C'est donc le même dataset que pour le barchart.

Il doit donc posséder une variable "category" qui contient simplement le nom de la catégorie,  une variable "values" qui est en réalité un sous dataset, donc une autre liste de dictionnaires.
Ce sous-dataset doit contenir 2 éléments : une variable "label", et une variable "value" qui correspond à la valeur de ce label et de cette catégorie.

Enfin, la variable "fill", qui pourra être remplacée par l'un des paramètres optionnels, sert à déterminer la couleur de chaque catégorie. Elle peut contenir un code couleur ou un nom de couleur reconnu dans les SVG.

### Exemple de dataset obligatoire

dataset_stackedchart = [

{**category** :"Clouds", **values** : [{value : 5, label : "Wolf"}, {value : 8, label : "Eagle"}, {value : 12, label : "Deer"}, {value : 7, label : "Lion"}, {value : 9, label : "Dragon"}], **fill** : "black"},
    
{**category** :"Flower", **values** : [{value : 10, label : "Wolf"}, {value : 20, label : "Eagle"}, {value : 15, label : "Deer"}, {value : 25, label : "Lion"}, {value : 30, label : "Dragon"}], **fill** : "crimson"},
    
{**category** :"Snow", **values** :  [{value : 6, label : "Wolf"}, {value : 8, label : "Eagle"}, {value : 2, label : "Deer"}, {value : 4, label : "Lion"}, {value : 5, label : "Dragon"}], **fill** : "silver"},
    
{**category** :"Wind", **values** :  [{value : 20, label : "Wolf"}, {value : 30, label : "Eagle"}, {value : 10, label : "Deer"}, {value : 12, label : "Lion"}, {value : 18, label : "Dragon"}], **fill** : "gold"},
    
{**category** :"Moon", **values** :  [{value : 14, label : "Wolf"}, {value : 16, label : "Eagle"}, {value : 24, label : "Deer"}, {value : 8, label : "Lion"}, {value : 17, label : "Dragon"}], **fill** : "lightblue"}

]

### Paramètres optionnels

Les paramètres optionnels sont également proches de ceux du barchart. La seule différence est l'absence de la possibilité d'utiliser une échelle logistique.

Le premier paramètre optionnel est une liste de couleurs. Si ce paramètre n'est pas renseigné, la variable fill sera utilisée, mais s'il est renseigné, les couleurs de fill seront remplacées par celles de colors.

Le deuxième paramètre optionnel est vertical bar. C'est un boolean, qui détermine si les barres seront verticales ou horizontales, et donc le sens du graphique. Si non renseigné, sa valeur de base est true.

Enfin, le dernier paramètre est la longueur du SVG (qui sera toujours un carré). Cela influencera simplement la taille du graphique.

### Exemple de dataset optionnel

couleurs = ["black", "crimson", "silver", "gold", "steelblue"]

### Exemples d'appels de la fonction

stackedchart_creator(dataset_stackedchart)

stackedchart_creator(dataset_stackedchart, couleurs, false, 300)

stackedchart_creator(dataset_stackedchart, undefined, undefined, 300)


# Pie chart

## Explications

La fonction piechart_creator appelle un paramètre obligatoire et 2 paramètres optionnels.

### Paramètre obligatoire

Le paramètre obligatoire est le dataset obtenu après une requête SparQL. Ce dataset doit être une liste de dictionnaires. Chaque dictionnaire est défini en premier lieu par sa catégorie, puis par des valeurs et potentiellement des couleurs.

Il doit donc posséder une variable "label" qui contient simplement le nom du label, une variable "value" qui donne la valeur de la catégorie, et enfin une variable "fill" qui pourra être remplacée par l'un des paramètres optionnels, servant à déterminer la couleur de chaque catégorie. Elle peut contenir un code couleur ou un nom de couleur reconnu dans les SVG.

### Exemple de dataset obligatoire

const dataset_piechart = [

{**label** : "Clouds", **value** : 12, **fill** : "black"},
    
{**label** : "Flower", **value** : 19, **fill** : "crimson"},
    
{**label** : "Snow", **value** :  10, **fill** : "gray"},
    
{**label** : "Wind", **value** :  20, **fill** : "gold"},
    
{**label** : "Moon", **value** :  8, **fill** : "steelblue"}

]

### Paramètres optionnels

Le premier paramètre optionnel est une liste de couleurs. Si ce paramètre n'est pas renseigné, la variable fill sera utilisée, mais s'il est renseigné, les couleurs de fill seront remplacées par celles de colors.

Le deuxième paramètre optionnel est la longueur du SVG (qui sera toujours un carré). Cela influencera simplement la taille du graphique.

### Exemple de dataset optionnel

couleurs = ["black", "crimson", "silver", "gold", "steelblue"]

### Exemples d'appels de la fonction

piechart_creator(dataset_piechart)

piechart_creator(dataset_piechart, couleurs, 300)

piechart_creator(dataset_piechart, undefined, 300)


# Nodelink

## Explications

La fonction nodelink_creator appelle un paramètre obligatoire et 3 paramètres optionnels.

### Paramètre obligatoire

Le paramètre obligatoire est le dataset obtenu après une requête SparQL. Ce dataset doit être un dictionnaire contenant des listes de sous-dictionnaires.

Il doit donc posséder une variable "nodes" qui est une liste de dictionnaires, contenant une variable "id" et une variable "nom" pour chaque noeud, aini qu'une variable "links" qui contient une variable "source" et une variable "target", ce qui défini donc les liens entre chaque noeud.

### Exemple de dataset obligatoire

const dataset_nodelink = {

  **nodes** : [
  
    {id: 1, name: "A"},
    {id: 2, name: "B"},
    {id: 3, name: "C"},
    {id: 4, name: "D"},
    {id: 5, name: "E"},
    {id: 6, name: "F"},
    {id: 7, name: "G"},
    {id: 8, name: "H"},
    {id: 9, name: "I"},
    {id: 10, name: "J"}
  ],
  
  **links** : [
  
    {source: 1, target: 2},
    {source: 1, target: 5},
    {source: 1, target: 6},
    {source: 2, target: 3},
    {source: 2, target: 7},
    {source: 3, target: 4},
    {source: 8, target: 3},
    {source: 4, target: 5},
    {source: 4, target: 9},
    {source: 5, target: 10}
    
  ]
}

### Paramètres optionnels

Le premier paramètre optionnel est une liste de 2 couleurs, une pour les noeuds et l'autre pour les liens. Si ce paramètre n'est pas renseigné ou possède un nombre différent de valeurs, les couleurs seront automatiquement rouge et bleu.

Le deuxième paramètre optionnel est le coefficient de la force qui repousse les différents noeuds. Cela définit la répulsion entre les noeuds.

Le dernier paramètre optionnel est la longueur du SVG (qui sera toujours un carré). Cela influencera simplement la taille du graphique.

### Exemple de dataset optionnel

couleurs = ["black", "gold"]

### Exemples d'appels de la fonction

nodelink_creator(dataset_nodelink)

nodelink_creator(dataset_nodelink, couleurs, -200, 300)

nodelink_creator(dataset_nodelink, undefined, undefined, 300)




















