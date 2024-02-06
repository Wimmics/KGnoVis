import loadChartViz from "./modules/visualisationManager.js";
import { displayCode } from "./modules/utils/utils.js";

const endpoint_local = "http://localhost:8080/sparql";
const query_ex_1 = `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
prefix ex:      <http://www.example.org/ontology#>

SELECT ?teamname ?year (count(?paper) as ?nb_paper) WHERE {
  ?paper ex:author ?person;
          ex:year ?year.
  ?person ex:belong ?team.
  ?team ex:Name ?teamname.
}
GROUP BY ?team ?year`;

const parameters_ex_1 = {
    endpoint: endpoint_local,
    query: query_ex_1,
    type: 'bar',
    title: "Number of article per team per year",
    config : [{
        category: "year",
        label: "teamname",
        value: "nb_paper"
    }]
};
loadChartViz("ex-bar1", parameters_ex_1)

const query_bar_2 = `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
prefix ex:      <http://www.example.org/ontology#>

SELECT ?teamname ?nb_person ?nb_paper WHERE{
  {SELECT ?teamname (count(?person) as ?nb_person) WHERE {
    ?person ex:belong ?team.
    ?team ex:Name ?teamname.
  }GROUP BY ?team}
  
  { SELECT ?teamname (count(?paper) as ?nb_paper) WHERE {
        ?paper ex:author ?person;
                ex:year ?year.
        ?person ex:belong ?team.
        ?team ex:Name ?teamname.
  }GROUP BY ?team }}`

const parameters_bar_2 = {
    endpoint: endpoint_local,
    query: query_bar_2,
    type: 'bar',
    title: "Number of paper and number of person per team",
    config : [{
            category: "nb paper",
            label: "teamname",
            value: "nb_paper"
        },
        {
            category: "nb person",
            label: "teamname",
            value: "nb_person"
        }
    ]
};
loadChartViz("ex-bar2", parameters_bar_2)

const parameters_bar_3 = {
    endpoint: endpoint_local,
    query: query_bar_2,
    type: 'bar',
    title: "Number of paper and number of person per team",
    config : [{
        label: "teamname",
        value: "nb_paper"
    },
    {
        label: "teamname",
        value: "nb_person"
    }]
}
loadChartViz("ex-bar3", parameters_bar_3)

const parameters_stacked_bar = {
    endpoint: endpoint_local,
    query: query_bar_2,
    type: 'bar',
    stacked: true,
    title: "Number of paper and number of person per team",
    config : [{
        label: "teamname",
        value: "nb_paper"
    },
    {
        label: "teamname",
        value: "nb_person"
    }]
}
loadChartViz("stacked-bar", parameters_stacked_bar)

const query_pie_1 = `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
prefix ex:      <http://www.example.org/ontology#>

SELECT ?teamname (count(?person) as ?nb_person) WHERE {
  ?person ex:belong ?team.
  ?team ex:Name ?teamname.
}GROUP BY ?team`

const parameters_ex_pie = {
    endpoint: endpoint_local,
    query: query_pie_1,
    type: 'pie',
    title: "Number of people per team",
    config : [{
        label: "teamname",
        value: "nb_person"
    }]
}

loadChartViz("ex-pie", parameters_ex_pie)

const paramters_simple_bar = {
    endpoint: endpoint_local,
    query: query_pie_1,
    type: 'bar',
    title: "Number of people per team",
    config : [{
        label: "teamname",
        value: "nb_person"
    }]
}
loadChartViz("simple-bar", paramters_simple_bar)

const parameters_simple_bar_row = {
    endpoint: endpoint_local,
    query: query_pie_1,
    type: 'bar',
    display: "row",
    title: "Number of people per team",
    config : [{
        label: "teamname",
        value: "nb_person"
    }]
}
loadChartViz("simple-bar-row", parameters_simple_bar_row)


