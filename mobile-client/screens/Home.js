import React, { useState, useEffect } from 'react';
import { Button } from 'react-native';

const Home = (props) => {
    const [state, setState] = useState()
    const { navigation } = props

    return (
        <>
            <Button title="Room" onPress={() => navigation.navigate("Room")} />
        </>
    )
}

export default Home