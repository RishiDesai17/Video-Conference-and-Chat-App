const express = require('express')
const app = express()
const cors = require('cors')
const http = require('http')
const socket = require('socket.io')
const server = http.createServer(app)
const io = socket(server)
const uuid = require('uuid')

app.use(express.json())
app.use(cors())

io.on("connection", (socket) => {
    console.log("connection")

    socket.on("start meet", (roomID) => {
        console.log(roomID, socket.id)
        socket.join(roomID)
    })

    socket.on("join room", (roomID) => {
        console.log(roomID, socket.id)
        // if(!uuid.validate(roomID)){
        //     socket.emit("invalid room")
        //     return;
        // }
        // const roomData = io.sockets.adapter.rooms[roomID]
        // if(!roomData){
        //     socket.emit("invalid room")
        //     return;
        // }
        // if(roomData.length === 100){
        //     socket.emit("room full")
        //     return;
        // }
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

app.post("/checkroom", (req,res) => {
    try{
        if(io.sockets.adapter.rooms[req.body.roomid]){
            return res.status(200).json({
                exists: true
            })
            // console.log(io.sockets.adapter.rooms[req.body.roomid].length)
        }
        return res.json({
            exists: false
        }) 
    }
    catch(error) {
        console.log(error)
        res.status(500).json({
            message: "Something went wrong"
        })
    }
})

app.post("/x", (req,res) => {
    if(io.sockets.adapter.rooms[req.body.roomid]){
        console.log(io.sockets.adapter.rooms[req.body.roomid].length)
    }
    // console.log(io.sockets.clients(req.body.roomID))
    return res.json({room: io.sockets.adapter.rooms[req.body.roomid]})
})

app.get("/test", (req,res) => {
    res.send("hi")
})

server.listen(3001, () => {
    console.log("listening on 3001")
})