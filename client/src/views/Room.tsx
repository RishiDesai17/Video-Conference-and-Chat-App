import React, { useEffect, useRef, useState, useCallback } from "react";
import io from 'socket.io-client';
import Peer from 'simple-peer';
import * as queryString from 'query-string';
import Video from '../components/Video.jsx';

interface PeersRef {
    peerID: string,
    peer: Peer.Instance
}

interface Payload {
    signal: any,
    id: string
}

const Room: React.FC = (props) => {
    const userVideo = useRef<HTMLVideoElement>(document.createElement('video'))
    const socketRef = useRef<SocketIOClient.Socket>(io.Socket)
    const [peers, setPeers] = useState<Array<Peer.Instance>>([])
    const peersRef = useRef<Array<PeersRef>>([])

    useEffect(() => {
        init()
    }, [])

    const init = useCallback(async() => {
        socketRef.current = io.connect("/")
        const stream: MediaStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
        userVideo.current.srcObject = stream
        const queryParams: queryString.ParsedQuery<string> = queryString.parse(window.location.search)
        console.log(queryParams.room)
        if(!queryParams.room){
            // alert("")
        }
        socketRef.current.emit("join room", queryParams.room)
        socketRef.current.on("all users", (users: string[]) => {
            const peers = users.reduce((result: Peer.Instance[], userID: string) => {
                if(userID !== socketRef.current.id){
                    const peer = createPeer(userID, socketRef.current.id, stream);
                    peersRef.current.push({
                        peerID: userID,
                        peer
                    })
                    result.push(peer)
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
            peersRef.current.push({
                peerID: id,
                peer
            })
            setPeers((peers) => [...peers, peer])
        })

        socketRef.current.on("receiving returned signal", (payload: Payload) => {
            console.log("receiving returned signal")
            const { signal, id } = payload
            const item = peersRef.current.find((p: PeersRef) => p.peerID === id);
            if(item){
                item.peer.signal(signal)
            }
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
    
    return(
        <>
            <video autoPlay playsInline ref={userVideo} />
            {peers.map((peer) => (
                <Video peer={peer} />
            ))}
        </>
    )
}

export default Room