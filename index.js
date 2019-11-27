/* 


GENERAL IDEAS:
-> somehow indicate this range for locations

*/


/*

 **********Map Initialization**********

*/

// credentials HERE
const here = {
   id: 'Kaj60PEbsgRNPKhvGRoW',
   code: 'vb_hoxXseLgJfIbO9Q7gJA',
   apikey: 'U85dP15GeBxEEK3215NWQa1JqbiXWR1nzBypg4YdrLA'
};

//add contributors to icon:
//<a href="http://www.onlinewebfonts.com">oNline Web Fonts</a>


var map = L.map('map', { boxZoom: false });
var layer = Tangram.leafletLayer({
   scene: 'scene.yaml',
   attribution: '<a href="https://github.com/tangrams/tangram">Tangram</a> | &copy; OnlineWebFonts | ', 
   events: {
      click: function (selection) {
            if (selection.feature) {
               showPopup(selection.leaflet_event.latlng, selection.feature.properties.Totalnumberofaccidents, selection.feature.properties.Numberofpedestriansinvolved,
                  selection.feature.properties.Missingwintermaintenancenr,
                  selection.feature.properties.Mostdangerousjunctions, selection.feature.properties.Numberofmiscellaneousroadusersinvolved, selection.feature.properties.Numberofmotorcyclesinvolved,
                  selection.feature.properties.Numberofpedestriansinvolved, selection.feature.properties.Slowdownnr, selection.feature.properties.Speedlimit, selection.feature.properties.Missingstreetlightnr, 
                  selection.feature.properties.Totalnumberofinvolvedroadusers, selection.feature.properties.Numberofbicyclesinvolved, selection.feature.properties.Numberofcarsinvolved, selection.feature.properties.Numberoflorriesinvolved);
            } else {
               map.closePopup();
            }
      },
      hover: function (selection) {
            if (selection.feature) {
               showPolygonPopup(selection.leaflet_event.latlng, selection.feature.properties.Trafficcellname, selection.feature.properties.Totalnumberofaccidents, 
                  selection.feature.properties.Accidentswithslightlyinjured, selection.feature.properties.Accidentswithseriouslyinjured, selection.feature.properties.Accidentsinvolvingfatalities);
            } else {
               map.closePopup();
            }

      }
 
   }

});
layer.addTo(map);
map.setView([52.5200, 13.4050], 12);

/*

 **********Global variables**********

*/

var centerBerlin = {lat: 52.5200, lng: 13.4050}
//var berlinMarker = L.marker([centerBerlin.lat, centerBerlin.lng]);
//berlinMarker.addTo(map);

const servicesLocations = [];

/*
**********HERE GEOCODING************
*/


let startCoordinates = '';

document.getElementById('change-start').onclick = showSearch;
showSearch();

async function geocode(query) {
   const url = `https://geocoder.api.here.com/6.2/geocode.json?app_id=${here.id}&app_code=${here.code}&searchtext=${query},+Berlin` //only inside Berlin
   const response = await fetch(url);
   const data = await response.json();
   return await data.Response.View[0].Result[0].Location.NavigationPosition[0];
}

async function showSearch() {
   const startAddress = document.getElementById('start').value;
   startCoordinates = await geocode(startAddress);
   map.setView([startCoordinates.Latitude, startCoordinates.Longitude], 12);

   var searchPopup = L.popup({closeButton: false});
   searchPopup

   .setLatLng([startCoordinates.Latitude, startCoordinates.Longitude])
   .setContent('</p><p><strong>Name: </strong>' + startAddress + '</p><p><strong>Location: </strong>' + [startCoordinates.Latitude, startCoordinates.Longitude] )
   .openOn(map); 

}


/*

 **********HERE Places API**********

*/

//Style your own icon for selected Places!

var myIcon = L.icon({
   iconUrl: 'icons/ambulance.png',
   iconSize: [38, 38],
   iconAnchor: [22, 94],
   popupAnchor: [-3, -76],
   shadowSize: [68, 95],
   shadowAnchor: [22, 94]
});

