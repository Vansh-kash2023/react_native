import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Home, Info, User } from "lucide-react-native"; // Import icons

const HomeScreen = ({ navigation }) => {
    const handleLogout = async () => {
        navigation.replace("Login"); // Navigate to login after logout
    };

    return (
        <View className="bg-white flex-1 items-center justify-start pt-12 px-6">
            <Text className="text-3xl font-bold text-black text-center mb-8">
                Dementia Support App
            </Text>

            <View className="w-11/12 space-y-4">
                <TouchableOpacity className="bg-black w-full p-4 rounded-lg">
                    <Text className="text-white text-center">Interactive Life Timeline</Text>
                </TouchableOpacity>
                <TouchableOpacity className="bg-black w-full p-4 rounded-lg">
                    <Text className="text-white text-center">Routine Reminders</Text>
                </TouchableOpacity>
                <TouchableOpacity className="bg-black w-full p-4 rounded-lg">
                    <Text className="text-white text-center">Familiar Faces</Text>
                </TouchableOpacity>
                <TouchableOpacity className="bg-black w-full p-4 rounded-lg">
                    <Text className="text-white text-center">Cognitive Assessment</Text>
                </TouchableOpacity>
                <TouchableOpacity className="bg-black w-full p-4 rounded-lg">
                    <Text className="text-white text-center">Emergency SOS</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleLogout} className="bg-black w-full p-4 rounded">
                    <Text className="text-white text-center">Logout</Text>
                </TouchableOpacity>
            </View>

            {/* Bottom Navigation Bar */}
            <View className="absolute bottom-4 w-full flex-row justify-around bg-white py-4 border-t border-gray-300">
                <TouchableOpacity className="items-center">
                    <Home size={20} color="black" fill="black" /> 
                    <Text className="text-black font-bold">Home</Text>
                </TouchableOpacity>
                
                <TouchableOpacity className="items-center" onPress={() => navigation.navigate("Resources")}>
                    <Info size={20} color="gray" />
                    <Text className="text-gray-600">Resources</Text>
                </TouchableOpacity>
                
                <TouchableOpacity className="items-center" onPress={() => navigation.navigate("Profile")}>
                    <User size={20} color="gray" />
                    <Text className="text-gray-600">Profile</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default HomeScreen;
