import React, { useEffect, useRef, useState, useCallback } from "react";
import io from 'socket.io-client';
import Peer from 'simple-peer';
import { useHistory } from 'react-router-dom';
import * as queryString from 'query-string';
import Video from '../components/Video';
import ChatBox from "../components/ChatBox";
import Controls from '../components/Controls';
import Header from '../components/Header';
import clsx from 'clsx';
import { Drawer, Container, CssBaseline } from "@material-ui/core";
import './styles/Room.css';
import RoomMaterialStyles from './styles/RoomMaterialstyles';

interface Peers {
    peerID: string,
    peer: Peer.Instance
}

interface Payload {
    signal: any,
    id: string
}

const Room: React.FC = () => {
    const userVideo = useRef<HTMLVideoElement>(document.createElement('video'))
    const userStream = useRef<MediaStream>()
    const socketRef = useRef<SocketIOClient.Socket>(io.Socket)
    const [peers, setPeers] = useState<Array<Peers>>([])
    const peersRef = useRef<Array<Peers>>([])
    const [showChat, setShowChat] = useState<boolean>(false)
    const [open, setOpen] = useState(false);
    const history = useHistory()
    const classes = RoomMaterialStyles();

    useEffect(() => {
        init()
    }, [])

    const init = useCallback(async() => {
        socketRef.current = io.connect("/")
        const stream: MediaStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
        userVideo.current.srcObject = userStream.current = stream
        const queryParams: queryString.ParsedQuery<string> = queryString.parse(window.location.search)
        console.log(queryParams.room)
        if(queryParams.host && !queryParams.room){
            socketRef.current.emit("start meet")
            socketRef.current.on("roomID", (roomID: string) => {
                console.log(roomID)
                window.history.replaceState("", "", `?room=${roomID}`);
            })
        }
        else{
            const queryParams: queryString.ParsedQuery<string> = queryString.parse(window.location.search)
            console.log(queryParams.room)
            if(queryParams.host || !queryParams.room || typeof queryParams.room !== 'string'){
                alert("Enter a valid url")
                exit()
                return;
            }
            socketRef.current.emit("join room", queryParams.room)
            socketRef.current.on("invalid room", () => {
                alert("Invalid room")
                exit()
                return;
            })
            socketRef.current.on("room full", () => {
                alert("Room full")
                exit()
                return;
            })
        }
        setShowChat(true)
        socketRef.current.on("all users", (users: string[]) => {
            const peers = users.reduce((result: Peers[], userID: string) => {
                if(userID !== socketRef.current.id){
                    const peer = createPeer(userID, socketRef.current.id, stream);
                    const peerObj = {
                        peerID: userID,
                        peer
                    }
                    peersRef.current.push(peerObj)
                    result.push(peerObj)
                }
                return result
            }, [])
            console.log(peers)
            setPeers(peers)
        })

        socketRef.current.on("user joined", (payload: Payload) => {
            console.log("user joined")
            const { signal, id } = payload
            const peer = addPeer(signal, id, stream)
            const peerObj: Peers = {
                peerID: id,
                peer
            }
            peersRef.current.push(peerObj)
            addPeerVideo(peerObj)
        })

        socketRef.current.on("receiving returned signal", (payload: Payload) => {
            console.log("receiving returned signal")
            const { signal, id } = payload
            const item = peersRef.current.find((p: Peers) => p.peerID === id);
            if(item){
                item.peer.signal(signal)
            }
        })
        socketRef.current.on("disconnected", (id: string) =>{
            disconnected(id)
        })
    }, [])

    const createPeer = (userToSignal: string, callerID: string, stream: MediaStream) => {
        console.log("create peer")
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream
        })

        peer.on("signal", (signal) => {
            socketRef.current.emit("sending signal", { userToSignal, callerID, signal })
        })

        return peer
    }

    const addPeer = (incomingSignal: any, callerID: string, stream: MediaStream) => {
        console.log("add peer")
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream
        })
        peer.on("signal", (signal) => {
            console.log(signal)
            socketRef.current.emit("returning signal", { signal, callerID })
        })
        peer.signal(incomingSignal)
        return peer
    }

    const addPeerVideo = useCallback((peerObj: Peers) => {
        setPeers(peers => [...peers, peerObj])
    }, [])

    const removePeerVideo = useCallback((id: string) => {
        setPeers(peers => peers.filter(peer => peer.peerID !== id))
    }, [])

    const exit = useCallback(() => {
        socketRef.current.disconnect()
        history.replace("/")
        userStream.current?.getTracks().forEach((track) => {
            track.stop();
        });
    }, [])

    const disconnected = useCallback((id: string) => {
        alert(id + "left the chat")
        peersRef.current = peersRef.current.filter(peer => peer.peerID !== id)
        removePeerVideo(id)
    }, [])
    
    return(
        <div className={classes.root}>
            <CssBaseline />
            <Header open={open} setOpen={setOpen} showChat={showChat} />
            <main
                className={clsx(classes.content, {
                    [classes.contentShift]: open,
                })}
            >
                <div className={classes.drawerHeader} />
                <div id="video-grid">
                    {peers.map((peer, index) => (
                        <Video key={index} peer={peer.peer} />
                    ))}
                </div>
                <Container>
                <div id="controls-box">
                    <Controls exit={exit} />
                </div>
                </Container>
                <div id="self-video">
                    <video autoPlay playsInline ref={userVideo} />
                </div>
            </main>
             <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="right"
                open={open}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                {showChat && <ChatBox socket={socketRef.current} close={() => setOpen(false)} />}
            </Drawer>
        </div>
    )
}

export default Room