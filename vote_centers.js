
let map, infoWindow;

function initMap() {
  // Create the map
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 32.252, lng: -110.947 },
    zoom: 11,
  });
  
  // Display voting centers on the map
  map.data.loadGeoJson('vote_centers.json', {idPropertyName: 'id'});
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
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          infoWindow.setPosition(pos);
          infoWindow.setContent("Location found.");
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
