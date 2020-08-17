import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../screens/Home';
import Room from '../screens/Room';
import Chat from '../screens/Chat';

const Stack = createStackNavigator()

const Navigator = () => {
    return(
        <NavigationContainer>
            <Stack.Navigator headerMode='none'>
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="Room" component={Room} />
                <Stack.Screen name="Chat" component={Chat} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default Navigator