const query_deka = `SELECT DISTINCT ?endpoint ?sparqlNorm (COUNT(DISTINCT ?activity) AS ?count) {
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
ORDER BY ?endpoint ?sparqlNorm`;

const query_deka2 = `SELECT DISTINCT ?endpointUrl (MAX(?rawO) AS ?triples)  (MAX(?raw1) AS ?classes)  (MAX(?raw2) AS ?properties) {
GRAPH ?g {
{ ?curated <http://www.w3.org/ns/sparql-service-description#endpoint> ?endpointUrl . }
UNION { ?curated <http://rdfs.org/ns/void#sparqlEndpoint> ?endpointUrl . }
UNION { ?curated <http://www.w3.org/ns/dcat#endpointURL> ?endpointUrl . }
?metadata <http://ns.inria.fr/kg/index#curated> ?curated .
?curated <http://rdfs.org/ns/void#triples> ?rawO .
?curated <http://rdfs.org/ns/void#triples> ?rawO .
?curated <http://rdfs.org/ns/void#classes> ?raw1 .
?curated <http://rdfs.org/ns/void#properties> ?raw2 .
}
} GROUP BY ?endpointUrl`

const query_deka3 = `SELECT DISTINCT ?endpointUrl (MAX(?raw2) AS ?properties) {
    GRAPH ?g {
        { ?curated <http://www.w3.org/ns/sparql-service-description#endpoint> ?endpointUrl . }
        UNION { ?curated <http://rdfs.org/ns/void#sparqlEndpoint> ?endpointUrl . }
        UNION { ?curated <http://www.w3.org/ns/dcat#endpointURL> ?endpointUrl . }
        ?metadata <http://ns.inria.fr/kg/index#curated> ?curated .
    	?curated <http://rdfs.org/ns/void#properties> ?raw2 .
    }
} GROUP BY ?endpointUrl`

const query_4 = `PREFIX oa:     <http://www.w3.org/ns/oa#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX schema:  <http://schema.org/> 
PREFIX paragraph: <http://www.zoomathia.com/>

SELECT DISTINCT ?paragraph 
	(str(?name_animal) as ?animal)
	(str(?name_relation) as ?relationship)
	(str(?name_anthro) as ?anthroponyme) 
WHERE {
  ?annotation1 a oa:Annotation; oa:hasBody ?animal;
	oa:hasTarget [ oa:hasSource ?paragraph;
      oa:hasSelector [ oa:exact ?mention_animal]].

  ?annotation2 oa:hasBody ?relation;
        oa:hasTarget [oa:hasSource ?paragraph;
                      oa:hasSelector [ oa:exact ?mention_relation]].

   ?annotation3 oa:hasBody ?anthro;
        oa:hasTarget [ oa:hasSource ?paragraph;
                       oa:hasSelector [oa:exact ?mention_anthro]].

  ?animal a skos:Concept;
       skos:prefLabel ?name_animal.
  ?animal_collection a skos:Collection;
       skos:prefLabel "Ancient class"@en;
       skos:member ?animal.

  ?relation skos:prefLabel ?name_relation;
     	            skos:broader+ ?relation_generique.
  ?relation_generique skos:prefLabel  "special relationship"@en.

 ?anthro skos:prefLabel ?name_anthro.
 ?anthro_collection skos:prefLabel ?anthro_collection_name;
	skos:member ?anthro.

  FILTER (lang(?name_animal) = "en").
  FILTER (lang(?name_relation) = "en")
  FILTER (lang(?name_anthro) = "en")
  FILTER (?anthro_collection_name in ("Place"@en, "Anthroponym"@en))
}
ORDER BY ?paragraph`;

const parameters = {
    endpoint : "http://prod-dekalog.inria.fr/sparql",
    query : query_deka,
    type : 'bar',
    stacked: true,
    title : "Number feature per norm",
    config : [{
        category : "sparqlNorm",
        label : "endpoint",
        value : "count"
    }]
}
loadChartViz("dekalog-1", parameters);
displayCode("#parameters-dekalog1", parameters);

