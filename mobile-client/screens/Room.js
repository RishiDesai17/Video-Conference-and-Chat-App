import React, { useState, useEffect } from 'react';
import { RTCView, mediaDevices } from 'react-native-webrtc';
import Peer from 'simple-peer';

const Room = (props) => {
    const [localStream, setLocalStream] = useState()

    useEffect(() => {
        startLocalStream()
    }, [])

    const startLocalStream = async () => {
        const isFront = true;
        const devices = await mediaDevices.enumerateDevices();
        const facing = isFront ? 'front' : 'environment';
        const videoSourceId = devices.find(device => device.kind === 'videoinput' && device.facing === facing);
        const facingMode = isFront ? 'user' : 'environment';
        const constraints = {
            audio: true,
            video: {
                mandatory: {
                    minWidth: 500,
                    minHeight: 300,
                    minFrameRate: 30,
                },
                facingMode,
                optional: videoSourceId ? [{sourceId: videoSourceId}] : [],
            },
        };
        const newStream = await mediaDevices.getUserMedia(constraints);
        setLocalStream(newStream);
        console.log(newStream)
    };

    return (
        <>
            {localStream && <RTCView style={{width: '50%', height: "50%"}} streamURL={localStream.toURL()} />}
        </>
    )
}

export default Room