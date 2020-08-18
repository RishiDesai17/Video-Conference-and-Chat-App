import React, { useCallback } from 'react';
import useStore from '../zustand/store';
import shallow from 'zustand/shallow'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../screens/Login';
import Home from '../screens/Home';
import Room from '../screens/Room';
import Chat from '../screens/Chat';

const Stack = createStackNavigator()

const Navigator = () => {
    const { isLoggedIn, inMeet } = useStore(useCallback(state => ({ isLoggedIn: state.isLoggedIn, inMeet: state.inMeet }), []), shallow)

    return(
        <NavigationContainer>
            <Stack.Navigator headerMode='none'>
                {isLoggedIn ?
                    <>
                        {inMeet ? 
                            <>
                                <Stack.Screen name="Room" component={Room} />
                                <Stack.Screen name="Chat" component={Chat} />
                            </>
                        :
                            <Stack.Screen name="Home" component={Home} />
                        }   
                    </>
                : 
                    <Stack.Screen name="Login" component={Login} />
                }
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default Navigator