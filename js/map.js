/*Creates map that will be viewed on website*/
var locations = [
  ['Valle Luna', 33.319197, -111.874096,'Mexican food restaurant'],
  ['Zappone\'s Italian Bistro', '33.380328, -111.724445', 'Italian food restaurant'],
  ['Harkins Towne Center', '33.278889, -111.790663', 'Movie theater']

];

//Create google map and attach it to div #map
var map = new google.maps.Map(document.getElementById('map'), {
     			 zoom: 11,
     			 center: new google.maps.LatLng(33.340053, -111.859627),
     			 mapTypeId: google.maps.MapTypeId.HYBRID
    			});

   			 var infowindow = new google.maps.InfoWindow();

          
    			var favMarker, i;
    			for (i = 0; i < locations.length; i++) {  
     			 marker = new google.maps.Marker({
              icon: 'images/pion2.png',
      			  position: new google.maps.LatLng(locations[i][1], locations[i][2]),
     			   map: map
     			 });

     			 google.maps.event.addListener(marker, 'click', (function(marker, i) {
       			 return function() {
         			 infowindow.setContent('<div><h2 class="infoHeader">' + locations[i][0]+ '</h2></div>' +'<div>'+locations [i][3]+'</div><br>' + '<div><img class="image-thumb"src="'+locations [i][4]+'"></div>');
         			 infowindow.open(map, marker);
        			}
      			})(marker, i));
   			 }