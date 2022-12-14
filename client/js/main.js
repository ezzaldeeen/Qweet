import { TWITTER_SERVICE_GET_ENDPOINT } from "./api_key.js";
import { 
    getDrawConrolOptions } from "./draw_control.js";
import { 
    BASE_VIEW_SETTINGS,
    BASE_MAP_CONFIG,
    BASE_TILE_LAYER } from "./map_config.js";

// create the map canvas based on the given
// configuration and the view settings
const map = L.map("map", BASE_MAP_CONFIG)
             .setView([BASE_VIEW_SETTINGS.lat,
                       BASE_VIEW_SETTINGS.lon], BASE_VIEW_SETTINGS.zoom);
// adding the osm tilelayer to the map canvas
L.tileLayer(BASE_TILE_LAYER.uri, BASE_TILE_LAYER.att).addTo(map);
// create layer group in order to hold the markers
let markerLayer = L.layerGroup()
// create feature group in order to hold the rectangles
let editableLayers = new L.FeatureGroup();
map.addLayer(editableLayers);
// in order to hold the last coordinates of bounding box
let boundingBoxCoords;

createDrawConrtol()

// adding an empty heatmap layer with base options
let heatLayer = L.heatLayer([],
    {   radius: 25,
        minOpacity: 0.4,
        max: 0.001,
        gradient: { 0.4: 'blue', 0.5: 'lime', 0.6: 'red' }
    }).addTo(map);

// event listeners for both click and input
// in order to do a request to the server on these two events
const btn = document.getElementById('search-button');
btn.addEventListener('click', process);

const input = document.getElementById('search-bar');
input.addEventListener('input', process)

async function process() {
    // make sure that the map canvas has no markers
    map.removeLayer(markerLayer)
    // getting the text field
    const text = document.getElementById("search-bar").value

    // setting the base coordinates for the bounding box
    let top_left_lat = 90
    let top_left_lon = -180
    let bottom_right_lat = -90
    let bottom_right_lon = 180

    if (boundingBoxCoords) {
        // getting coordinates from the bounding box
        top_left_lat = boundingBoxCoords[1].lat
        top_left_lon = boundingBoxCoords[1].lng
        bottom_right_lat = boundingBoxCoords[3].lat
        bottom_right_lon = boundingBoxCoords[3].lng   
    }

    // todo: get required coordinates
    const payload = {
        text: text,
        top_left_lat: top_left_lat,
        top_left_lon: top_left_lon,
        bottom_right_lat: bottom_right_lat,
        bottom_right_lon: bottom_right_lon
    }
    // getting hits of the server response
    const response = await getTweets(TWITTER_SERVICE_GET_ENDPOINT, payload);
    const hits = response['response']['hits']['hits']
    console.log(hits.length)
    // transform the hits into tweets with their source, and scores
    const tweets = hits.map(hit => {
        return { 
            source: hit['_source'],
            score: hit['_score']
        }
    })
    // if there's a tweets matches the query
    if (tweets.length > 0) {
        renderHeatLayer(tweets, heatLayer)
        renderMarker(tweets, markerLayer, map)
        flyToDensity(tweets, map)
    }
}

function renderHeatLayer(tweets) {
    // getting the coordinates, and scores of the tweets
    // to render the heatmap based on the given scores
    const coordsWithIntensity = tweets.map(tweet => {
        const [lon, lat] = tweet['source']['coordinates']['coordinates']
        const score = tweet['score']
        return [lat, lon, score / 10]
    })
    // create new heatmap layer based on the coords and intensity
    heatLayer.setLatLngs(coordsWithIntensity)
}

function renderMarker(tweets) {
    // getting tweets' (hits) sources
    const sources = tweets.map(tweet => tweet['source'])
    // creating marker with popup with text
    const markers = sources.map(createMarkerWithPopup)
    // injecting markers to a layer group and add it to map canvas
    markerLayer = L.layerGroup(markers)
    map.addLayer(markerLayer);
}

function createMarkerWithPopup(source) {
    // getting tweet's coordinates and text
    const [lon, lat] = source['coordinates']['coordinates']
    const text = source['text']
    // create a marker based on the given coords and text
    return L.marker([lat, lon]).bindPopup(text)
}

function flyToDensity(tweets) {
    // getting longitudes for all tweets
    const lons = tweets.map(tweet => {
        return tweet['source']['coordinates']['coordinates'][0]
    })
    // getting latitudes for all tweets
    const lats = tweets.map(tweet => {
        return tweet['source']['coordinates']['coordinates'][1]
    })
    // compute the sum for both lon, and lat
    const lonSum = lons.reduce((a, b) => { return a + b})
    const latSum = lats.reduce((a, b) => { return a + b})
    // getting the mean of lat, and lon in order to change the map's view
    const lon = lonSum / lons.length
    const lat = latSum / lats.length

    map.flyTo([lat, lon])
}

function createDrawConrtol() {

    const drawControlOptions = getDrawConrolOptions(editableLayers)
    let drawControl = new L.Control.Draw(drawControlOptions);
    map.addControl(drawControl);

    // getting coordinates
    let layer;
    map.on(L.Draw.Event.CREATED, function (e) {
        if (layer) {
            editableLayers.removeLayer(layer);
        }
        layer = e.layer;
        editableLayers.addLayer(layer);
        boundingBoxCoords = layer._latlngs[0]
    });
}

async function getTweets(url, payload) {
    // getting tweets based on the given payload
    const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: new Headers({
            'Content-Type': 'application/json; charset=UTF-8',
        }),
    })
        .then((response) => response.json())

    return response
}
