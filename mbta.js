var myLat = 0;
var myLng = 0;
var request = new XMLHttpRequest();
var me = new google.maps.LatLng(myLat, myLng);
var myOptions = {
zoom: 13, // The larger the zoom number, the bigger the zoom
center: me,
mapTypeId: google.maps.MapTypeId.ROADMAP
};
var map;
var marker;
var markers = [];
var infowindow = new google.maps.InfoWindow();
var scheduleData;
var station_position;
var station_name;
var shortestD = 9999999;
var R = 3968;

function init()
{	
	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	getMyLocation();
}

function getMyLocation(){
	if (navigator.geolocation) { // the navigator.geolocation object is supported on your browser
		navigator.geolocation.getCurrentPosition(function(position) {
			myLat = position.coords.latitude;
			myLng = position.coords.longitude;
			renderMap();
			getLine();
		});
	}
	else {
		alert("Geolocation is not supported by your web browser.");
	}
}

function renderMap()
{

	me = new google.maps.LatLng(myLat, myLng);

	// Update map and go there...
	map.panTo(me);

	// Create a marker
	marker = new google.maps.Marker({
		position: me,
		title: "me",
	});
	marker.setMap(map);
}

function getLine(){
	var str;
	var line;

	request.open("get", "http://mbtamap.herokuapp.com/mapper/rodeo.json", true);
	request.send();
	
	request.onreadystatechange = function() {	
		if(request.readyState == 4){
			str = request.responseText;
			scheduleData = JSON.parse(str);
			line = scheduleData.line;
					
			
			if(str == '{"error":"So much fail"}'){
		 		alert("error:So much fail");
		 	}
		 	else{
		 		if(line == "blue"){
		 			getblueLine();
		 		}
		 		else if(line == "red"){
		 			getredLine();
		 		}
		 		else if(line == "orange"){
		 			getorangeLine();
		 		}
		 	
		 		google.maps.event.addListener(marker, 'click', function() {
					infowindow.setContent("You are " + shortestD + "miles away from " + station_name + " station ");	//for some reason on my web browser the last part of windowinfo content gets broken
    				infowindow.open(map,marker);
  				});
	  			var closestStop = new google.maps.Polyline({
    				path: [me, station_position],
    				geodesic: true,
    				strokeColor: '#A4A4A4',
    				strokeOpacity: 1.0,
    				strokeWeight: 2
  				});	
  				closestStop.setMap(map);	
		 	}
			
		 }
	
	}
	
}

