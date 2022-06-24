const mapStyle = [
  {
    "featureType": "administrative.country",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "administrative.locality",
    "elementType": "labels",
    "stylers": [
      {
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
    "stylers": [
      {
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
    "stylers": [
      {
        "lightness": 5
      }
    ]
  },
  {
    "featureType": "administrative.province",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "landscape.man_made",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "landscape.natural",
    "stylers": [
      {
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
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "landscape.natural.landcover",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi.attraction",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi.business",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi.government",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi.medical",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "stylers": [
      {
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
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "transit",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "water",
    "stylers": [
      {
        "lightness": 45
      }
    ]
  }
];

let map, apiKey, infoWindow, pos, lat, lng;

function initMap() {
  // Create the map
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 32.252, lng: -110.947 },
    zoom: 11,
    styles: mapStyle,
  });
  
  // Display voting centers on the map
  map.data.loadGeoJson('vote_centers.json', {idPropertyName: 'id'});
  
  // Define marker(s)
  map.data.setStyle((feature) => {
    return {
      icon: {
        url: `./dot.png`,
        scaledSize: new google.maps.Size(15, 15),
      },
    };
  });
  
  apiKey = 'AIzaSyA09BCz4Abyu7GMF_jnLa7Ds1N9iRbxAnI';
  infoWindow = new google.maps.InfoWindow();

  // Zoom to current location
  const locationButton = document.createElement("button");
  locationButton.textContent = "Zoom to Current Location";
  locationButton.classList.add("custom-map-control-button");
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
  locationButton.addEventListener("click", () => {
    
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          
          infoWindow.setPosition(pos);
          infoWindow.setContent("Location found: " + position.coords.latitude + ", " + position.coords.longitude);
          infoWindow.open(map);
          map.setCenter(pos);
          map.setZoom(14);
        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter());
        }
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
  });
  
  // Display information in a popup when a marker is clicked.
  map.data.addListener('click', (event) => {
    
        if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          
    const id_num = event.feature.getProperty('VC_ID');
    const name = event.feature.getProperty('VC_NAME');
    const address = event.feature.getProperty('VC_ADDRESS');
    const room = event.feature.getProperty('ROOM');
    const position = event.feature.getGeometry().get();
    const content = `
      <div style="margin-left:10px; margin-bottom:10px;">
        <h2>${name}</h2><p>${address}</p>
        <p><b>Room:</b> ${room}<br/><br/>
        <p><a href="https://maps.google.com?saddr=${pos.lat},${pos.lng}&daddr=${position.lat()},${position.lng()}" base target="_blank">Get directions</a>
      </div>
      `;
          
    infoWindow.setContent(content);
    infoWindow.setPosition(position);
    infoWindow.setOptions({pixelOffset: new google.maps.Size(0, -30)});
    infoWindow.open(map);
        },
     
        () => {
          handleLocationError(true, infoWindow, map.getCenter());
        }
      );
        } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
  });
  
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}

window.initMap = initMap;
