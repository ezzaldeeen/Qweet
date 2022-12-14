// base map's configuration
export const BASE_MAP_CONFIG = {
    minZoom: 4,
    maxZoom: 18
};

// base settings for map's view
export const BASE_VIEW_SETTINGS = {
    zoom: 5,
    lat: 52.22977,
    lon: 21.01178
}

// base tilelayer
export const BASE_TILE_LAYER = {
    uri: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    att: {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }
}