function getblueLine(){
	blueT = "subway_icon_blue.png";
	
	pt1 = new google.maps.LatLng(42.374262, -71.030395);
	markers.push(new google.maps.Marker({position: pt1, title: "Airport", icon: blueT}));
	pt2 = new google.maps.LatLng(42.359784, -71.051652);
	markers.push(new google.maps.Marker({position: pt2, title: "Aquarium", icon: blueT}));
	pt3 = new google.maps.LatLng(42.39754234, -70.99231944);
	markers.push(new google.maps.Marker({position: pt3, title: "Beachmont", icon: blueT}));
	pt4 = new google.maps.LatLng(42.361365, -71.062037);
	markers.push(new google.maps.Marker({position: pt4, title: "Bowdoin", icon: blueT}));
	pt5 = new google.maps.LatLng(42.359705, -71.05921499999999);
	markers.push(new google.maps.Marker({position: pt5, title: "Government Center", icon: blueT}));
	pt6 = new google.maps.LatLng(42.36911856, -71.03952958000001);
	markers.push(new google.maps.Marker({position: pt6, title: "Maverick", icon: blueT}));
	pt7 = new google.maps.LatLng(42.386867, -71.00473599999999);
	markers.push(new google.maps.Marker({position: pt7, title: "Orient Heights", icon: blueT}));
	pt8 = new google.maps.LatLng(42.40784254, -70.99253321);
	markers.push(new google.maps.Marker({position: pt8, title: "Revere Beach", icon: blueT}));
	pt9 = new google.maps.LatLng(42.358978, -71.057598);
	markers.push(new google.maps.Marker({position: pt9, title: "State Street", icon: blueT}));
	pt10 = new google.maps.LatLng(42.39050067, -70.99712259);
	markers.push(new google.maps.Marker({position: pt10, title: "Suffolk Downs", icon: blueT}));
	pt11 = new google.maps.LatLng(42.41342, -70.991648);
	markers.push(new google.maps.Marker({position: pt11, title: "Wonderland", icon: blueT}));
	pt12 = new google.maps.LatLng(42.3796403, -71.02286539000001);
	markers.push(new google.maps.Marker({position: pt12, title: "Wood Island", icon: blueT}));

	var bluepath = [pt4, pt5, pt2, pt6, pt1, pt12, pt7, pt10, pt3, pt8, pt11];

	for(var m in markers){
		createTable(m);
		markers[m].setMap(map);
				
		lat2 = markers[m]['position'].lat();
		lon2 = markers[m]['position'].lng();
		
		var dLat = (lat2-myLat) * Math.PI / 180;
		var dLon = (lon2-myLng) * Math.PI / 180;
		var lat1 = myLat* Math.PI / 180;
		var lat2 = lat2* Math.PI / 180;

		var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
		var d = R * c;

		if(d<shortestD){
			shortestD = d;
			station_position = markers[m]['position'];
			station_name = markers[m]['title'];	
		}			
	}
	
	var trainPath = new google.maps.Polyline({
    	path: bluepath,
    	geodesic: true,
    	strokeColor: '#0000FF',
    	strokeOpacity: 1.0,
    	strokeWeight: 2
  	});
  
  	trainPath.setMap(map);

}


			
function getorangeLine(){
	orangeT = "subway_icon_orange.png";

	pt1 = new google.maps.LatLng(42.347, -71.07576899999999);
	markers.push(new google.maps.Marker({position: pt1, title: "Back Bay", icon: orangeT}));
	pt2 = new google.maps.LatLng(42.352547, -71.062752);
	markers.push(new google.maps.Marker({position: pt2, title: "Chinatown", icon: orangeT}));
	pt3 = new google.maps.LatLng(42.373622, -71.06953300000001);
	markers.push(new google.maps.Marker({position: pt3, title: "Community College", icon: orangeT}));
	pt4 = new google.maps.LatLng(42.355518, -71.060225);
	markers.push(new google.maps.Marker({position: pt4, title: "Downtown Crossing", icon: orangeT}));
	pt5 = new google.maps.LatLng(42.300523, -71.113686);
	markers.push(new google.maps.Marker({position: pt5, title: "Forest Hills", icon: orangeT}));
	pt6 = new google.maps.LatLng(42.310525, -71.10741400000001);
	markers.push(new google.maps.Marker({position: pt6, title: "Green Street", icon: orangeT}));
	pt7 = new google.maps.LatLng(42.363021, -71.05829);
	markers.push(new google.maps.Marker({position: pt7, title: "Haymarket", icon: orangeT}));
	pt8 = new google.maps.LatLng(42.323132, -71.099592);
	markers.push(new google.maps.Marker({position: pt8, title: "Jackson Square", icon: orangeT}));
	pt9 = new google.maps.LatLng(42.426, -71.07422699999999);
	markers.push(new google.maps.Marker({position: pt9, title: "Malden Center", icon: orangeT}));
	pt10 = new google.maps.LatLng(42.341512, -71.083423);
	markers.push(new google.maps.Marker({position: pt10, title: "Mass Ave", icon: orangeT}));
	pt11 = new google.maps.LatLng(42.366, -71.061251);
	markers.push(new google.maps.Marker({position: pt11, title: "North Station", icon: orangeT}));
	pt12 = new google.maps.LatLng(42.43668, -71.07109699999999);
	markers.push(new google.maps.Marker({position: pt12, title: "Oak Grove", icon: orangeT}));
	pt13 = new google.maps.LatLng(42.331397, -71.095451);
	markers.push(new google.maps.Marker({position: pt13, title: "Roxbury Crossing", icon: orangeT}));
	pt14 = new google.maps.LatLng(42.336, -71.090524);
	markers.push(new google.maps.Marker({position: pt14, title: "Ruggles", icon: orangeT}));
	pt15 = new google.maps.LatLng(42.358978, -71.057598);
	markers.push(new google.maps.Marker({position: pt15, title: "State Street", icon: orangeT}));
	pt16 = new google.maps.LatLng(42.317062, -71.104248);
	markers.push(new google.maps.Marker({position: pt16, title: "Stony Brook", icon: orangeT}));
	pt17 = new google.maps.LatLng(42.383975, -71.076994);
	markers.push(new google.maps.Marker({position: pt17, title: "Sullivan", icon: orangeT}));
	pt18 = new google.maps.LatLng(42.349662, -71.063917);
	markers.push(new google.maps.Marker({position: pt18, title: "Tufts Medical", icon: orangeT}));
	pt19 = new google.maps.LatLng(42.40237, -71.077082);
	markers.push(new google.maps.Marker({position: pt19, title: "Wellington", icon: orangeT}));
	
	var orangepath = [pt12, pt9, pt19, pt17, pt3, pt11, pt7, pt15, pt4, pt2, pt18, pt1, pt10, pt14, pt13, pt8, pt16, pt6, pt5];

	for(var m in markers){
		createTable(m);
		markers[m].setMap(map);
		lat2 = markers[m]['position'].lat();
		lon2 = markers[m]['position'].lng();
		
		var dLat = (lat2-myLat) * Math.PI / 180;
		var dLon = (lon2-myLng) * Math.PI / 180;
		var lat1 = myLat* Math.PI / 180;
		var lat2 = lat2* Math.PI / 180;

		var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
		var d = R * c;

		if(d<shortestD){
	
			shortestD = d;
			station_position = markers[m]['position'];
			station_name = markers[m]['title'];
		}
	}
	

	var trainPath = new google.maps.Polyline({
    	path: orangepath,
    	geodesic: true,
    	strokeColor: '#FF8000',
    	strokeOpacity: 1.0,
    	strokeWeight: 2
  	});

  	trainPath.setMap(map);
	
}


