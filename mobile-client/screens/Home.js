import React, { useState, useEffect } from 'react';
import { Button, Text } from 'react-native';
import useStore from '../zustand/store';

const Home = (props) => {
    const [state, setState] = useState()
    const { navigation } = props
    const inMeet = useStore(state => state.inMeet)
    const changeInMeet = useStore(state => state.changeInMeet)

    return (
        <>
            <Button title="Room" onPress={() => navigation.navigate("Room")} />
            <Text>{inMeet.toString()}</Text>
            <Button title="swap" onPress={changeInMeet} />
        </>
    )
}

export default Home