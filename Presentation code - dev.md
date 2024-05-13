This library is a javascript library created in order to facilitate the creation of SPARQL graphs. When used, a website page is temporarily created, allowing the user to post a SPARQL request, and obtain the results in a table and in a graph results. Later, a graph pattern will be added to the page.

This presentation focus on the code, and is directed toward a Javascript developper.

# Website presentation

The website is a simple html page containing for the moment 3 major differents parts.
I will go in detail to review each of them.

![photo du site](Page nodelink-SparQL.png)

## Part 1 : Text Area

The Text Area is the part where the user can enter the SPARQL request which he wants to see the graph of. Once the request is written, the user just have to use the "send" button under the Text Area.

Once the send button is clicked, the results are put in an object named "result_data", and the edges are defined manually in the code. In the futur, those edges will be choosen on the website by the user.

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

The table uses the Grid.js library.

The table contains the SPARQL results from the select. Those values are spread into x columns, based on the variables given in the select part. We manually defined 3 variables that will be the nodes and the links of the graph.

The table prints by default 10 lines of data at a time, but the user can explore them and change the lines.

Since there are for the moment no optionnal parameters in the function building the table, you need to simply input the dataset to call the table function in the code. The function render the table and requires only one parameter that is the dataset.

```javascript

table_creator(dataset_nodelink)

```

## Part 3 : Graph Results View

The graph results view is the visualisation of the graph result based on the query sent by the user.

The only mandatory parameter is the dataset, all other paramaters are optionnal.

```javascript

nodelink_creator(dataset_nodelink)

```

To personnalize the graph render, the color parameter can be changed. By default, the source nodes are red, and the target nodes are blue. If a node is both source and target, then node colors are mixed.

The user can zoom on the graph (by wheeling) or on specific nodes (by clicking on those nodes). They can also see the label of each node and each link in a specific area below the table, when their mouse goes over the node or link in question.

Here is a call with all parameters : 

```javascript

nodelink_creator(dataset_nodelink,
                ["green", "yellow"], mixed_color = "blue",
                strength = -100, width = 300, height = 300,
                node_named = true, link_named = false,
                node_zoom = true, zoom_strenght = 3,
                number_ticks = 200)

```

Not all the parameters are mandatory, you can here see an example of a call with only some parameters.

```javascript

nodelink_creator(dataset_nodelink, undefined, "gold", -25, 500, undefined, false, true, false)

```

# Things to improve

Add a support interaction that enable the user to choose the color of different elements of the vizualisation.

Allow to change the number of lines display in the table.

Allow the user to choose which column is defined as source, target, and link.
