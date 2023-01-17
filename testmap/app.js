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
		"featureType": "administrative.locality",
		"elementType": "geometry",
		"stylers": [{
			"visibility": "off"
		}]
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


	// Load Pima County supervisor districts onto map
	map.data.loadGeoJson('sup_dist.json', {});

	map.overrideStyle(new_boundary.feature, {
	    fillColor: '#0000FF',
	    fillOpacity: 0.9
	});

	// Define API key
	const apiKey = 'AIzaSyA09BCz4Abyu7GMF_jnLa7Ds1N9iRbxAnI';


		return;

}
