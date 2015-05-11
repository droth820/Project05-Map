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
	
	function toggleBounce() {
		if (marker.getAnimation() != null) {
			marker.setAnimation(null);
		} else {
			marker.setAnimation(google.maps.Animation.BOUNCE);
		}
	}

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
				var infowindow = new google.maps.InfoWindow();

				var markerImage = {
					url: 'images/ScopePin.png',
					scaledSize: new google.maps.Size(24, 24),
					origin: new google.maps.Point(0,0),
					anchor: new google.maps.Point(24/2, 24)
				},

				markerOptions = {
					icon: markerImage,
					map: map,
					position: new google.maps.LatLng(this.venue.location.lat, this.venue.location.lng),
					name: this.venue.name,
					location: this.venue.location.address,
					optimized: false
				},
				marker = new google.maps.Marker(markerOptions);
				google.maps.event.addListener(marker, 'click', (function(marker){
					return function() {
						infowindow.setContent('<div><h3>'+this.name+'</h3></div>'+'<div><p>'+this.location+'</p></div>');
						infowindow.open(map, marker);
						console.log("marker added");
					}
				})(marker));

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