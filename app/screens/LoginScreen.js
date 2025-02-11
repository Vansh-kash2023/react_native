import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Keyboard, TouchableWithoutFeedback } from "react-native";
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
        Keyboard.dismiss(); // Close keyboard when login button is pressed

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
