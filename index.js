const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const socketio = require('socket.io')
const server = http.createServer(app);
const io = socketio(server)

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')))

app.get('/',(req,res)=>{
    res.render('index');
})

io.on('connection',(socket)=>{
    console.log(socket.id)
    socket.on('send-location',(data)=>{
       
        io.emit('receive-location', {id:socket.id, ...data})
    })
    socket.on('disconnect',()=>{
        io.emit('user-disconnect',{id:socket.id})
    })
})


server.listen(3000, '0.0.0.0', () => {
    console.log('Server is running on http://0.0.0.0:3000');
});
  