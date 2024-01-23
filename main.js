import * as dependencies from "./modules/modulesDependencies.js";
import loadChartViz from "./modules/visualisationManager.js";


const endpoint = "http://54.36.123.165:8890/sparql/";
const query = `PREFIX oa:     <http://www.w3.org/ns/oa#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX schema:  <http://schema.org/>
SELECT DISTINCT ?name_construction (COUNT(DISTINCT(?name_animal)) as ?nb)  WHERE {
?annotation1 oa:hasBody ?animal ; oa:hasTarget [ oa:hasSource ?paragraph; oa:hasSelector [ oa:exact ?mention_animal]].
?animal skos:prefLabel ?name_animal.
?animal_collection a skos:Collection;
skos:prefLabel "Ancient class"@en;
skos:member ?animal.

?annotation2 oa:hasBody ?construction;
oa:hasTarget [oa:hasSource ?paragraph;
    oa:hasSelector [oa:exact ?mention_construction]].
?paragraph schema:text ?text.

?construction skos:prefLabel ?name_construction;
            skos:broader+ ?construction_generique.
?construction_generique skos:prefLabel "house building"@en.

FILTER NOT EXISTS {?x  skos:broader ?animal}
FILTER (lang(?name_animal) = "en")
FILTER (lang(?name_construction) = "en")
}
GROUP BY ?name_construction`;

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

const query_deka2 = `SELECT DISTINCT ?endpointUrl (MAX(?rawO) AS ?o) {
GRAPH ?g {
{ ?curated <http://www.w3.org/ns/sparql-service-description#endpoint> ?endpointUrl . }
UNION { ?curated <http://rdfs.org/ns/void#sparqlEndpoint> ?endpointUrl . }
UNION { ?curated <http://www.w3.org/ns/dcat#endpointURL> ?endpointUrl . }
?metadata <http://ns.inria.fr/kg/index#curated> ?curated .
?curated <http://rdfs.org/ns/void#triples> ?rawO .
}
} GROUP BY ?endpointUrl`

const parameters = {
    endpoint : "http://prod-dekalog.inria.fr/sparql",
    query : query_deka,
    type : 'bar',
    title : "Number feature per norm",
    config : [{
        category : "sparqlNorm",
        label : "endpoint",
        value : "count"
    }]

}
loadChartViz("dekalog-1", parameters);

const parameters2 = {
    endpoint: "http://prod-dekalog.inria.fr/sparql",
    query: query_deka2,
    type: "barchart",
    title: "Barchart of number of classes, properties and triples per endpoint",
    config: [{
        category : "nb triples",
        label : "endpoint",
        value : "triples"
    },
    {
        category : "nb classes",
        label : "endpoint",
        value : "classes"
    },
    {
        category : "nb properties",
        label : "endpoint",
        value : "properties"
    }
]
}
loadChartViz("dekalog-2", parameters2)