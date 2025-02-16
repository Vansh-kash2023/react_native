import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Keyboard, TouchableWithoutFeedback, Alert } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async () => {
        Keyboard.dismiss(); // Close keyboard when login button is pressed
        setError(""); // Clear previous errors

        if (!email.trim()) return setError("Please enter your email.");
        if (!password.trim()) return setError("Please enter your password.");

        try {
            const response = await axios.post("https://life-path-flask.onrender.com/login", {
                email,
                password
            });

            if (response.status === 200 && response.data.access_token) {
                await AsyncStorage.setItem("access_token", response.data.access_token);
                console.log(response.data.access_token);

                Alert.alert("Login Successful", "Welcome back!", [
                    { text: "OK", onPress: () => navigation.navigate("Home") }
                ]);
            } else {
                setError(response.data.message || "Login failed. Please try again.");
            }
        } catch (err) {
            setError(err.message || "Something went wrong. Please try again.");
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className="flex-1 justify-center bg-white px-6">
                <View className="w-full self-start">
                    <Text className="text-4xl font-bold text-gray-800 mb-6">Login</Text>
                </View>

                {error ? <Text className="text-red-500 mb-3">{error}</Text> : null}

                <View className="flex flex-col gap-2">
                    <Text className="font-bold text-lg">Email</Text>
                    <TextInput
                        className="w-full p-3 bg-gray-100 rounded-2xl mb-3"
                        placeholder="Enter your email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                    />
                </View>

                <View className="flex flex-col gap-2">
                    <Text className="font-bold text-lg">Password</Text>
                    <TextInput
                        className="w-full p-3 bg-gray-100 rounded-2xl mb-3"
                        placeholder="Enter your password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                </View>

                <TouchableOpacity
                    className="bg-black py-3 rounded-lg w-full items-center mb-4"
                    onPress={handleLogin}
                >
                    <Text className="text-white text-lg font-semibold">Login</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")} className="w-full flex items-center my-3">
                    <Text className="text-gray-600">Forgot Password?</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("Signup")} className="w-full flex items-center">
                    <Text className="text-gray-600">Don't have an account? <Text className="text-black font-semibold">Sign Up</Text></Text>
                </TouchableOpacity>
            </View>
        </TouchableWithoutFeedback>
    );
};

export default LoginScreen;
