const displayCode = (tag, text) => {
    document.querySelector(tag).textContent = `${JSON.stringify(text, null, "\t")}`;
}

const executeSPARQLRequest = async (endpoint, query) => {
    const url = endpoint + "?query=" + encodeURIComponent(query) + "&format=json";
    return await fetch(url).then( response => response.json()).then(data => {return data})
}

export { executeSPARQLRequest };
export { displayCode };

