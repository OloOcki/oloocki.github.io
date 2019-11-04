// credentials to here
const here = {
   id: '3gXnhz9ZTjw77nLMsYjd',
   code: 'fJxwHeNo9q0_LitEw-rj-g'
};

//map init
//{lat: 52.5200, lng: 13.4050} //Berlin coordinates
const map = L.map('map', {
   center: [52.5200, 13.4050],
   zoom: 13,
   layers: [
      Tangram.leafletLayer({
         scene: 'scene.yaml',
         events: {
            click: onMapClick
         }
      })
   ],
   zoomControl: false
});

async function onMapClick() {
   //We will write code in here later...
}

