const socket = io();

if(navigator.geolocation){
    navigator.geolocation.watchPosition((position) =>{
            const {latitude,longitude} = position.coords;
            socket.emit("send-location" ,{latitude,longitude});
    },(error) =>{
        console.log(error);
    },
    {
        enableHighAccuracy: true,
        timeout :5000,
        maximumAge:0,
    }
)
}

const map = L.map("map").setView([0,0] ,19);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution : "Open stree Map"
}).addTo(map);

const markers ={};

socket.on('recv-location',(data) =>{
    const {id, latitude, longitude} = data;
    map.setView([latitude,longitude]);
    if(markers[id])
    {
        markers[id].setLatLang([latitude,longitude]);
    }
    else{
        markers[id] = L.marker([latitude,longitude]).addTo(map);
    }
});
socket.on("user-disconnect" ,(id) =>{
    if(markers[id])
    {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
})
