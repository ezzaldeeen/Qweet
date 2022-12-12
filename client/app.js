// map's configuration
let config = {
    minZoom: 5,
    maxZoom: 18,
  };
// map's view settings
const zoom = 5;
const lat = 52.22977;
const lon = 21.01178;
// render the map canvas
const map = L.map("map", config).setView([lat, lon], zoom);
// layers of marker (tweets marker)
var markerLayer = L.layerGroup()
// adding tile layer to the map
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);
// event listeners
const btn = document.getElementById('search-button');
btn.addEventListener('click', process);
const input = document.getElementById('search-bar');
input.addEventListener('input', process)

// here
const endpointPath = "http://localhost:8000/v1/tweets"
const payload = {
    text: "fire",
    top_left_lat: 40.73,
    top_left_lon: -108.35883,
    bottom_right_lat: 40.01,
    bottom_right_lon: -101.31067,
    start_at: "2013-09-08T10:45:32.038Z",
    end_at: "2013-12-30T20:47:46.019Z",
  }

function process() {
    // hit
    postData(endpointPath, payload);
    // make sure that the map has no markers
    map.removeLayer(markerLayer)
    const text = document.getElementById("search-bar").value
    // preform request to ES
    const tweets = docs.map(doc => doc['_source'])
    if (text === "fire") {
        renderMarker(tweets)
    }
}

function renderMarker(tweets) {
    // todo: rename coordinates since you get documents not coords`
    const markers = tweets.map(createMarkerWithPopup)
    markerLayer = L.layerGroup(markers)
    map.addLayer(markerLayer)
    map.flyTo([52.22500698, 0.13429814])
}

function createMarkerWithPopup(tweet) {
    const coords = tweet['coordinates']['coordinates']
    const text = tweet['text']
    return L.marker(coords).bindPopup(text)
}

function getTweets(url, payload) {
    fetch(url, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: new Headers({
        'Content-Type': 'application/json; charset=UTF-8',
    }),
    })
    .then((response) => response.json())
    .then((json) => console.log(json));
  }

/* TODOs

    - function for flyTo - change the view of the map based on the give coords
    - change marker icons
    - add more tile layers
*/

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