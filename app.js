const express = require('express');
const app = express();
const http = require("http");
const path = require('path');
const socketio = require("socket.io");

const server = http.createServer(app);

const io = socketio(server);

app.set("view engine" ,"ejs");
app.use(express.json());
app.use(express.static(path.join(__dirname,"public")));

io.on("connection" ,(socket) =>{
   
     socket.on("send-location",(data) =>{
            io.emit("recv-location",  {id: socket.id,...data});
     })
     socket.on("disconnect",()=>{
          io.emit("user-disconnexted", socket.id);
     })


     console.log("A new connection with id",socket.id);
})

app.get("/",(req,res) =>{
     res.render("index");
})
const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});