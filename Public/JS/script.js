const socket = io();

if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            // console.log(longitude,latitude);
            socket.emit('send-location', { longitude, latitude })
        },
        (err) => {
            console.error(err)
        },
        {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 5000,
        }
    )
}
else {
    console.log('Geo location is not active');
}
const map = L.map("map").setView([0, 0], 10);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Jagdeesh Bhandari'
}).addTo(map)


const markers = {};

socket.on('receive-location', (data) => {
    const { id, latitude, longitude } = data;
    // console.log('recieved',latitude,longitude)
    map.setView([latitude, longitude], 16)
    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude])
    }
    else {
        markers[id] = L.marker([latitude, longitude]).addTo(map)
    }
})

socket.on('user-disconnect', (id) => {
    if (markers[id]) {
        map.removeLayers[markers[id]];
        delete markers[id]
    }
})