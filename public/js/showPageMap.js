mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', 
    style: 'mapbox://styles/mapbox/streets-v11', 
    center: workspot.geometry.coordinates,
    zoom: 13
});

new mapboxgl.Marker()
.setLngLat(workspot.geometry.coordinates)
.setPopup(
    new mapboxgl.Popup({offset: 25})
    .setHTML(
        `<h3>${workspot.title}</h3><p>${workspot.location}</p>`
    )
)
.addTo(map)
