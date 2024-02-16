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

La fonction bar chart appelle 1 paramètre obligatoire et 4 paramètres optionnels.

### Paramètre obligatoire

Le paramètre obligatoire est le dataset obtenu après la requête SparQL. Ce dataset doit être une liste de dictionnaire. Chaque dictionnaire est défini en premier lieu par sa catégorie, puis par des valeurs et potentiellement des couleurs.

Il doit donc posséder une variable "category" qui contient simplement le nom de la catégorie,  une variable "values qui est en réalité un sous dataset, donc une autre liste de dictionnaires.
Ce sous-dataset doit contenir 2 éléments : une variable "label", et une variable "value" qui correspond à la valeur de ce label et de cette catégorie.

Enfin, la variable "fill" qui pourra être remplacée par l'un des paramètres optionnels, sert à déterminer la couleur de chaque catégorie. Elle peut contenir un code couleur ou un nom de couleur reconnu dans les SVG.

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
barchart_creator(dataset_barchart, couleurs, false, true, longueur = 300)
barchart_creator(dataset_barchart, undefined, undefined, true)


# Stacked Chart


























