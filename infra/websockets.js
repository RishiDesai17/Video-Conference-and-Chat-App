const socket = require('socket.io')
const http = require('http')
const uuid = require('uuid')

const { verifyJwt } = require('../infra/jwt');
const { createMeet, addMember } = require('../controllers/meets')

const attachWebSockets = app => {
    const server = http.createServer(app);
    const io = socket(server)

    io.on("connection", (socket) => {
        console.log("connection")
    
        socket.on("start meet", async(jwtFromClient) => {
            try{
                const { id, name } = await verifyJwt(jwtFromClient)
                const roomID = uuid.v4()
                socket.join(roomID)
                socket.roomID = roomID
                socket.isHost = true
                socket.userName = name
                io.to(socket.id).emit("roomID", roomID)
                createMeet({
                    roomID,
                    hostID: id
                })
                console.log(socket.id)
            }
            catch(err){
                if(err.name === "JsonWebTokenError"){
                    socket.emit("unauthorized", "Please login again")
                    return
                }
                socket.emit("something broke", "Oops! Something went wrong, please try again!")
            }
        })
    
        socket.on("join room", async({ roomID, jwtFromClient }) => {
            try{
                const { id, name } = await verifyJwt(jwtFromClient)
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
                socket.userName = name
                const usersInThisRoom = Object.keys(io.sockets.adapter.rooms[roomID].sockets)
                console.log(usersInThisRoom)
                io.to(socket.id).emit("all users", usersInThisRoom);
                addMember({
                    roomID,
                    userID: id
                })
                console.log(roomID, socket.id)
            }
            catch(err){
                console.log(err)
                socket.emit("unauthorized", "Please login")
            }
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
    
    return server
}

module.exports = attachWebSockets;