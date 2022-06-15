
let map, apiKey, infoWindow, pos, latitude, longitude;

function initMap() {
  // Create the map
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 32.252, lng: -110.947 },
    zoom: 11,
  });
  
  // Display voting centers on the map
  map.data.loadGeoJson('vote_centers.json', {idPropertyName: 'id'});
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
          
          const latitude  = position.coords.latitude;
          const longitude = position.coords.longitude;

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
  
  // Display information in a popup when a marker is clicked.
  map.data.addListener('click', (event) => {
    const id_num = event.feature.getProperty('VC_ID');
    const name = event.feature.getProperty('VC_NAME');
    const address = event.feature.getProperty('VC_ADDRESS');
    const room = event.feature.getProperty('ROOM');
    const position = event.feature.getGeometry().get();
    const content = `
      <div style="margin-left:20px; margin-bottom:20px;">
        <h2>${name}</h2><p>${address}</p>
        <p><b>Room:</b> ${room}<br/><br/>
        <p><a href="https://maps.google.com?saddr=${latitude},${longitude}&daddr=${position.lat()},${position.lng()}">Get directions</a>
      </div>
      `;

    infoWindow.setContent(content);
    infoWindow.setPosition(position);
    infoWindow.setOptions({pixelOffset: new google.maps.Size(0, -30)});
    infoWindow.open(map);
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
