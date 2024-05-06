---
title: "LDviz d3 Part"
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

```{r setup, include=FALSE}
knitr::opts_chunk$set(echo = TRUE)
```

# Website presentation

The website is a simple html page containing for the moment 3 major differents parts.
I will go in detail to review each of them.

## Part 1 : Text Area

The Text Area is the part where the user can enter the SPARQL request which he wants to see the graph of. Once the request is written, the user just have to use the "send" button under the Text Area.

Here is an example of request :

```sparql

CONSTRUCT{ ?endpoint rdf:value ?sparqlNorm } {
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
    ORDER BY ?endpoint ?sparqlNorm
            
```

The dataset obtained with this request should look like this:

```javascript

{
  nodes : [
    {
      col : s,
      id : "https://id.nlm.nih.gov/mesh/sparql",
      label : "https://id.nlm.nih.gov/mesh/sparql",
      place : "mix",
      zoom : false,
    },
    {
      col : o,
      id : "SPARQL10",
      label : "SPARQL10",
      place : "target",
      zoom : false,
    },
    {
      col : s,
      id : "https://ldf.fi/mufi/sparql",
      label : "https://ldf.fi/mufi/sparql",
      place : "mix",
      zoom : false,
    },
    ...
  ],
  links : [
    {
      color : "gold",
      id : 0,
      label : "http://www.w3.org/1999/02/22-rdf-syntax-ns#value",
      source : "https://id.nlm.nih.gov/mesh/sparql",
      target : "SPARQL10"
    },
    {
      color : "gold",
      id : 1,
      label : "http://www.w3.org/1999/02/22-rdf-syntax-ns#value",
      source : "https://ldf.fi/mufi/sparql",
      target : "SPARQL10"
    },
    {
      color : "gold",
      id : 2,
      label : "http://www.w3.org/1999/02/22-rdf-syntax-ns#value",
      source : "https://jsu.eagle-i.net/sparqler/sparql",
      target : "SPARQL10"
    },
    ...
  ],
  legend : [
    {
      label : "source",
      value : "s"
    },
    {
      label : "target",
      value : "o"
    },
    {
      label : "source",
      value : "p"
    }
  ]
}

```


## Part 2 : Table

The table contains the SPARQL results from the select. Those values are spread into x columns based on the variables given in the select part. We choosed 3 variables that will be the nodes and the links of the graph.

The table prints by default 10 lines of data at a time, but the user can explore them and change the lines.

Since there are for the moment no optionnal parameters in the function building the table, you need to simply input the dataset to call the table function in the code. For a user of the interface, there is no need to call anything except the dataset.

```javascript

table_creator(dataset_nodelink)

```


## Part 3 : Graph Results View

The graph results view is the visualisation of the graph result based on the query send by the user.

For the color choices, they can be changed in the parameters of the function. By default, the source nodes are red, and the target nodes are blue. If a node is both source and target (being called by different patterns), then the colors are mixed.

The user can zoom on the graph or on specific nodes (by clicking on those nodes). He can also see the label of each nodes and each link below the table, when his mouse goes over the node or link in question.

The function for the graph result contains a lot of optionnal parameters, but only one necessary : the dataset. In order to call the function, you can use those lines :

```javascript

nodelink_creator(dataset_nodelink) // Call the dataset, with all optional parameters having their default values

nodelink_creator(dataset_nodelink, ["green", "yellow"], mixed_color = "blue", strength = -100, width = 300, height = 300, node_named = true, link_named = false, node_zoom = true, zoom_strenght = 3, number_ticks = 200) // Give a different value to each different parameter

nodelink_creator(dataset_nodelink, undefined, "gold", -25, 500, undefined, false, true, false) // Give values to some parameters, and exclude others

```



# Things to improve

Put buttons with the different possible colors for the legend.

Allow to change the number of lines in the dataset.


















