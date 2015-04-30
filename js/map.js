/*Creates map that will be viewed on website*/
var locations = [
  ['Valle Luna', 33.319197, -111.874096,'Mexican food restaurant', 'http://www.valleluna.com/'],
  ['Zappone\'s Italian Bistro', 33.380328, -111.724445, 'Italian food restaurant','http://www.zapponesbistro.com/'],
  ['Harkins Towne Center', 33.278889, -111.790663, 'Movie theater','http://www.harkinstheatres.com/']

];

//Create google map and attach it to div #map
var map = new google.maps.Map(document.getElementById('map'), {
     			 zoom: 11,
     			 center: new google.maps.LatLng(33.340053, -111.859627),
     			 mapTypeId: google.maps.MapTypeId.HYBRID
    			});

   			 var infowindow = new google.maps.InfoWindow();

          
    			var marker, i;
    			for (i = 0; i < locations.length; i++) {  
     			 marker = new google.maps.Marker({
              icon: 'images/pin2.png',
      			  position: new google.maps.LatLng(locations[i][1], locations[i][2]),
     			   map: map
     			 });

     			 google.maps.event.addListener(marker, 'click', (function(marker, i) {
       			 return function() {
         			 infowindow.setContent('<div><h2>'+ locations[i][0]+'</h2></div>'+'<div>'+locations[i][3]+'</div><br>'+'<div><a href="'+locations[i][4]+'"></div>');
         			 infowindow.open(map, marker);
        			}
      			})(marker, i));
   			 }
