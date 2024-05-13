This library is a javascript library created in order to facilitate the creation of SPARQL graphs. When used, a website page is temporarily created, allowing the user to post a SPARQL request, and obtain the results in a table and in a graph results. Later, a graph pattern will be added to the page.

This presentation focus on the website, and is directed toward a user point of view.

# Website presentation

The website is a simple html page containing for the moment 3 major different parts.
I will go in detail to review each of them.

![photo du site](Page nodelink-SparQL.png)

## Part 1 : Text Area

The Text Area is the part where the user can enter the SPARQL request which he wants to see the graph of. Once the request is written, the user just have to use the "send" button under the Text Area.

### Expliquer utilisation requête

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

## Part 2 : Table

The table contains the SPARQL results from the select. Those values are spread into x columns based on the variables given in the select part. We've manually defined in the code 3 variables that will be the nodes and the links of the graph.

The table displays by default 10 lines of data at a time, but the user can explore them.

## Part 3 : Graph Results View

The graph results view is a nodelink representing the graph result based on the query sent by the user. A default graph is created when the request is sent, but the user will be able to modify it.

2 colors are choosen by default for the nodes (red: for the source, blue: for the target), and for the nodes that are both source and target, a third color is created by mixing both colors.

The user can zoom on the graph (by wheeling) or on specific nodes (by clicking on those nodes). They can also see the label of each node and each link below the table, when their mouse goes over the node or link in question.

# Things to improve

Add a support interaction that enable the user to choose the color of different elements of the vizualisation.

Allow to change the number of lines display in the table.

Allow the user to choose which column is defined as source, target, and link.