const parameters2 = {
    endpoint: "http://prod-dekalog.inria.fr/sparql",
    query: query_deka2,
    type: "bar",
    title: "Barchart of number of classes, properties and triples per endpoint",
    scale: "log",
    display: "row",
    config: [{
        category : "nb triples",
        label : "endpointUrl",
        value : "triples"
    },
    {
        category : "nb classes",
        label : "endpointUrl",
        value : "classes"
    },
    {
        category : "nb properties",
        label : "endpointUrl",
        value : "properties"
    }]
}
loadChartViz("dekalog-2", parameters2)

const parameters3 = {
    endpoint: "http://prod-dekalog.inria.fr/sparql",
    query: query_deka3,
    type: "pie",
    title: "Piechart of number of properties per endpoint",
    config: [
        {
            label: "endpointUrl",
            value: "properties"
        }
    ]
}
loadChartViz("dekalog-3", parameters3);
displayCode("#piechart-deka", parameters3);

const parameters4 = {
    endpoint: "http://54.36.123.165:8890/sparql",
    query: query_4,
    type: "graph",
    animation: false,
    oriented: true,
    display: 'force',
    title: "Relationship between human, place and animal",
    config: [
        {
            source:"animal",
            target:"anthroponyme",
            relation:"relationship"
        }
    ],
    options: [{
        name: "animal",
        color: "brown"
    },{
        name: "anthroponyme",
        color: "purple"
    }
]
}
loadChartViz("zoomathia", parameters4);

const query_node_deka = `SELECT DISTINCT ?endpointUrl ?vocabulary {
    GRAPH ?g {
        { ?curated <http://www.w3.org/ns/sparql-service-description#endpoint> ?endpointUrl . }
        UNION { ?curated <http://rdfs.org/ns/void#sparqlEndpoint> ?endpointUrl . }
        UNION { ?curated <http://www.w3.org/ns/dcat#endpointURL> ?endpointUrl . }
        ?metadata <http://ns.inria.fr/kg/index#curated> ?curated .
        ?curated <http://rdfs.org/ns/void#vocabulary> ?vocabulary .
    }
      VALUES ?vocabulary { <http://www.w3.org/1999/02/22-rdf-syntax-ns#> <http://www.w3.org/2000/01/rdf-schema#> <http://www.w3.org/ns/shacl#> <http://www.w3.org/2002/07/owl#> <http://www.w3.org/2004/02/skos/core#> <http://spinrdf.org/spin#> <http://www.w3.org/2003/11/swrl#> }
} GROUP BY ?endpointUrl`

const parameters_node_deka = {
    endpoint: "http://prod-dekalog.inria.fr/sparql",
    query: query_node_deka,
    title: "Vocabularies used by endpoint",
    display: 'force',
    type: "graph",
    config: [{
        source:"endpointUrl",
        target:"vocabulary",
        relation: "use"
    }],
    options: [{
        name: "endpointUrl",
        color: "blue"
    },{
        name: "vocabulary",
        color: "red"
    }]
}
loadChartViz("deka-node", parameters_node_deka)

const query_oriented = `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
prefix ex:      <http://www.example.org/ontology#>

SELECT ?teamname ?person_name ?paper WHERE {
      ?paper ex:author ?person;
              ex:year ?year.
      ?person ex:belong ?team;
              ex:Name ?person_name.
      ?team ex:Name ?teamname.
}`;

const parameters_oriented = {
    endpoint: endpoint_local,
    query: query_oriented,
    //oriented: true,
    display: 'force',
    type: 'graph',
    config: [{
        source: "teamname",
        target: "person_name",
        show: true
    },{
        source: "person_name",
        target: "paper",
        relation: "author"
    }],
    options: [{
        name: "teamname",
        color: "red"
    },{
        name: "person_name",
        color: "blue",
        show:true
    },{
        name: "paper",
        color: "green"
    }]
}
loadChartViz("oriented-simple", parameters_oriented)