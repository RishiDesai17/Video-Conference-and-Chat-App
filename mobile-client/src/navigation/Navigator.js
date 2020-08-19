import React, { useCallback } from 'react';
import useStore from '../zustand/store';
import shallow from 'zustand/shallow'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../screens/Login';
import Home from '../screens/Home';
import Room from '../screens/Room';
import Room1 from '../screens/TestRoom1';
import Room2 from '../screens/TestRoom2';
import Room3 from '../screens/TestRoom3';
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
                                <Stack.Screen name="Room1" component={Room1} />
                                <Stack.Screen name="Room2" component={Room2} />
                                <Stack.Screen name="Room3" component={Room3} />
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