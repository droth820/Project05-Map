function initialize() {
	var mapOptions = {
    center: new google.maps.LatLng(33.340053, -111.859627),
    zoom: 11,
    mapTypeId: google.maps.MapTypeId.HYBRID
  };

	var map = new google.maps.Map(document.getElementById('map'), mapOptions);
}

google.maps.event.addDomListener(window, 'load', initialize);
 