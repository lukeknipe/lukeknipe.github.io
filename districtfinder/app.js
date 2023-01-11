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

    // Load districts onto map
    map.data.loadGeoJson('wards.json', {
        idPropertyName: 'OBJECTID'
    });

    // Define API key
    const apiKey = 'AIzaSyA09BCz4Abyu7GMF_jnLa7Ds1N9iRbxAnI';

    const infoWindow = new google.maps.InfoWindow();

    // Log district number to console when one is clicked
    map.data.addListener('click', (event) => {
      const id_num = event.feature.getProperty('OBJECTID');
      console.log(id_num);
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
    title.textContent = 'Enter your address';
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

    // Set marker when the user selects an address
    const originMarker = new google.maps.Marker({
        map: map,
        icon: "./img/locator.png",
    });

    originMarker.setVisible(false);
    let originLocation = map.getCenter();

    autocomplete.addListener('place_changed', (event) => {
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
        const streetAddress = (place.name);
        const originLoc = place.geometry.location;
        const ward = event.feature.getProperty('OBJECTID');

        originMarker.setPosition(originLocation);
        originMarker.setVisible(true);

        const content = `
        <div class="popup">
        <h2>${streetAddress}</h2>
        <p>Blah</p>
        </div>
        `;
        infoWindow.setContent(content);
        infoWindow.setPosition(originLoc);
        infoWindow.setOptions({
            pixelOffset: new google.maps.Size(0, -30)
        });
        infoWindow.open(map);

        return;
    });

}
