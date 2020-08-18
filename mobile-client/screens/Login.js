import React, { useState, useEffect, useCallback } from 'react';
import useStore from '../zustand/store';
import shallow from 'zustand/shallow'
import { Text, Button } from 'react-native';

const Login = (props) => {
    const [state, setState] = useState()
    const setLoginState = useStore(useCallback(state => state.setLoginState, []), shallow)

    return (
        <>
            <Button title="Log in" onPress={() => setLoginState(true)} />
        </>
    )
}

export default Login