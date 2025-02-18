import { useEffect } from "react";
import { View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";

const SplashScreen = () => {
    const navigation = useNavigation();

    useEffect(() => {
        setTimeout(() => {
            navigation.replace("Login"); // Replace Splash with Login after 1 sec
        }, 2000);
    }, []);

    return (
        <View className="flex-1 bg-white justify-center items-center">
            <View className="flex items-center gap-2 flex-col">
                <Text className="text-3xl font-bold text-black">Dementia Support App</Text>
                <Text className="text-md text-gray-500">Life Path Solutions</Text>
            </View>
        </View>
    );
};

export default SplashScreen;