function getredLine(){

	redT = "subway_icon_red.png";
	
	pt1 = new google.maps.LatLng(42.395428, -71.142483);
	markers.push(new google.maps.Marker({position: pt1, title: "Alewife", icon: redT}));	
	pt2 = new google.maps.LatLng(42.284652, -71.06448899999999);
	markers.push(new google.maps.Marker({position: pt2, title: "Ashmont", icon: redT}))
	pt3 = new google.maps.LatLng(42.2078543, -71.0011385);
	markers.push(new google.maps.Marker({position: pt3, title: "Braintree", icon: redT}));
	pt4 = new google.maps.LatLng(42.342622, -71.056967);
	markers.push(new google.maps.Marker({position: pt4, title: "Broadway", icon: redT}));
	pt5 = new google.maps.LatLng(42.365486, -71.103802);
	markers.push(new google.maps.Marker({position: pt5, title: "Central Square", icon: redT}));
	pt6 = new google.maps.LatLng(42.361166, -71.070628);
	markers.push(new google.maps.Marker({position: pt6, title: "Charles/MGH", icon: redT}));
	pt7 = new google.maps.LatLng(42.39674, -71.121815);
	markers.push(new google.maps.Marker({position: pt7, title: "Davis", icon: redT}));
	pt8 = new google.maps.LatLng(42.355518, -71.060225);
	markers.push(new google.maps.Marker({position: pt8, title: "Downtown Crossing", icon: redT}));
	pt9 = new google.maps.LatLng(42.300093, -71.061667);
	markers.push(new google.maps.Marker({position: pt9, title: "Fields Corner", icon: redT}));
	pt10 = new google.maps.LatLng(42.373362, -71.118956);
	markers.push(new google.maps.Marker({position: pt10, title: "Harvard Square", icon: redT}));	
	pt11 = new google.maps.LatLng(42.321, -71.052555);
	markers.push(new google.maps.Marker({position: pt11, title: "JFK/UMASS", icon: redT}));
	pt12 = new google.maps.LatLng(42.36249079, -71.08617653);
	markers.push(new google.maps.Marker({position: pt12, title: "Kendall/MIT", icon: redT}));
	pt13 = new google.maps.LatLng(42.275275, -71.029583);
	markers.push(new google.maps.Marker({position: pt13, title: "North Quincy", icon: redT}));
	pt14 = new google.maps.LatLng(42.35639457, -71.0624242);
	markers.push(new google.maps.Marker({position: pt14, title: "Park Street", icon: redT}));
	pt15 = new google.maps.LatLng(42.388, -71.119159);
	markers.push(new google.maps.Marker({position: pt15, title: "Porter Square", icon: redT}));
	pt16 = new google.maps.LatLng(42.251809, -71.005409);
	markers.push(new google.maps.Marker({position: pt16, title: "Quincy Center", icon: redT}));
	pt17 = new google.maps.LatLng(42.233391, -71.007153);
	markers.push(new google.maps.Marker({position: pt17, title: "Quincy Adams", icon: redT}));
	pt18 = new google.maps.LatLng(42.31129, -71.053331);
	markers.push(new google.maps.Marker({position: pt18, title: "Savin Hill", icon: redT}));
	pt19 = new google.maps.LatLng(42.29312583, -71.06573796000001);
	markers.push(new google.maps.Marker({position: pt19, title: "Shawmut", icon: redT}));
	pt20 = new google.maps.LatLng(42.353, -71.055364);
	markers.push(new google.maps.Marker({position: pt20, title: "South Station", icon: redT}));
	pt21 = new google.maps.LatLng(42.2665139, -71.0203369);
	markers.push(new google.maps.Marker({position: pt21, title: "Wollaston", icon: redT}));
	pt22 = new google.maps.LatLng(42.330154, -71.057655);
	markers.push(new google.maps.Marker({position: pt22, title: "Andrew", icon: redT}));

	var redlinepath = [pt1, pt7, pt15, pt10, pt5, pt12, pt6, pt14, pt8, pt20, pt4, pt22, pt11, pt18, pt9, pt19, pt2];
	var redlinepath2 = [pt11, pt13, pt21, pt16, pt17, pt3];	


	for(var m in markers){
		createTable(m);
		markers[m].setMap(map);
		
		lat2 = markers[m]['position'].lat();
		lon2 = markers[m]['position'].lng();
		
		var dLat = (lat2-myLat) * Math.PI / 180;
		var dLon = (lon2-myLng) * Math.PI / 180;
		var lat1 = myLat* Math.PI / 180;
		var lat2 = lat2* Math.PI / 180;

		var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
		var d = R * c;
	
	    
		if(d<shortestD){
			shortestD = d;
			station_position = markers[m]['position'];
			station_name = markers[m]['title'];
		}
	}
	

	var trainPath = new google.maps.Polyline({
    	path: redlinepath,
    	geodesic: true,
    	strokeColor: '#FF0000',
    	strokeOpacity: 1.0,
    	strokeWeight: 2
  	});
  	
	var trainPath2 = new google.maps.Polyline({
    	path: redlinepath2,
    	geodesic: true,
    	strokeColor: '#FF0000',
    	strokeOpacity: 1.0,
    	strokeWeight: 2
  	});  	
  	
  	trainPath.setMap(map);
	trainPath2.setMap(map);
	
}

