function ViewModel(){
	var self = this;
	self.searchVenue = ko.observable();
	self.searchVenue(function() {
		$('#query').click(function() {
				$(this).val('');
			});

			$('#query').blur(function(){
				if($(this).val() = '') {
					$(this).val('Example: Ninja Japanese Restaurant');
				}

				if($(this).val() != 'Example: Ninja Japanese Restaurant'){
					$(this).addClass('focus');
				} else{
					$(this).removeClass('focus');
				}
			});

			//Submit the search query
			$('#searchForm').submit(function(event) {
				event.preventDefault();
				if(!lat) {
					navigator.geolocation.getCurrentPosition(getLocation);
				} else{
					getVenues();
				}
			});
			return getVenues();
	});
	console.log('button clicked');
		//Geolocation
	function getLocation(location) {
		lat = location.coords.latitude;
		lng = location.coords.longitude;
		getVenues();
	}

	self.getVenues = function() {
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
				if (this.venue.contact) {
					phone = "Phone:"+this.venue.contact;
				} else {
					phone = "";
					console.log('phone number');
				}
					
				if (this.venue.location.address) {
					address = '<p class="subinfo">'+this.venue.location.address+'<br>';
				} else {
					address = "";
				}
					
				if (this.venue.rating) {
					rating = '<span class="rating">'+this.venue.rating+'</span>';
				}
					
				appendeddatahtml = '<div class="venue"><p><b><span>'+this.venue.name+'</b>'+rating+'</span></h2>'+address+phone+'</p><p><strong>Total Checkins:</strong> '+this.venue.stats.checkinsCount+'</p></div>';
				$("#venues").append(appendeddatahtml);
				console.log('venue data received');	
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
var viewModel = new ViewModel();
ko.applyBindings(viewModel);
console.log('knockout called successfully');
	

//Rebuild map to display markers retrieved from FS database
	function mapbuild() {
		$("#venues").hide();
		var myOptions = {
		zoom:11,
		center: new google.maps.LatLng(33.340053, -111.859627),
		mapTypeId: google.maps.MapTypeId.Hybrid,
		panControl: true,
		zoomControl: true,
		tilt: 45 //Allow user to pan at 45 degree angle when in street view.
		},

	map = new google.maps.Map(document.getElementById('map'), myOptions);
	}
	console.log('map built');
	
	//Build the map and get things going
	mapbuild();

	/*google.maps.event.addDomListener(window, "resize", function(){
		var center = map.getCenter();
		google.maps.event.trigger(map,"resize");
		map.setCenter(center);
	});
*/




