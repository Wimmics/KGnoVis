# KGnoVis - A visualisation library of RDF Knowledge graph for developers

## Context

As RDF knowledge graphs are increasingly used, the creation of visualization tools for them becomes particularly necessary. With this in mind, we propose a knowledge graph visualization library called KGnoVis. The library is designed for developers to assist them in building custom applications. KGnoVis is a continuation of the proof of concept MGExplorer.


## Installation

To use the library, you need to clone the repos in your current project and add the following dependencies in your main HTML file:

```HTML
    <link rel="stylesheet" href="css/prism.css">
    <link rel="stylesheet" href="css/leaflet.css">
    <script src="/lib/echarts.js" defer></script>
    <script src="https://d3js.org/d3.v6.js" defer></script>
    <script src="/lib/leaflet-src.js" defer></script>
```


## Getting started

To load a visualisation, you need to define first the division which the visualisation will be in.

```HTML
    <div id="chart-to-render" style="width: 600px; height: 400px;">
    <div>
```

The visualisation require a parameter object which contains:
- The SPARQL endpoint URL to be queried,
- The SPARQL query,
- The type of visualisation you want
- A config array which link SPARQL query variables to visualisation parameters. *This config object is different for all kind of visualisation, please my refer to documentation*
- An options array which add visualisation customisation

The `loadChartViz` function require both div id and parameters object to initiate the visualisation rendering. The following code

```js
const simple_parameter= {
    endpoint: "http://localhost:8080/sparql",
    query: sparql_query,
    type: 'bar',
    config: [{
        label: "teamname",
        value: "person_name",
    }],
    options: [{}]
}

loadChartViz("chart-to-render", simple_parameter)
```

## documentation
### e-charts engine

#### Barchart [e-charts]

Also known as Bar Graph or Column Graph. A Bar Chart uses either horizontal or vertical bars (column chart) to show discrete, numerical comparisons across categories. One axis of the chart shows the specific categories being compared and the other axis represents a discrete value scale. Bar Charts are distinguished from Histograms, as they do not display continuous developments over an interval. Instead, Bar Chart's discrete data is categorical and therefore answers the question of "how many?" in each category.

