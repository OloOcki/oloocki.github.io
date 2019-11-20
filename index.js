// credentials to here
const here = {
   id: 'Kaj60PEbsgRNPKhvGRoW',
   code: 'vb_hoxXseLgJfIbO9Q7gJA',
   apikey: 'U85dP15GeBxEEK3215NWQa1JqbiXWR1nzBypg4YdrLA'
};

/* 


GENERAL IDEAS:

-> MAKE LABELS ON MAP
-> DRAGGABLE PIN TO ROUTING CALC
-> GEOSEARCHING FOR USER
-> WEATHER API


*/
//map init
//{lat: 52.5200, lng: 13.4050} //Berlin coordinates
//var mode = 'solar';

//add contributors to icon:
//<a href="http://www.onlinewebfonts.com">oNline Web Fonts</a>


//change popups for hover for polygons

var map = L.map('map', { boxZoom: false });
var layer = Tangram.leafletLayer({
   scene: 'scene.yaml',
   attribution: '<a href="https://mapzen.com/tangram" target="_blank">Tangram</a> | &copy; OSM contributors | <a href="https://mapzen.com/" target="_blank">Mapzen</a> | &copy; OnlineWebFonts | ',
   events: {
      click: function (selection) {
            if (selection.feature) {
               showPopup(selection.leaflet_event.latlng, selection.feature.properties.Totalnumberofaccidents, selection.feature.properties.Numberofpedestriansinvolved,
                  selection.feature.properties.Missingwintermaintenancenr, selection.feature.properties.Trafficcellname, selection.feature.properties.Totalnumberofaccidents, 
                  selection.feature.properties.Accidentswithslightlyinjured, selection.feature.properties.Accidentswithseriouslyinjured, selection.feature.properties.Accidentsinvolvingfatalities,
                  selection.feature.properties.Mostdangerousjunctions, selection.feature.properties.Numberofmiscellaneousroadusersinvolved, selection.feature.properties.Numberofmotorcyclesinvolved,
                  selection.feature.properties.Numberofpedestriansinvolved, selection.feature.properties.Slowdownnr, selection.feature.properties.Speedlimit, selection.feature.properties.Missingstreetlightnr, 
                  selection.feature.properties.Totalnumberofinvolvedroadusers, selection.feature.properties.Numberofbicyclesinvolved, selection.feature.properties.Numberofcarsinvolved, selection.feature.properties.Numberoflorriesinvolved);
            } else {
               map.closePopup();
            }
      }
 
   }

});
layer.addTo(map);
// center of Berlin
map.setView([52.5200, 13.4050], 12);

//add Center of Berlin as marker
var centerBerlin = {lat: 52.5200, lng: 13.4050}
//var punkt = L.marker([centerBerlin.lat, centerBerlin.lng]);
//punkt.addTo(map);

//####### Init global  #######
const servicesLocations = [];

//

//
/*
###### Services locations #######
*/
//Icon styling
var myIcon = L.icon({
   iconUrl: 'icons/ambulance.png',
   iconSize: [38, 38],
   iconAnchor: [22, 94],
   popupAnchor: [-3, -76],
   shadowSize: [68, 95],
   shadowAnchor: [22, 94]
});


//Other possibilities for "name":
//       Ambulance Services
//       Police Station 
//       Road Assistance
//https://developer.here.com/documentation/places/dev_guide/topics/place_categories/category-700-business-services.html#category-7300-police-fire-emergency

//Add maintanance locations
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
       // resultData[i] = response.results.items[i]

       newpos= {lat: response.results.items[i].position[0], lng: response.results.items[i].position[1]}

       addMarker(newpos)
       
       } 
   })
 }
 function addMarker(newpos, html){
   ev_marker = L.marker([newpos.lat, newpos.lng], {icon: myIcon})
   ev_marker.addTo(map)
   servicesLocations.push([newpos.lat, newpos.lng])
 }
 
 addAuthoritiesPlace()

//****************Routing*********************
var platform = new H.service.Platform({ apikey: here.apikey });
//
var router = platform.getRoutingService();
/*
isolineCenter = L.marker([centerBerlin.lat, centerBerlin.lng], {draggable: true})
isolineCenter.addTo(map)

//var mode = 'start'
//var coord = centerBerlin.lat + ',' + centerBerlin.lng

isolineCenter.on('dragend', function(ev) 
{
   var coord = ev.target.getLatLng();
   //var mode = 'change'
   //check(coord, mode)
   //window.alert([latlng.lat, latlng.lng]) 
   
});
*/

