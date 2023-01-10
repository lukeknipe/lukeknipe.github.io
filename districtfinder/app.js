const mapStyle = [{
        "featureType": "administrative.country",
        "elementType": "labels",
        "stylers": [{
            "visibility": "off"
        }]
    },
    {
        "featureType": "administrative.land_parcel",
        "stylers": [{
            "visibility": "off"
        }]
    },
    {
        "featureType": "administrative.locality",
        "elementType": "labels",
        "stylers": [{
                "lightness": 55
            },
            {
                "visibility": "simplified"
            },
            {
                "weight": 2
            }
        ]
    },
    {
        "featureType": "administrative.neighborhood",
        "stylers": [{
                "saturation": 5
            },
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.neighborhood",
        "elementType": "labels",
        "stylers": [{
            "lightness": 5
        }]
    },
    {
        "featureType": "administrative.province",
        "elementType": "labels",
        "stylers": [{
            "visibility": "off"
        }]
    },
    {
        "featureType": "landscape.man_made",
        "stylers": [{
            "visibility": "off"
        }]
    },
    {
        "featureType": "landscape.natural",
        "stylers": [{
                "saturation": -10
            },
            {
                "lightness": 5
            },
            {
                "weight": 5
            }
        ]
    },
    {
        "featureType": "landscape.natural",
        "elementType": "labels",
        "stylers": [{
            "visibility": "off"
        }]
    },
    {
        "featureType": "landscape.natural.landcover",
        "stylers": [{
            "visibility": "off"
        }]
    },
    {
        "featureType": "poi",
        "stylers": [{
            "visibility": "off"
        }]
    },
    {
        "featureType": "poi.attraction",
        "stylers": [{
            "visibility": "off"
        }]
    },
    {
        "featureType": "poi.business",
        "stylers": [{
            "visibility": "off"
        }]
    },
    {
        "featureType": "poi.government",
        "stylers": [{
            "visibility": "off"
        }]
    },
    {
        "featureType": "poi.medical",
        "stylers": [{
            "visibility": "off"
        }]
    },
    {
        "featureType": "road.highway",
        "stylers": [{
                "saturation": 20
            },
            {
                "lightness": 25
            },
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.local",
        "stylers": [{
            "visibility": "off"
        }]
    },
    {
        "featureType": "transit",
        "stylers": [{
            "visibility": "off"
        }]
    },
    {
        "featureType": "water",
        "stylers": [{
            "lightness": 45
        }]
    }
];

// Escape HTML characters in a template literal string to prevent XSS.
function sanitizeHTML(strings) {
    const entities = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        '\'': '&#39;'
    };
    let result = strings[0];
    for (let i = 1; i < arguments.length; i++) {
        result += String(arguments[i]).replace(/[&<>'"]/g, (char) => {
            return entities[char];
        });
        result += strings[i];
    }
    return result;
}

// Initialize the map.

function initMap() {

    // Display overlays
//    document.getElementById("overlay_a").style.display = "block";
//    document.getElementById("overlay_b").style.display = "block";

    // Create the map.
    const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 11,
        center: {
            lat: 32.252,
            lng: -110.947
        },
        styles: mapStyle,
        disableDefaultUI: true,
        options: {
            gestureHandling: 'greedy'
        }
    });

    // Load the vote centers GeoJSON onto the map
    map.data.loadGeoJson('wards.json', {
        idPropertyName: 'OBJECTID'
    });

    // Define the marker icons
    map.data.setStyle((feature) => {
        return {
            icon: {
                url: `img/${feature.getProperty('marker-symbol')}.png`,
                //        scaledSize: new google.maps.Size(25, 20),
            },
        };
    });

    // Define API key
    const apiKey = 'AIzaSyA09BCz4Abyu7GMF_jnLa7Ds1N9iRbxAnI';

    const infoWindow = new google.maps.InfoWindow();

    // Display information in a popup when a marker is clicked.
    map.data.addListener('click', (event) => {
        const content = `
      <div class="popup">
        <h2>${id_num}</h2>
      </div>
      `;
        infoWindow.setContent(content);
        infoWindow.setPosition(dpos);
        infoWindow.setOptions({
            pixelOffset: new google.maps.Size(0, -30)
        });
        infoWindow.open(map);
    });

    // Build and add the search bar
    const card = document.createElement('div');
    const titleBar = document.createElement('div');
    const title = document.createElement('div');
    const container = document.createElement('div');
    const input = document.createElement('input');
    const options = {
        types: ['address'],
        componentRestrictions: {
            country: 'us'
        },
    };

    card.setAttribute('id', 'pac-card');
    title.setAttribute('id', 'title');
    title.textContent = 'Find your nearest vote center';
    titleBar.appendChild(title);
    container.setAttribute('id', 'pac-container');
    input.setAttribute('id', 'pac-input');
    input.setAttribute('type', 'text');
    input.setAttribute('placeholder', 'Enter an address');
    container.appendChild(input);
    card.appendChild(titleBar);
    card.appendChild(container);
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card);

    // Make the search bar into a Places Autocomplete search bar and select
    // which detail fields should be returned about the place that
    // the user selects from the suggestions.

    const autocomplete = new google.maps.places.Autocomplete(input, options);

    autocomplete.setFields(
        ['address_components', 'geometry', 'name']);

    // Set the origin point when the user selects an address
    const originMarker = new google.maps.Marker({
        map: map,
        icon: "./img/locator.png",
    });

    originMarker.setVisible(false);
    let originLocation = map.getCenter();

    autocomplete.addListener('place_changed', async () => {
        originMarker.setVisible(false);
        originLocation = map.getCenter();
        const place = autocomplete.getPlace();

        if (!place.geometry) {
            // User entered the name of a Place that was not suggested and
            // pressed the Enter key, or the Place Details request failed.
            window.alert('No address available for input: \'' + place.name + '\'');
            return;
        }

        // Recenter the map to the selected address
        originLocation = place.geometry.location;
        map.setCenter(originLocation);
        map.setZoom(13);
        globalThis.streetAddress = (place.name);
        globalThis.originLoc = place.geometry.location;


        originMarker.setPosition(originLocation);
        originMarker.setVisible(true);

        // Use the selected address as the origin to calculate distances
        // to each vote center
        const rankedStores = await calculateDistances(map.data, originLocation);
        showList(map.data, rankedStores);

        return;
    });

}



