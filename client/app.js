// base map's configuration
let config = {
    minZoom: 4,
    maxZoom: 18,
};

// base settings for map's view
const zoom = 5;
const lat = 52.22977;
const lon = 21.01178;

// instanitaite the map canvas
const map = L.map("map", config).setView([lat, lon], zoom);

// instanitate marker layer in order to mark the tweets on the map canvas
var markerLayer = L.layerGroup()

// adding a tilelayer to the map canvas
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

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

// here
const endpointPath = "http://localhost:8000/v1/tweets"
const payload_temp = {
    text: "a",
    // top_left_lat: 40.73,
    // top_left_lon: -108.35883,
    // bottom_right_lat: 40.01,
    // bottom_right_lon: -101.31067,
    // start_at: "2013-09-08T10:45:32.038Z",
    // end_at: "2013-12-30T20:47:46.019Z",
}

async function process() {
    // make sure that the map has no markers
    map.removeLayer(markerLayer)

    // getting the search query
    const text = document.getElementById("search-bar").value

    // todo: get required coordinates
    const payload = {
        text: text
    }

    const response = await getTweets(endpointPath, payload);
    const hits = response['response']['hits']['hits']

    const tweets = hits.map(hit => {
        return { 
            source: hit['_source'],
            score: hit['_score']
        }
    })

    if (tweets.length > 0) {
        renderHeatLayer(tweets)
        renderMarker(hits)
        flyToDensity(hits)
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
    heatLayer.setLatLngs(coordsWithIntensity)
}

function renderMarker(hits) {
    const sources = hits.map(hit => hit['_source'])
    const markers = sources.map(createMarkerWithPopup)
    markerLayer = L.layerGroup(markers)
    map.addLayer(markerLayer);
}

function createMarkerWithPopup(tweet) {
    const [lon, lat] = tweet['coordinates']['coordinates']
    const text = tweet['text']
    return L.marker([lat, lon]).bindPopup(text)
}

function flyToDensity(hits) {
    const lons = hits.map(hit => {
        return hit['_source']['coordinates']['coordinates'][0]
    })

    const lats = hits.map(hit => {
        return hit['_source']['coordinates']['coordinates'][1]
    })

    const lonSum = lons.reduce((a, b) => { return a + b})
    const latSum = lats.reduce((a, b) => { return a + b})

    const lon = lonSum / lons.length
    const lat = latSum / lats.length

    map.flyTo([lat, lon])
}

async function getTweets(url, payload) {
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


docs = [
    {
        "_index": "tweets",
        "_id": "gKKMhIQBkSr8PUpYs2yb",
        "_score": 1.0,
        "_source": {
            "created_at": 1388474062.0,
            "id": 417916626596806656,
            "id_str": "417916626596806656",
            "text": "Boom bitch get out the way! #drunk #islands #girlsnight  #BJs #hookah #zephyrs #boulder #marines… http://t.co/uYmu7c4o0x",
            "truncated": false,
            "source": "<a href=\"http://instagram.com\" rel=\"nofollow\">Instagram</a>",
            "in_reply_to_status_id": null,
            "in_reply_to_status_id_str": null,
            "in_reply_to_user_id": null,
            "in_reply_to_user_id_str": null,
            "in_reply_to_screen_name": null,
            "coordinates": {
                "type": "Point",
                "coordinates": [
                    52.22500698,
                    0.13429814
                ]
            },
            "contributors": null,
            "is_quote_status": false,
            "retweet_count": 0,
            "favorite_count": 0,
            "favorited": false,
            "retweeted": false,
            "possibly_sensitive": false,
            "lang": "en"
        }
    },
    {
        "_index": "tweets",
        "_id": "gKKMhIQBkSr8PUpYs2yb",
        "_score": 1.0,
        "_source": {
            "created_at": 1388474062.0,
            "id": 417916626596806656,
            "id_str": "417916626596806656",
            "text": "Boom bitch get out the way! #drunk #islands #girlsnight  #BJs #hookah #zephyrs #boulder #marines… http://t.co/uYmu7c4o0x",
            "truncated": false,
            "source": "<a href=\"http://instagram.com\" rel=\"nofollow\">Instagram</a>",
            "in_reply_to_status_id": null,
            "in_reply_to_status_id_str": null,
            "in_reply_to_user_id": null,
            "in_reply_to_user_id_str": null,
            "in_reply_to_screen_name": null,
            "coordinates": {
                "type": "Point",
                "coordinates": [
                    52.11400698,
                    0.2329814
                ]
            },
            "contributors": null,
            "is_quote_status": false,
            "retweet_count": 0,
            "favorite_count": 0,
            "favorited": false,
            "retweeted": false,
            "possibly_sensitive": false,
            "lang": "en"
        }
    }
]