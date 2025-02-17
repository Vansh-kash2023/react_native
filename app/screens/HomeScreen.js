import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Linking } from "react-native";
import { Bot, Home, Info, User } from "lucide-react-native"; // Import icons
import axios from "axios"; // Import axios
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomeScreen = ({ navigation }) => {
    const [emergencyContact, setEmergencyContact] = useState(null);

    // Fetch emergency contact on component mount
    useEffect(() => {
        const fetchEmergencyContact = async () => {
            try {
                const token = await AsyncStorage.getItem("access_token"); // Replace with actual access token

                const response = await axios.get("https://life-path-flask.onrender.com/profile", {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        
                    },
                });

                setEmergencyContact(response.data.emergency_contact); // Assuming the response has an emergency_contact field
            } catch (error) {
                console.error("Error fetching emergency contact:", error);
            }
        };

        fetchEmergencyContact();
    }, []);

    const handleLogout = async () => {
        navigation.replace("Login"); // Navigate to login after logout
    };

    const handleEmergencySOS = () => {
        if (emergencyContact) {
            Linking.openURL(`tel:${emergencyContact}`); // Opens the phone dialer with the fetched phone number
        } else {
            console.log("Emergency contact not available.");
        }
    };

    return (
        <View className="bg-white flex-1 items-center justify-start pt-12 px-6">
            <Text className="text-3xl font-bold text-black text-center mb-8">
                Dementia Support App
            </Text>

            <View className="w-11/12 space-y-4">
                <TouchableOpacity className="bg-black w-full p-4 rounded-lg" onPress={() => navigation.navigate("Timeline")}>
                    <Text className="text-white text-center">Interactive Life Timeline</Text>
                </TouchableOpacity>
                <TouchableOpacity className="bg-black w-full p-4 rounded-lg" onPress={() => navigation.navigate("RoutineReminder")}>
                    <Text className="text-white text-center">Routine Reminders</Text>
                </TouchableOpacity>
                <TouchableOpacity className="bg-black w-full p-4 rounded-lg" onPress={() => navigation.navigate("Faces")}>
                    <Text className="text-white text-center">Familiar Faces</Text>
                </TouchableOpacity>
                <TouchableOpacity className="bg-black w-full p-4 rounded-lg" onPress={() => navigation.navigate("CognitiveAssessment")}>
                    <Text className="text-white text-center" >Cognitive Assessment</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleEmergencySOS} className="bg-red-500 w-full p-4 rounded-lg">
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
                
                <TouchableOpacity className="items-center" onPress={() => navigation.navigate("Chatbot")}>
                    <Bot size={20} color="gray" />
                    <Text className="text-gray-600">Chatbot</Text>
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
