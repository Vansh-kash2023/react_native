import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { signup, getCurrentUser } from "../../services/authService";

const SignupScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const checkUser = async () => {
            try {
                const user = await getCurrentUser();
                if (user) navigation.replace("Home");
            } catch (err) {
                console.log("No active session, user can sign up.");
            }
        };
        checkUser();
    }, []);

    const handleSignup = async () => {
        if (!name.trim()) return setError("Please enter your name.");
        if (!email.trim()) return setError("Please enter your email.");
        if (!password.trim()) return setError("Please enter your password.");

        try {
            await signup(email, password, name);
            setMessage("Signup successful! Proceed to login.");
            setError(""); // Clear any previous errors
        } catch (err) {
            setError(err.message);
            setMessage(""); // Clear any previous success message
        }
    };

    return (
        <View className="flex-1 justify-center items-center bg-gray-100 px-6">
            <Text className="text-3xl font-bold text-gray-800 mb-6">Sign Up</Text>

            {message ? <Text className="text-green-500 mb-3">{message}</Text> : null}
            {error ? <Text className="text-red-500 mb-3">{error}</Text> : null}

            <TextInput
                className="w-full p-3 bg-white border border-gray-300 rounded-lg mb-3"
                placeholder="Name"
                value={name}
                onChangeText={setName}
            />
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
                className="bg-green-500 py-3 rounded-lg w-full items-center mb-4"
                onPress={handleSignup}
            >
                <Text className="text-white text-lg font-semibold">Sign Up</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text className="text-gray-600">Already have an account? <Text className="text-green-500 font-semibold">Login</Text></Text>
            </TouchableOpacity>
        </View>
    );
};

export default SignupScreen;
