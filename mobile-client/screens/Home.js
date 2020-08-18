import React, { useState, useEffect, useCallback } from 'react';
import { Button, Text, BackHandler } from 'react-native';
import useStore from '../zustand/store';
import shallow from 'zustand/shallow';
import BackPressUtil from "../utils/BackPressUtil";

const Home = (props) => {
    const [state, setState] = useState()
    const { inMeet, setMeetState } = useStore(useCallback(state => ({ inMeet: state.inMeet, setMeetState: state.setMeetState }), []), shallow)

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', BackPressUtil)
    }, [])

    return (
        <>
            <Text>{inMeet.toString()}</Text>
            <Button title="Meet" onPress={() => setMeetState(true)} />
        </>
    )
}

export default Home