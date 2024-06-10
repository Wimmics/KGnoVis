const buildMarkers = (geoData, ctx) => {
    const markers = []
    for (const marker of geoData) {
        markers.push(L.marker([marker.coordinate.latitude, marker.coordinate.longitude]).bindPopup(`<a href="${marker.name}" target="_blank">${marker.name}</a>`).addTo(ctx))
    }
    return
}

const render = (context, data) => {
    const map = L.map(context).setView([51.505, -0.09], 4)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="">OpenStreetMap</a>'
    }).addTo(map)

    let markers = buildMarkers(data, map)

    return map
}

export { render };