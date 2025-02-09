import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { login, getCurrentUser, logout } from "../../services/authService";

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        // Check if user is already logged in
        const checkUser = async () => {
            try {
                const user = await getCurrentUser(); 
                if (user) navigation.replace("Home"); // Redirect if logged in
            } catch (err) {
                console.log("No active session, proceed to login.");
            }
        };
        checkUser();
    }, []);

    const handleLogin = async () => {
        if (!email.trim()) return setError("Please enter your email.");
        if (!password.trim()) return setError("Please enter your password.");

        try {
            await logout(); // Ensure no active session before logging in
            await login(email, password);
            navigation.replace("Home");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <View className="flex-1 justify-center items-center bg-gray-100 px-6">
            <Text className="text-3xl font-bold text-gray-800 mb-6">Login</Text>

            {error ? <Text className="text-red-500 mb-3">{error}</Text> : null}

            <TextInput
                className="w-full p-3 bg-white border border-gray-300 rounded-lg mb-3"
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />
            <TextInput
                className="w-full p-3 bg-white border border-gray-300 rounded-lg mb-3"
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <TouchableOpacity
                className="bg-blue-500 py-3 rounded-lg w-full items-center mb-4"
                onPress={handleLogin}
            >
                <Text className="text-white text-lg font-semibold">Login</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                <Text className="text-gray-600">Don't have an account? <Text className="text-blue-500 font-semibold">Sign Up</Text></Text>
            </TouchableOpacity>
        </View>
    );
};

export default LoginScreen;