/**
 * Build the content of the side panel from the sorted list of stores
 * and display it.
 * @param {google.maps.Data} data The geospatial data object layer for the map
 * @param {object[]} stores An array of objects with a distanceText,
 * distanceVal, and storeid property.
 */

function showList(data, stores) {
    if (stores.length == 0) {
        console.log('No centers to display');
        return;
    }

    let panel = document.createElement('div');
    // If the panel already exists, use it. Else, create it and add to the page.
    if (document.getElementById('panel')) {
        panel = document.getElementById('panel');
        // If panel is already open, close it
        if (panel.classList.contains('open')) {
            panel.classList.remove('open');
        }
    } else {
        panel.setAttribute('id', 'panel');
        const body = document.body;
        body.insertBefore(panel, body.childNodes[0]);
    }


    // Clear the previous details
    while (panel.lastChild) {
        panel.removeChild(panel.lastChild);
    }

    // Let's give this panel a header, shall we? Google's example didn't have one, but here's a way to make one
    const header = document.createElement('p');
    header.classList.add('panelHeader');
    header.textContent = "Vote centers closest to " + streetAddress + ":";
    panel.appendChild(header);

    // Open the panel
    panel.classList.add('open');

    return;
}

function haversine_distance(origin, storeLoc) {
    const R = 3958.8; // Radius of the Earth in miles
    const rlat1 = origin.lat() * (Math.PI / 180); // Convert degrees to radians
    const rlat2 = storeLoc.lat() * (Math.PI / 180); // Convert degrees to radians
    const difflat = rlat2 - rlat1; // Radian difference (latitudes)
    const difflon = (storeLoc.lng() - origin.lng()) * (Math.PI / 180); // Radian difference (longitudes)
    const d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat / 2) * Math.sin(difflat / 2) + Math.cos(rlat1) * Math.cos(rlat2) * Math.sin(difflon / 2) * Math.sin(difflon / 2)));
    return d;
}
