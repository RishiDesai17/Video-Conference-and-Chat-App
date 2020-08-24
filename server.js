const express = require('express')
const app = express()
const cors = require('cors')
const http = require('http')
const socket = require('socket.io')
const server = http.createServer(app)
const io = socket(server)
const uuid = require('uuid');

app.use(express.json())
app.use(cors())

io.on("connection", (socket) => {
    console.log("connection")

    socket.on("start meet", () => {
        console.log(socket.id)
        const roomID = uuid.v4()
        socket.join(roomID)
        io.to(socket.id).emit("roomID", roomID)
    })

    socket.on("join room", (roomID) => {
        console.log(roomID, socket.id)
        if(!uuid.validate(roomID)){
            socket.emit("invalid room")
            return;
        }
        const roomData = io.sockets.adapter.rooms[roomID]
        if(!roomData){
            socket.emit("invalid room")
            return;
        }
        if(roomData.length === 100){
            socket.emit("room full")
            return;
        }
        socket.join(roomID)
        const usersInThisRoom = Object.keys(io.sockets.adapter.rooms[roomID].sockets)
        console.log(usersInThisRoom)
        io.to(socket.id).emit("all users", usersInThisRoom);
    })

    socket.on("sending signal", payload => {
        console.log("sending signal")
        io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, id: payload.callerID });
    });

    socket.on("returning signal", payload => {
        console.log("returning signal")
        io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
    });

    socket.on("disconnect", () => {
        console.log("disconnect " + socket.id)
    })
})

app.get("/test", (req,res) => {
    res.send("hi")
})

server.listen(3001, () => {
    console.log("listening on 3001")
})