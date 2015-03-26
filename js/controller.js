function viewModel() {
	var self = this;
	this.map = ko.observable();
	this.marker = ko.observable();
	this.lat = "";
    this.lng = "";
	this.appendeddatahtml = "";
	this.arguments = "";
	this.str = "";
	this.newstr = "";
	this.phone = "";
	this.rating = "";
	this.address = "";
	this.searchVenue = ko.observable();

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
	var map;
	function getLocation(location) {
	    //lat = location.coords.latitude;
	    //lng = location.coords.longitude;

	    var mapOptions = {
    		zoom: 6
  		};
  		map = new google.maps.Map(document.getElementById('map-canvas'),
    		  mapOptions);

 		 // Try HTML5 geolocation
  		if(navigator.geolocation) {
   		 navigator.geolocation.getCurrentPosition(function(position) {
      		var pos = new google.maps.LatLng(position.coords.latitude,
                                       position.coords.longitude);

      		var infowindow = new google.maps.InfoWindow({
       		 map: map,
        		position: pos,
        		content: 'Location found using HTML5.'
      		});

      		map.setCenter(pos);
    		}, function() {
      			handleNoGeolocation(true);
    		});
  		} else {
    		// Browser doesn't support Geolocation
    		handleNoGeolocation(false);
  		}
		getVenues();
	}

	function handleNoGeolocation(errorFlag) {
  if (errorFlag) {
    var content = 'Error: The Geolocation service failed.';
  } else {
    var content = 'Error: Your browser doesn\'t support geolocation.';
  }

  var options = {
    map: map,
    position: new google.maps.LatLng(60, 105),
    content: content
  };

  var infowindow = new google.maps.InfoWindow(options);
  map.setCenter(options.position);
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
				center: new google.maps.LatLng(60, 105),
				mapTypeId: google.maps.MapTypeId.HYBRID,
				panControl: true,
				zoomControl: true
			},
			map = new google.maps.Map(document.getElementById('#map'), myOptions);
				
			// Build markers and elements for venues returned.
			$.each( dataobj, function() {	
				if (this.venue.contact.formattedPhone) {
					phone = "Phone:"+this.venue.contact.formattedPhone;
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
					
				appendeddatahtml = '<div class="venue"><h2><span>'+this.venue.name+rating+'</span></h2>'+address+phone+'</p><p><strong>Total Checkins:</strong> '+this.venue.stats.checkinsCount+'</p></div>';
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

	
	//Rebuild map to display markers retrieved from FS database
	function mapbuild() {
		$("#venues").hide();
		var myOptions = {
		zoom:11,
		center: new google.maps.LatLng(60, 105),
		mapTypeId: google.maps.MapTypeId.Hybrid,
		panControl: true,
		zoomControl: true,
		tilt: 45 //Allow user to pan at 45 degree angle when in street view.
		},
	map = new google.maps.Map(document.getElementById('#map'), myOptions);
	}
	
	//Build the map and get things going
	mapbuild();
}
ko.applyBindings(viewModel);