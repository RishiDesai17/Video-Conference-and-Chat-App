import { BackHandler, Alert } from 'react-native';

const ExitAppUtil = () => {
    Alert.alert(
        "Exit App",
        "Do you really want to quit?",
        [
            {
                text: "Yes",
                onPress: () => BackHandler.exitApp(),
                style: "cancel"
            },
            { 
                text: "No"
            }
        ],
        { cancelable: false }
    );
    return true
}

export default ExitAppUtil