function createTable(x){

	if(markers.length > 0){
		content = '<table id="schedule"><tr><th>Line</th><th>Trip #</th><th>Direction</th><th>Time Remaining</th></tr>';
		for (i = 0; i<scheduleData.schedule.length; i++){
			trip = scheduleData.schedule[i];
			for(j = 0; j<scheduleData.schedule[i].Predictions.length; j++){
				if(markers[x]['title'] == scheduleData.schedule[i].Predictions[j].Stop){	
				
					content += '<tr><td>' + scheduleData.line + '</td><td>' + scheduleData.schedule[i].TripID + '</td><td>' + scheduleData.schedule[i].Destination + '</td><td>' + secondsToHms(scheduleData.schedule[i].Predictions[j].Seconds) + '</td></tr>';

				}
			}
		}
		content += '</table>';
	}
	else{
		content = "No schedule of upcoming for this station";
	}
		
	google.maps.event.addListener(markers[x], 'click', function() {
		infowindow.setContent(markers[x].title + " station" + content);
		infowindow.open(map, markers[x]);
	});

}



function secondsToHms(d) {

	d = Number(d);
	var h = Math.floor(d / 3600);
	var m = Math.floor(d % 3600 / 60);
	var s = Math.floor(d % 3600 % 60);
	return ((h > 0 ? h + ":" : "") + (m > 0 ? (h > 0 && m < 10 ? "0" : "") + m + ":" : "0:") + (s < 10 ? "0" : "") + s); 
	
}

