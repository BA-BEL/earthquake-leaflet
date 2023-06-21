

let map = L.map("map", {
    center: [0, -40],
    zoom: 3
});

// L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
//     maxZoom: 17,
//     attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
// }).addTo(map);

// L.tileLayer('https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png', {
// 	maxZoom: 18,
// 	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// }).addTo(map);

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 20
}).addTo(map);

let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson";

const getColor = depth => depth > 90 ? "red" : depth > 70 ? "orange": depth > 50 ? "yellow" :depth > 30 ? "green": depth > 10 ? "lightgreen": "lightblue";

let x;
d3.json(url).then(({ features }) => {
    x = features;

    features.forEach(obj => {

        let { properties: { mag, place, url},
            geometry: { coordinates: [lon, lat, depth] } } = obj;

        L.circle([lat, lon], {
            radius: Math.pow((mag * 15), 3),
            color: getColor(depth),
            opacity: 0.6,
            fillColor: getColor(depth),
            fillOpacity: 0.5
        }).bindPopup(`<p>
                        ${place} | <a href = "${url}" target = "_blank">Go to event</a> <br>
                        Magnitude: ${mag} <br>
                        Depth: ${depth}
                        </p>`).addTo(map);

    });

});


let legend = L.control({position: "bottomright"});

legend.onAdd = function(){
    let div = L.DomUtil.create('div', 'Legend');
    div.innerHTML += '<h2>Depth</h2>'
    div.innerHTML += '<h3 style = "background:red">90+</h3>';
    div.innerHTML += '<h3 style = "background:orange">70-90</h3>';
    div.innerHTML += '<h3 style = "background:yellow">50-70</h3>';
    div.innerHTML += '<h3 style = "background:green">30-50</h3>';
    div.innerHTML += '<h3 style = "background:lightgreen">10-30</h3>';
    div.innerHTML += '<h3 style = "background:lightblue">10-</h3>';
    return div;
}
legend.addTo(map);