Source: [Dataviz Catalog - Barchart](https://datavizcatalogue.com/methods/bar_chart.html)

```js
const parameters_ex_1 = {
    endpoint: endpoint_local,
    query: query_ex_1,
    type: 'bar',
    title: "Number of people per team",
    config: [{
        label: "teamname",
        value: "nb_person"
    }]
}
```

```SPARQL
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
prefix ex:      <http://www.example.org/ontology#>

SELECT ?teamname (count(?person) as ?nb_person) WHERE {
    ?person ex:belong ?team.
    ?team ex:Name ?teamname.
}GROUP BY ?team
```

__Specific parameters__:

- **stacked**: boolean [true, false] (false by default). Stack all bar of the category
```js
 stacked: true 
```
- **scale**: string [linear, log] ('linear' by default). Change the scale base of bar value.
```js
 scale: 'log' 
```
- **display**: string [row, column] ('column' by default). Change orientation of barchart.
```js
 display: 'row' 
```
__Config parameter__:

- **label**: string. Specify label values using the SPARQL variable.

```js
config: [{
    label: 'endpointUrl'
}]
```

- **value**: string. Specify numeric values using SPARQL variable.

```js
config: [{
    value: 'triples'
}]
```

- **category**: string. Specify set of values using SPARQL variable.
```js
config: [{
    category: 'number of triples'
}]
```

Example with one pair of SPARQL variable

```js
config: [{
    label: 'endpointUrl',
    value: 'triples',
    category: 'nb_triple'
}]
```

Example with multiple pair of SPARQL variable (**multi-set barchart**):
```js
config: [{
    label: 'endpointUrl',
    value: 'triples',
    category: "number of triples"
},{
    label: 'endpointUrl',
    value: 'classes',
    category: 'number of classes'
}]
```

#### Nodelink [e-charts]

 Also known as Network Graph, Network Map, Node-Link Diagram. This type of visualisation shows how things are interconnected through the use of nodes and link lines to represent their connections and help illuminate the type of relationships between a group of entities. Typically, nodes are drawn as little dots or circles, but icons can also be used. Links are usually displayed as simple lines connected between the nodes. However, in some Network Diagrams, not all of the nodes and links are created equally: additional variables can be visualised, for example, by making the node size or link stroke weight proportion to an assigned value. By mapping out connected systems, Network Diagrams can be used to interpret the structure of a network by looking for any clustering of the nodes, how densely nodes are connected or how the diagram layout is arranged. The two notable types of Network Diagrams are "undirected" and "directed". Undirected Network Diagrams only display the connections between entities, while directed Network Diagrams show if the connections are one-way or two-way through small arrows. Network Diagrams have a limited data capacity and start to become hard to read when there are too many nodes and resemble "hairballs".

Source: [Dataviz catalog - Network diagram](https://datavizcatalogue.com/methods/network_diagram.html)

```js
const parameters_oriented = {
    endpoint: endpoint_local,
    query: query_oriented,
    oriented: true,
    display: 'force',
    type: 'graph',
    config: [{
        source: "teamname",
        target: "person_name",
    }, {
        source: "person_name",
        target: "paper",
        relation: "author"
    }],
    options: [{
        name: "teamname",
        color: "red"
    }, {
        name: "person_name",
        color: "blue",
    }, {
        name: "paper",
        color: "green"
    }]
}
loadChartViz("oriented-simple", parameters_oriented)
```

```sparql
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
prefix ex:      <http://www.example.org/ontology#>

SELECT ?teamname ?person_name ?paper WHERE {
    ?paper ex:author ?person;
            ex:year ?year.
    ?person ex:belong ?team;
            ex:Name ?person_name.
    ?team ex:Name ?teamname.
}
```

Few parameters available can customise the display of the nodelink.

- **animation**: boolean [true, false] (false by default). This parameter specify if the render should be animated or not.
```js
animation: true
```
- **oriented**: boolean [true, false] (false by default).
```js
oriented: true
```
- **display**: string [force, circular] (force by default). This parameter specify the render algorithm used to display the nodelink.
```js
display: "force"
```

The nodelink visualisation requiere 2 mandatory keys: (1) the source and (2) the target. The definition of a graph is based on the edge definition with the source and target of this edge. The library automatically build the set of nodes by extracting them from the source and target variable. A extra key relation can be specified to name the label of the edge. The config parameter takes an array of object.

- **source**: string. The source key specify which SPARQL variable will be used to define the source nodes of the graph.

```js
config: [{
    source: 'person'
}]
```

- **target**: string. The target key specify which SPARQL will be used to define the target nodes of the graph.

```js
config: [{
    target: 'team'
}]
```

- **relation**: string (Optional). The relation key specify which SPARQL variable will be used to define the label of the edge. You can define a name which is not a SPARQL variable.

```js
config: [{
    relation: 'belong to'
}]
```

You can specify multiple pattern of edges in the config definition. The following lines of code show a full example of edge pattern.

```js
config: [{
    source: 'person',
    target: 'team'
},{
    source: 'person',
    target: 'city'
}]
```

You can customise the color of the nodes or edge by specifying the SPARQL variable name and the color.
```js
options: [{
    name: 'person',
    color: 'red'
},{
    name: 'belong to',
    color: 'green'
}]
```

#### Piechart [e-charts]

### d3 engine

#### Dotmap [d3]

Also known as a Point Map, Dot Distribution Map, Dot Density Map. Dot Maps are a way of detecting spatial patterns or the distribution of data over a geographical region, by placing equally sized points over a geographical region. There are two types of Dot Map: one-to-one (one point represents a single count or object) and one-to-many (one point represents a particular unit, e.g. 1 point = 10 trees). Dot Maps are ideal for seeing how things are distributed over a geographical region and can reveal patterns when the points cluster on the map. Dot Maps are easy to grasp and are better at giving an overview of the data, but are not great for retrieving exact values. 

Source: [Dataviz Catalog - Dot map](https://datavizcatalogue.com/methods/dot_map.html)

```js
<div id="map1"></div>

const parameters_geomap1 = {
    endpoint: "http://localhost:8080/sparql",
    query: query_weKG,
    title: "Geomap test",
    type: 'map',
    config: [{
        latitude: "lat",
        longitude: "lon",
        label: "endpoint"
    }],
    option: {
        render: "simple"
    }
}

loadChartViz("map1", parameters_geomap1);
```

```sparql
SELECT DISTINCT ?endpoint ?lat ?lon {
    ?endpoint void:sparqlEndpoint ?endpoint ;
        pav:createdAt ?coord .
    ?coord geo:lat ?lat ;
        geo:lon ?lon .
}
```

The Dotmap visualisation require 3 mandatory visualisation parameters: latitude, longitude, label.
Latitude and longitude has to be a decimal degree (DD) value to work.

You can personalise the map rendering with the option parameter. Two map rendering is available: simple and leaflet rendering.

