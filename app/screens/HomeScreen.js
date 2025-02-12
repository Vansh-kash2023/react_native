import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";

const HomeScreen = ({ navigation }) => {
    const handleLogout = async () => {
            navigation.replace("Login"); // Navigate to login after logout
    }

    return (
        <View className="flex-1 justify-center items-center bg-gray-100">
            <Text className="text-2xl font-bold text-gray-800 mb-6">Welcome to Home Screen</Text>

            <TouchableOpacity
                className="bg-red-500 py-3 px-6 rounded-lg w-3/4 items-center"
                onPress={handleLogout}
            >
                <Text className="text-white text-lg font-semibold">Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

export default HomeScreen;
