import React, { useState, useEffect, useCallback } from 'react';
import useStore from '../zustand/store';
import shallow from 'zustand/shallow'
import { Text, Button, BackHandler } from 'react-native';
import BackPressUtil from "../utils/BackPressUtil";

const Login = (props) => {
    const [state, setState] = useState()
    const setLoginState = useStore(useCallback(state => state.setLoginState, []), shallow)

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', BackPressUtil)
    }, [])

    return (
        <>
            <Button title="Log in" onPress={() => setLoginState(true)} />
        </>
    )
}

export default Login