import React, { useEffect, useRef, useState } from "react";
import io from 'socket.io-client';
import Peer from 'simple-peer';
import * as queryString from 'query-string';
import { Link } from "react-router-dom";

const Room: React.FC = (props) => {
    const userVideo = useRef<HTMLVideoElement>(document.createElement('video'))
    const socketRef = useRef<SocketIOClient.Socket>(io.Socket)

    useEffect(() => {
        init()
    }, [])

    const init = () => {
        socketRef.current = io.connect("/")
        navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then((stream) => {
            userVideo.current.srcObject = stream
            const queryParams = queryString.parse(window.location.search)
            console.log(queryParams.room)
            if(!queryParams.room){
                // alert("")
            }
            socketRef.current.emit("join room", queryParams.room)
        })
    }
    
    return(
        <>
            <video autoPlay playsInline ref={userVideo} />
            <a href="https://google.com">google</a>
            <Link to="/">link</Link>
        </>
    )
}

export default Room