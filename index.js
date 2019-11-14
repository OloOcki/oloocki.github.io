// credentials to here
const here = {
   id: 'Kaj60PEbsgRNPKhvGRoW',
   code: 'vb_hoxXseLgJfIbO9Q7gJA'
};


//map init
//{lat: 52.5200, lng: 13.4050} //Berlin coordinates
//var mode = 'solar';



var map = L.map('map', { boxZoom: false });
var layer = Tangram.leafletLayer({
   scene: 'scene.yaml',
   attribution: '<a href="https://mapzen.com/tangram" target="_blank">Tangram</a> | &copy; OSM contributors | <a href="https://mapzen.com/" target="_blank">Mapzen</a>',
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

/*
var centerBerlin = {lat: 52.5200, lng: 13.4050}
var punkt = L.marker([centerBerlin.lat, centerBerlin.lng]);
punkt.addTo(map);
*/

//Add maintanance locations
function DisplayEV(){
   let params = {
     "app_id": 'Kaj60PEbsgRNPKhvGRoW',
     "app_code": 'vb_hoxXseLgJfIbO9Q7gJA',
     "in":  centerBerlin.lat + ',' + centerBerlin.lng +";r=1000000",       // meters
     "cat": "toilet-rest-area",
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
   ev_marker = L.marker([newpos.lat, newpos.lng])
   ev_marker.addTo(map)
 }
 
 DisplayEV()



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




