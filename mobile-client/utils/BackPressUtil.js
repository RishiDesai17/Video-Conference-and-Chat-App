import { BackHandler, Alert } from 'react-native';

const handleBackPress = () => {
    Alert.alert(
        "Exit App",
        "Do you really want to quit",
        [
            {
                text: "Yes",
                onPress: () => BackHandler.exitApp(),
                style: "cancel"
            },
            { 
                text: "No", 
                onPress: () => console.log("OK Pressed") 
            }
        ],
            { cancelable: false }
        );
    return true
}

export default handleBackPress