//     MAKE DOUBLE CLICK ON A HOSPITAL ETC. AND THEN CALCULATE ISOLINE -> ISOLINE AS ASYNC FUNCTION
function onMapClick(e) {
   for (i=0; i < servicesLocations.length; i++)
   {

      //create temp var to compare coordinates of event vs. values of input layer
      compServLoca = L.latLng(servicesLocations[i])
      compEvenLoca = e.latlng

      
      //alert(e.latlng)
      //alert(compServLoca)
      //https://stackoverflow.com/questions/16202968/using-leaflet-mapping-api-how-do-you-determine-which-point-in-a-polyline-was-cl

      if (compEvenLoca.equals(compServLoca, 0.1)){
         alert("OK!")
      }
      else {
         alert("it is not the right object")
      }

      //alert(e.latlng)
      //alert(compServLoca)
      //alert(servicesLocations[i])  
   
   //if event click latlng == servicesLocations latlng i then show popup -> then trigger isoline function

   }
}

map.on('click', onMapClick);

//routing parameters
var myStart = centerBerlin.lat + ',' + centerBerlin.lng
var routingParams = {
  'mode': 'fastest;car;traffic:enabled',
  'start': myStart,
  'range': '600', // 10 (10x60secs) minutes of driving 
  'rangetype': 'time'
}

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
   var lista1 = isolineCoords.toString()
   var string = lista1.split(',');

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
   
   // Add the polygon and marker to the map:
/*   isolineCenter = L.marker([center.lat, center.lng], {draggable: true})
   isolineCenter.addTo(map)
   
   isolineCenter.on('dragend', function(ev) 
   {
      var latlng = ev.target.getLatLng();
      //window.alert([latlng.lat, latlng.lng]) 
      
  });*/
   
   isolinePolygon = L.polygon(array)
   isolinePolygon.addTo(map)
 
    
   // Center and zoom the map so that the whole isoline polygon is
   // in the viewport:
  //map.getViewModel().setLookAtData({bounds: isolinePolygon.getBoundingBox()})
 }


 // Call the Routing API to calculate an isoline:
router.calculateIsoline(
   routingParams,
   onResult,
   function(error) {
   alert(error.message)
   }
 );

//**********Layers on & off********** */

function toggle(layerName) {
   layer.scene.config.layers["_" + layerName].enabled = !layer.scene.config.layers["_" + layerName].enabled;
   document.getElementById(layerName).className = layer.scene.config.layers["_" + layerName].enabled ? "on" : "off";
   layer.scene.updateConfig();
}


// popups
var popup = L.popup({closeButton: false});

function showPopup(latlng, Totalnumberofaccidents, Numberofpedestriansinvolved, Missingwintermaintenancenr, Trafficcellname, Totalnumberofaccidents, Accidentswithslightlyinjured,
   Accidentswithseriouslyinjured, Accidentsinvolvingfatalities, Mostdangerousjunctions, Numberofmiscellaneousroadusersinvolved, Numberofmotorcyclesinvolved, Numberofpedestriansinvolved,
   Slowdownnr, Speedlimit, Missingstreetlightnr, Totalnumberofinvolvedroadusers, Numberofbicyclesinvolved, Numberofcarsinvolved, Numberoflorriesinvolved) {
   //window.alert(Totalnumberofaccidents)

   //winter maintnace: Missingwintermaintenancenr
   if (Missingwintermaintenancenr != undefined) {
      popup
        .setLatLng(latlng)
        .setContent('</p><p><strong>ID: </strong>' + Missingwintermaintenancenr)
        .openOn(map);
   } 
   //AccidentPerCell: Trafficcellname, Totalnumberofaccidents, Accidentswithslightlyinjured, Accidentswithseriouslyinjured, Accidentsinvolvingfatalities
   else if(Trafficcellname != undefined && Totalnumberofaccidents != undefined && Accidentswithslightlyinjured != undefined && Accidentswithseriouslyinjured != undefined
   && Accidentsinvolvingfatalities != undefined) {
      popup
        .setLatLng(latlng)
        .setContent('</p><p><strong>Traffic cell name: </strong>' + Trafficcellname +
        '</p><p><strong>Total nr of accidents: </strong>' + Totalnumberofaccidents + 
        '</p><p><strong>Accidents with slightly injured: </strong>' + Accidentswithslightlyinjured + 
        '</p><p><strong>Accidents with seriously injured: </strong>' + Accidentswithseriouslyinjured + 
        '</p><p><strong>Accidents involving fatalities: </strong>' + Accidentsinvolvingfatalities)
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
      window.alert('Error')
   }
}




