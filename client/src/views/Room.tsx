import React, { useEffect, useRef, useState, useCallback } from 'react';
import Drawer from '../components/Drawer';
import io from 'socket.io-client';
import Peer, { Instance, SignalData } from 'simple-peer';
import useStore from '../zustand/store';
import { useHistory } from 'react-router-dom';
import * as queryString from 'query-string';
import Video from '../components/Video';
import ChatBox from '../components/ChatBox';
import Controls from '../components/Controls';
import Header from '../components/Header';
import clsx from 'clsx';
import { /*Drawer,*/ Container, CssBaseline } from '@material-ui/core';
import './styles/Room.css';
import RoomMaterialStyles from './styles/RoomMaterialstyles';

type Peer = {
    peerID: string,
    peer: Instance,
    username: string
}

type Member = {
    id: string,
    username: string
}

type Payload = {
    signal: SignalData,
    id: string,
    username: string
}

type DisconnectedUser = {
    id: string,
    username: string
}

const Room: React.FC = () => {
    const userVideo = useRef<HTMLVideoElement>(document.createElement('video'))
    const userStream = useRef<MediaStream>()
    const socketRef = useRef<SocketIOClient.Socket>(io.Socket)
    const peersRef = useRef<Array<Peer>>([])

    const [peers, setPeers] = useState<Array<Peer>>([])
    const [showDrawerChildren, setShowDrawerChildren] = useState<boolean>(false)
    const [open, setOpen] = useState<boolean>(false);
    
    const get_access_token = useStore(useCallback(state => state.get_access_token, []))
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
            socketRef.current.emit("start meet", get_access_token())
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
            socketRef.current.emit("join room", { roomID: queryParams.room, jwtFromClient: get_access_token() })
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
        setShowDrawerChildren(true)

        socketRef.current.on("all members", (members: Member[]) => {
            console.log(members)
            const peers = members.map((member: Member) => {
                const peer = createPeer(member.id, socketRef.current.id, stream);
                const peerObj = {
                    peerID: member.id,
                    peer,
                    username: member.username
                }
                peersRef.current.push(peerObj)
                return peerObj
            })

            // const peers = users.reduce((result: Peers[], socketIDs: string) => {
            //     if(socketIDs !== socketRef.current.id){
            //         const peer = createPeer(socketIDs, socketRef.current.id, stream);
            //         const peerObj = {
            //             peerID: socketIDs,
            //             peer
            //         }
            //         peersRef.current.push(peerObj)
            //         result.push(peerObj)
            //     }
            //     return result
            // }, [])
            console.log(peers)
            setPeers(peers)
        })

        socketRef.current.on("user joined", (payload: Payload) => {
            console.log("user joined")
            const { signal, id, username } = payload
            const peer = addPeer(signal, id, stream)
            const peerObj: Peer = {
                peerID: id,
                peer,
                username
            }
            peersRef.current.push(peerObj)
            addPeerVideo(peerObj)
        })

        socketRef.current.on("receiving returned signal", (payload: Payload) => {
            console.log("receiving returned signal")
            const { signal, id } = payload
            const item = peersRef.current.find((p: Peer) => p.peerID === id);
            if(item){
                item.peer.signal(signal)
            }
        })

        socketRef.current.on("unauthorized", (message: string) => {
            alert(message)
            exit()
        })

        socketRef.current.on("disconnected", ({ id, username }: DisconnectedUser) => {
            disconnected({ id, username })
        })

        socketRef.current.on("something broke", (message: string) => {
            alert(message)
            exit()
        })

    }, [])

    const createPeer = useCallback((userToSignal: string, callerID: string, stream: MediaStream) => {
        // console.log("create peer")
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream
        })

        peer.on("signal", (signal) => {
            socketRef.current.emit("sending signal", { userToSignal, callerID, signal })
        })

        return peer
    }, [])

    const addPeer = useCallback((incomingSignal: SignalData, callerID: string, stream: MediaStream) => {
        // console.log("add peer")
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
    }, [])

    const addPeerVideo = useCallback((peerObj: Peer) => {
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

    const disconnected = useCallback(({ id, username }: DisconnectedUser) => {
        alert(username + "left the chat")
        peersRef.current = peersRef.current.filter(peer => peer.peerID !== id)
        removePeerVideo(id)
    }, [])
    
    return(
        <div className={classes.root}>
            <CssBaseline />
            <Header open={open} setOpen={setOpen} showDrawerChildren={showDrawerChildren} />
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
                showDrawerChildren={showDrawerChildren}
                open={open}
                setOpen={setOpen}
                socket={socketRef.current}
                peers={peers}
            />
        </div>
    )
}

export default Room