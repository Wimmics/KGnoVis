The LDViz library is a javascript library created in order to facilitate the creation of SPARQL graphs. When used, a website page is temporarily created, allowing the user to post a SPARQL request, and obtain the results in a table and in a graph results. Later, a graph pattern will be added to the page.

This presentation focus on the code, and is directed toward a Javascript developper.

# Website presentation

The website is a simple html page containing for the moment 3 major differents parts.
I will go in detail to review each of them.

![photo du site](Page nodelink-SparQL.png)

### Rajouter une photo de la page, why the website

## Part 1 : Text Area

The Text Area is the part where the user can enter the SPARQL request which he wants to see the graph of. Once the request is written, the user just have to use the "send" button under the Text Area.

Once the send button is clicked, the results are put in an object named "result_data", and the edges are hard-defined in the code. In the futur, those edges will be choosen on the website by the user.

Then, these results and the edges are send in 3 different functions to create the nodes, the links, and the legend. Those 3 elements are finally put in a dataset.

The dataset obtained should look like this:

```javascript

{
  let  dataset_nodelink = {
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

```javascript

nodelink_creator(dataset_nodelink)

```

For the color choices, they can be changed in the parameters of the function. By default, the source nodes are red, and the target nodes are blue. If a node is both source and target (being called by different patterns), then the colors are mixed.

The user can zoom on the graph or on specific nodes (by clicking on those nodes). They can also see the label of each nodes and each link below the table, when his mouse goes over the node or link in question.

Here is a call with all parameters : 

```javascript

nodelink_creator(dataset_nodelink,
                ["green", "yellow"], mixed_color = "blue",
                strength = -100, width = 300, height = 300,
                node_named = true, link_named = false,
                node_zoom = true, zoom_strenght = 3,
                number_ticks = 200)

```

Finally, you can here see an example of a call with only some parameters

```javascript

nodelink_creator(dataset_nodelink, undefined, "gold", -25, 500, undefined, false, true, false)

```

# Things to improve

Put buttons with the different possible colors for the legend.

Allow to change the number of lines in the dataset.

Ajout que le graph result est un objet déclaré par le développeur suivi de 2 blocks (1 creation objet, puis appel à nodelink-dataset)
Refaire l'intro (en faire une vraie)

1 doc dev, 1 doc user













