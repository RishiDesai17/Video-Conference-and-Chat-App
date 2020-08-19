import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button, BackHandler, Alert } from 'react-native';
import { RTCView, mediaDevices } from 'react-native-webrtc';
import useStore from '../zustand/store';
import shallow from 'zustand/shallow';
import io from 'socket.io-client';
import Peer from 'simple-peer';

const Room = (props) => {
    const [localStream, setLocalStream] = useState()
    const { navigation } = props
    const socket = useRef()
    const { setMeetState, roomID, host } = useStore(useCallback(state => ({ setMeetState: state.setMeetState, roomID: state.roomID, host: state.host }), []), shallow)

    useEffect(() => {
        socket.current = io.connect("http://192.168.43.53:3001/")
        initSocket()
        startLocalStream()
        // BackHandler.addEventListener('hardwareBackPress', leaveMeetHandler)
    }, [])

    const initSocket = () =>  {
        // if(host){
        //     socket.current.emit("start meet", roomID)
        // }
        // else{
            socket.current.emit("join room", roomID)
        // }
        socket.current.on("room full", () => {
            console.log("room full")
            setMeetState({ inMeet: false, roomID: null, host: null })
        })
        socket.current.on("invalid room", () => {
            console.log("invalid room")
            setMeetState({ inMeet: false, roomID: null, host: null })
        })
        socket.current.on("all users", (users) => {
            console.log(users)
        })
    }

    const leaveMeetHandler = () => {
        if(!navigation.isFocused()){
            return false
        }
        console.log("here")
        Alert.alert(
            "Exit Meet",
            "Do you really want to leave the meeting?",
            [
                {
                    text: "Yes",
                    onPress: disconnect,
                    style: "cancel"
                },
                { 
                    text: "No"
                }
            ],
            { cancelable: false }
        );
        return true
    }

    const disconnect = () => {
        socket.current.disconnect()
        setMeetState({ inMeet: false, roomID: null, host: null })
    }

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
            <Button title="Chat" onPress={() => {
                navigation.navigate("Chat")
                // leaveMeetRef.current.remove()
            }} />
        </>
    )
}

export default Room
