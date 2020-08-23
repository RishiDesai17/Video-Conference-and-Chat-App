import React, { useEffect, useRef, useState, useCallback } from "react";
import io from 'socket.io-client';
import Peer from 'simple-peer';
import * as queryString from 'query-string';
import Video from '../components/Video';

interface PeersRef {
    peerID: string,
    peer: Peer.Instance
}

const Room: React.FC = (props) => {
    const userVideo = useRef<HTMLVideoElement>(document.createElement('video'))
    const socketRef = useRef<SocketIOClient.Socket>(io.Socket)
    const [peers, setPeers] = useState<Array<Peer.Instance>>([])
    const peersRef = useRef<Array<PeersRef>>([])

    useEffect(() => {
        init()
    }, [])

    const init = useCallback(() => {
        socketRef.current = io.connect("/")
        navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then((stream) => {
            userVideo.current.srcObject = stream
            const queryParams = queryString.parse(window.location.search)
            console.log(queryParams.room)
            if(!queryParams.room){
                // alert("")
            }
            socketRef.current.emit("join room", queryParams.room)
            socketRef.current.on("all users", (users: string[]) => {
                const peers = users.reduce((result: Peer.Instance[], userID: string) => {
                    if(userID === socketRef.current.id){
                        const peer = createPeer(userID, socketRef.current.id, stream);
                        peersRef.current.push({
                            peerID: userID,
                            peer
                        })
                        result.push(peer)
                    }
                    return result
                }, [])
                setPeers(peers)
            })
        })
    }, [])

    const createPeer = (userToSignal: any, callerID: any, stream: any) => {
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