/*

>> Check out HERE Developer page -> https://developer.here.com/documentation/places/dev_guide/topics/place_categories/category-700-business-services.html#category-7300-police-fire-emergency
>> I.e.:

Other Places to select using parameter "name":
      - Ambulance Services
      - Police Station 
      - Road Assistance
      - ...

*/

function addAuthoritiesPlace(){
   let params = {
     "app_id": 'Kaj60PEbsgRNPKhvGRoW',
     "app_code": 'vb_hoxXseLgJfIbO9Q7gJA',
     "in":  centerBerlin.lat + ',' + centerBerlin.lng +";r=100000",       // meters
     "name": "Ambulance Services",
     "size": "50000"
   }

   let query = Object.keys(params)
              .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
              .join('&')
   let url = 'https://places.api.here.com/places/v1/browse?' + query
 
 
   fetch(url, {
     "method": "GET"
   })
   .then(response => response.json())
   .then(response => {
     console.log(response)
     for (i=0; i < response.results.items.length; i++)
       {  

       newpos= {lat: response.results.items[i].position[0], lng: response.results.items[i].position[1]}

       addMarker(newpos)
       
       } 
   })
 }
 function addMarker(newpos, html){
   ev_marker = L.marker([newpos.lat, newpos.lng], {icon: myIcon})
   ev_marker.addTo(map).on('dblclick', onDblClick)
 }
 
 addAuthoritiesPlace()

//****************Routing*********************
var platform = new H.service.Platform({ apikey: here.apikey });
//
var router = platform.getRoutingService();


// Define a callback function to process the isoline response.
var onResult = function(result) {
   var center = new H.geo.Point(
     result.response.center.latitude,
     result.response.center.longitude),
   isolineCoords = result.response.isoline[0].component[0].shape,
   isolinePolygon,
   isolineCenter
 

   // Create a polygon and a marker representing the isoline:
   //43.2323, 12.2312, 44.32112, 13.13213 --> [[43.2323, 12.2312], [44.32112, 13.13213],...]
   var list1 = isolineCoords.toString()
   var string = list1.split(',');

   // Create array of float for each pair of coordinate
   var a = string.length;
   for (i = 0; i < a; i++) {
      string[i] = parseFloat(string[i]);
   }

   // Initialize an array to store the new values
   var b = string.length / 2;
   var array = [];
   for (i = 0; i < b; i++) {
      array[i] = [0, 0];
   }

   // Create an array of array of coordinates
   var k = 0;
   for (i = 0; i < b; i++) {
      for (j = 0; j < 2; j++) {
         array[i][j] = string[k];
         k++;
      }
   }
   
   // Add the polygon to the map:
   var isolinePolygon = {};

   //check here:     https://gis.stackexchange.com/questions/238414/leaflet-how-to-add-a-new-and-remove-an-old-marker-every-time-the-user-click-on/238419
   alert(isolinePolygon)

   if (isolinePolygon != undefined) {
      map.removeLayer(isolinePolygon);
   };

   isolinePolygon = L.polygon(array)
   isolinePolygon.addTo(map)
 
    
 }


 // Call the Routing API to calculate an isoline:

 function onDblClick(e) {
   //alert(e.latlng.lat + ',' + e.latlng.lng);
   //if feature clicked twice - > fire routing
   //routing parameters
   
   var myStart = e.latlng.lat + ',' + e.latlng.lng
   var routingParams = {
   'mode': 'fastest;car;traffic:enabled',
   'start': myStart,
   'range': '600', // 10 (10x60secs) minutes of driving 
   'rangetype': 'time'
}

   router.calculateIsoline(
      routingParams,
      onResult,
      function(error) {
      alert(error.message)
      }
    );

}

 /*

 **********Layers on & off**********

 */

function toggle(layerName) {
   layer.scene.config.layers["_" + layerName].enabled = !layer.scene.config.layers["_" + layerName].enabled;
   document.getElementById(layerName).className = layer.scene.config.layers["_" + layerName].enabled ? "on" : "off";
   layer.scene.updateConfig();
}

 /*

 **********Popups**********

 */

var popup = L.popup({closeButton: false});

