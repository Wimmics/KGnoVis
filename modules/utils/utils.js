const displayCode = (tag, text) => {
    document.querySelector(tag).textContent = `${JSON.stringify(text, null, "\t")}`;
}

const executeSPARQLRequest = async (endpoint, query) => {
    localStorage.clear()
    const url = `${endpoint}?query=${encodeURIComponent(query)}&format=json`;
    let result_data = await fetch(url, {
        headers: {
            Accept: "application/sparql-results+json"
        }  
    }).then( 
        response => response.json()
        ).then(data => data)
    return result_data
}

export { executeSPARQLRequest };
export { displayCode };

