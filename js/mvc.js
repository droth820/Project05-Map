function ViewModel(){
	var self = this;
	this.map = ko.observable();
	this.searchVenue = ko.observable();

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
			function fourSquareData(){
				this.venue = [
					{
						phone: this.venue.contact.formattedPhone,
						address: this.venue.location.address,
						rating: this.venue.rating
					}
				]
			};
					
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
			};
		}
	});
}
}