function showPolygonPopup(latlng, Trafficcellname, Totalnumberofaccidents, Accidentswithslightlyinjured,
   Accidentswithseriouslyinjured, Accidentsinvolvingfatalities) {

      if (Trafficcellname != undefined && Totalnumberofaccidents != undefined && Accidentswithslightlyinjured != undefined && Accidentswithseriouslyinjured != undefined && Accidentsinvolvingfatalities != undefined)
      popup
        .setLatLng(latlng)
        .setContent('</p><p><strong>Traffic cell name: </strong>' + Trafficcellname +
        '</p><p><strong>Total nr of accidents: </strong>' + Totalnumberofaccidents + 
        '</p><p><strong>Accidents with slightly injured: </strong>' + Accidentswithslightlyinjured + 
        '</p><p><strong>Accidents with seriously injured: </strong>' + Accidentswithseriouslyinjured + 
        '</p><p><strong>Accidents involving fatalities: </strong>' + Accidentsinvolvingfatalities)
        .openOn(map);      
   }

function showPopup(latlng, Totalnumberofaccidents, Numberofpedestriansinvolved, Missingwintermaintenancenr,
   Mostdangerousjunctions, Numberofmiscellaneousroadusersinvolved, Numberofmotorcyclesinvolved, Numberofpedestriansinvolved,
   Slowdownnr, Speedlimit, Missingstreetlightnr, Totalnumberofinvolvedroadusers, Numberofbicyclesinvolved, Numberofcarsinvolved, Numberoflorriesinvolved) {

   //winter maintnace: Missingwintermaintenancenr
   if (Missingwintermaintenancenr != undefined) {
      popup
        .setLatLng(latlng)
        .setContent('</p><p><strong>ID: </strong>' + Missingwintermaintenancenr)
        .openOn(map);
   } 
   //Mostdangerousjunctions: Mostdangerousjunctions, Numberofmiscellaneousroadusersinvolved, Numberofmotorcyclesinvolved, Numberofpedestriansinvolved, Totalnumberofaccidents, Totalnumberofinvolvedroadusers(not yet)
   else if (Mostdangerousjunctions != undefined && Numberofmiscellaneousroadusersinvolved != undefined && Numberofmotorcyclesinvolved != undefined && Numberofpedestriansinvolved != undefined
   && Totalnumberofinvolvedroadusers != undefined && Numberofbicyclesinvolved != undefined && Numberofcarsinvolved != undefined && Numberoflorriesinvolved != undefined) {
      popup
         .setLatLng(latlng)
         .setContent('</p><p><strong>ID: </strong>' + Mostdangerousjunctions + 
         '</p><p><strong>Total nr of accidents: </strong>' + Totalnumberofaccidents +
         '</p><p><strong>Total nr of road users involved: </strong>' + Totalnumberofinvolvedroadusers +
         '</p><p><strong>Total nr of cyclists involved: </strong>' + Numberofbicyclesinvolved + 
         '</p><p><strong>Total nr of cars involved: </strong>' + Numberofcarsinvolved + 
         '</p><p><strong>Total nr of lorries involved: </strong>' + Numberoflorriesinvolved +
         '</p><p><strong>Nr of motorcycles involved: </strong>' + Numberofmotorcyclesinvolved + 
         '</p><p><strong>Nr of pedestrians involved: </strong>' + Numberofpedestriansinvolved +
         '</p><p><strong>Nr of miscellaneous road users involved: </strong>' + Numberofmiscellaneousroadusersinvolved)
         .openOn(map);
   }
   //SlowDown: Slowdownnr, Speedlimit 
   else if (Slowdownnr != undefined && Speedlimit != undefined) {
      popup
         .setLatLng(latlng)
         .setContent('</p><p><strong>ID: </strong>' + Slowdownnr + '</p><p><strong>Speed limit: </strong>' + Speedlimit)
         .openOn(map);      
   }
   //Missingstreetlight: Missingstreetlightnr
   else if (Missingstreetlightnr != undefined) {
      popup
         .setLatLng(latlng)
         .setContent('</p><p><strong>ID: </strong>' + Missingstreetlightnr)
         .openOn(map);   
   }
   else {
      //window.alert('Error')
   }
}




