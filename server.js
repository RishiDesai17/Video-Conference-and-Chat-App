const express = require('express')
const app = express()
const cors = require('cors')
const http = require('http')
const morgan = require('morgan')
const mongoose = require('mongoose')
const socket = require('socket.io')
const server = http.createServer(app)
const io = socket(server)
const uuid = require('uuid');
require('dotenv').config({ path: __dirname + '/.env' })
const { createMeet } = require('./controllers/meets')

mongoose.connect(process.env.DBURL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});
  
mongoose.Promise = global.Promise;

app.use(morgan('dev'))
app.use(express.json())

const userRoutes = require('./routes/users');

app.use('/api/users', userRoutes);

app.use(cors())

io.on("connection", (socket) => {
    console.log("connection")

    socket.on("start meet", () => {
        console.log(socket.id)
        const roomID = uuid.v4()
        socket.join(roomID)
        socket.roomID = roomID
        io.to(socket.id).emit("roomID", roomID)
        // createMeet(roomID, )
        // console.log(Object.keys(io.sockets.adapter.sids[socket.id]))
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
        if(roomData.length > 100){
            socket.emit("room full")
            return;
        }
        socket.join(roomID)
        socket.roomID = roomID
        const usersInThisRoom = Object.keys(io.sockets.adapter.rooms[roomID].sockets)
        console.log(usersInThisRoom)
        io.to(socket.id).emit("all users", usersInThisRoom);
        // console.log(Object.keys(io.sockets.adapter.sids[socket.id]))
    })

    socket.on("sending signal", payload => {
        console.log("sending signal")
        io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, id: payload.callerID });
    });

    socket.on("returning signal", payload => {
        console.log("returning signal")
        io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
    });

    socket.on("message", (message) => {
        console.log(message, socket.roomID)
        socket.broadcast.to(socket.roomID).emit('receive-message', { sender: socket.id, message });
    })

    socket.on("disconnect", () => {
        console.log("disconnect " + socket.id)
        socket.broadcast.to(socket.roomID).emit("disconnected", socket.id)
    })
})

app.get("/hi", (req,res) => {
    res.send("Hey")
})

server.listen(3001, () => {
    console.log("listening on 3001")
})