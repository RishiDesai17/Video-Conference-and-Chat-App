import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button, Text, BackHandler, TextInput } from 'react-native';
import useStore from '../zustand/store';
import shallow from 'zustand/shallow';
import { v4 as uuid } from 'uuid';
import ExitAppUtil from "../utils/ExitAppUtil";

const Home = (props) => {
    const [state, setState] = useState()
    const [roomID, setRoomID] = useState()
    const { inMeet, setMeetState } = useStore(useCallback(state => ({ inMeet: state.inMeet, setMeetState: state.setMeetState }), []), shallow)

    useEffect(() => {
        console.log("Home")
        const exitApp = BackHandler.addEventListener('hardwareBackPress', ExitAppUtil)
        return () => {
            exitApp.remove()
        }
    }, [])

    const createRoom = () => {
        const roomID = uuid()
        setMeetState({ inMeet: true, roomID, host: true })
    }

    const joinRoom = () => {
        //here room existence will be checked first
        setMeetState({ inMeet: true, roomID, host: false })
    }

    return (
        <>
            <Text>{inMeet.toString()}</Text>
            {/* <Button title="Meet" onPress={() => setMeetState(true, roomID)} /> */}
            <Button title="create room" onPress={createRoom} />
            <Text>OR</Text>
            <TextInput onChangeText={val => setRoomID(val)} />
        </>
    )
}

export default Home