var locations = [
  ['Valle Luna', 33.319197, -111.874096,'Mexican food restaurant'],
  ['Zappone\'s Italian Bistro', '33.380328, -111.724445', 'Italian food restaurant'],
  ['Harkins Towne Center', '33.278889, -111.790663', 'Movie theater']

];

function initialize() {
	var mapOptions = {
    center: new google.maps.LatLng(33.340053, -111.859627),
    zoom: 11,
    mapTypeId: google.maps.MapTypeId.Hybrid
  };
  	//add infowindow
  	var infowindow = new google.maps.InfoWindow();
  	//iterate through locations and display markers
  	var marker, i;
  	for (i = 0; i < locations.length; i++) {
  		marker = new google.maps.Marker({
  			icon: 'images/pin2.png',
  			position: new google.maps.LatLng(locations[i][1], locations[i][2]),
  			map: map
  		});

  		//add infowindow
  		/*google.maps.event.addListener(marker, 'click', (function(marker, i)) {
  			return function() {
  				infowindow.setContent('<div><h2>'+ locations[i][0]+ '</h2></div>' +'<div>'+locations [i][2]+'</div>');
         		infowindow.open(map, marker);
  			}
  		}(marker, i));*/
  	}


	var map = new google.maps.Map(document.getElementById('map'), mapOptions);
}

google.maps.event.addDomListener(window, 'load', initialize);

function viewModel() {
	var self = this;
	this.marker = ko.observable();
	this.map = ko.observable();
	this.lat = "";
    this.lng = "";
	this.appendeddatahtml = "";
	this.arguments = "";
	this.str = "";
	this.newstr = "";
	this.phone = "";
	this.rating = "";
	this.address = "";
	
	//Search for venue based on user query
	function searchVenue(){
		$("#query").click(function(){
			$(this).val("");
		});

		$("#query").blur(function(){
			if ($(this).val() == "") {
				$(this).val("Example: Ninja Japanese Restaurant");
			}
		
			if ($(this).val() != "Example: Ninja Japanese Restaurant") {
				$(this).addClass("focus");
			} else {
				$(this).removeClass("focus");
			}
		});

		//Submit search query and call to getVenues
		$("#searchform").submit(function(event){
			event.preventDefault();
			if (!lat) {
				navigator.geolocation.getCurrentPosition(getLocation);
			} else {
				getVenues();
			}		
		});

	}
	searchVenue();

	
	//Sets user location for gathering venue information based on search query
	function getLocation(location) {
	    lat = location.coords.latitude;
	    lng = location.coords.longitude;
		getVenues();
	}
	//Connect with Foursquare database and set parameters for displaying retrieved information
	function getVenues() {
	$.ajax({
	  	type: "GET",
	  	url: "https://api.foursquare.com/v2/venues/explore?ll="+lat+","+lng+"&client_id=HFOT1XUCTPSBFCWA0W5OMCOLVPWLUA5T0ELRWKDOKAEVRB3V&client_secret=SJRCFDAGLCACDPY1EIEHNITKJIKNCN5KFPOINR0RCPYX35LZ&v=20130619&query="+$("#query").val()+"",
	  	success: function(data) {
			$("#venues").show();
			var dataobj = data.response.groups[0].items;
			$("#venues").html("");
				
			// Rebuild the map using data.
			var myOptions = {
				zoom:11,
				center: new google.maps.LatLng(33.340053, -111.859627),
				mapTypeId: google.maps.MapTypeId.HYBRID,
				panControl: true,
				zoomControl: true
			},
			map = new google.maps.Map(document.getElementById('map'), myOptions);
				
			// Build markers and elements for venues returned.
			$.each( dataobj, function() {	
				if (this.venue.contact.formattedPhone) {
					phone = "Phone:"+this.venue.contact.formattedPhone;
					console.log('phone number');
				} else {
					phone = "";
				}
					
				if (this.venue.location.address) {
					address = '<p class="subinfo">'+this.venue.location.address+'<br>';
				} else {
					address = "";
				}
					
				if (this.venue.rating) {
					rating = '<span class="rating">'+this.venue.rating+'</span>';
				}
					
				appendeddatahtml = '<div class="venue"><h3><span>'+this.venue.name+rating+'</span></h3>'+address+phone+'</p><p><strong>Total Checkins:</strong> '+this.venue.stats.checkinsCount+'</p></div>';
				$("#venues").append(appendeddatahtml);
					
				// Build markers
				var markerImage = {
				url: 'images/ScopePin.png',
				scaledSize: new google.maps.Size(24, 24),
				origin: new google.maps.Point(0,0),
				anchor: new google.maps.Point(24/2, 24)
				},
				markerOptions = {
				map: map,
				position: new google.maps.LatLng(this.venue.location.lat, this.venue.location.lng),
				title: this.venue.name,
				animation: google.maps.Animation.DROP,
				icon: markerImage,
				optimized: false
				},
				marker = new google.maps.Marker(markerOptions)
			});
		}
	});
}	
	
}
ko.applyBindings(viewModel);

//Rebuild map to display markers retrieved from FS database
function mapbuild() {
	$("#venues").hide();
	var myOptions = {
	center: new google.maps.LatLng(33.340053, -111.859627),
	mapTypeId: google.maps.MapTypeId.Hybrid,
	panControl: true,
	zoomControl: true,
	tilt: 45 //Allow user to pan at 45 degree angle when in street view.
	},
	map = new google.maps.Map(document.getElementById('map'), myOptions);
	}
	
//Build the map and get things going
mapbuild();