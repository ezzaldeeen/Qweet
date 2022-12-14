export function getDrawConrolOptions(drawingLayers) {
    const OPTIONS = {
        position: 'topright',
        draw: {
            polyline: false,
            marker: false,
            polygon: false,
            circle: false,
            rectangle: {
                shapeOptions: {
                    clickable: false,
                    color: '#f357a1',
                    weight: 5
                }
            }
        },
        edit: {
            featureGroup: drawingLayers,
            remove: false,
            edit: false
        }
    };
    return OPTIONS;
}
