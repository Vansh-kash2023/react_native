import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Keyboard, TouchableWithoutFeedback, Alert } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SignupScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [emergencyContact, setEmergencyContact] = useState("");
    const [error, setError] = useState("");

    const handleSignup = async () => {
        Keyboard.dismiss(); // Close the keyboard when button is pressed
        setError(""); // Clear previous errors

        if (!name.trim()) return setError("Please enter your name.");
        if (!email.trim()) return setError("Please enter your email.");
        if (!password.trim()) return setError("Please enter your password.");

        try {
            const response = await axios.post("https://life-path-flask.onrender.com/signup", {
                name,
                email,
                password,
                emergency_contact: emergencyContact
            });

            console.log("Signup Response:", response.data); // Log the API response
        
            if (response.status === 201) {
                // await AsyncStorage.setItem("access_token", response.data.access_token);

                Alert.alert("Signup Successful", "Your account has been created!", [
                    { text: "OK", onPress: () => navigation.navigate("Login") }
                ]);
            } else {
                setError(response.data.message || "Signup failed. Please try again.");
            }
        } catch (err) {
            console.error("Signup Error:", err);
            setError(err.message || "Something went wrong. Please try again.");
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className="flex-1 justify-center bg-white px-6">
                <Text className="text-4xl w-full self-start font-bold text-gray-800 mb-2">Sign Up</Text>

                {error ? <Text className="text-red-500 mb-3">{error}</Text> : null}
                <Text className="text-center m-4 mx-1">Please fill in the details below to create your account</Text>

                <View className="w-full flex flex-col gap-2">
                    <Text className="font-bold text-lg">Name</Text>
                    <TextInput
                        className="w-full p-3 bg-gray-100 rounded-2xl mb-3"
                        placeholder="Enter your name"
                        value={name}
                        onChangeText={setName}
                    />
                </View>

                <View className="w-full flex flex-col gap-2">
                    <Text className="font-bold text-lg">Email</Text>
                    <TextInput
                        className="w-full p-3 bg-gray-100 rounded-2xl mb-3"
                        placeholder="Enter your email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                    />
                </View>

                <View className="w-full flex flex-col gap-2">
                    <Text className="font-bold text-lg">Password</Text>
                    <TextInput
                        className="w-full p-3 bg-gray-100 rounded-2xl mb-3"
                        placeholder="Create a password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                </View>

                <View className="w-full flex flex-col gap-2">
                    <Text className="font-bold text-lg">Emergency Contact (optional)</Text>
                    <TextInput
                        className="w-full p-3 bg-gray-100 rounded-2xl mb-3"
                        placeholder="Enter emergency contact's number"
                        value={emergencyContact}
                        onChangeText={setEmergencyContact}
                        keyboardType="phone-pad"
                    />
                </View>

                <TouchableOpacity
                    className="bg-black py-3 rounded-lg w-full items-center mb-4"
                    onPress={handleSignup}
                >
                    <Text className="text-white text-lg font-semibold">Create Account</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("Login")} className="flex items-center">
                    <Text className="text-gray-600">Already have an account? <Text className="text-black font-semibold">Login</Text></Text>
                </TouchableOpacity>
            </View>
        </TouchableWithoutFeedback>
    );
};

export default SignupScreen;
