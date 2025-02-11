import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Keyboard, TouchableWithoutFeedback } from "react-native";
import { sendPasswordResetEmail } from "../../services/authService";

const ForgotPasswordScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handlePasswordReset = async () => {
        Keyboard.dismiss();
        if (!email.trim()) return setError("Please enter your email.");

        try {
            const response = await sendPasswordResetEmail(email);
            setMessage(response);
            setError(""); 
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className="flex-1 justify-center bg-white px-6">
                <Text className="text-4xl font-bold text-gray-800 mb-6">Forgot Password</Text>

                {error ? <Text className="text-red-500 mb-3">{error}</Text> : null}
                {message ? <Text className="text-green-500 mb-3">{message}</Text> : null}

                <Text className="font-bold text-lg">Email</Text>
                <TextInput
                    className="w-full p-3 bg-gray-100 rounded-2xl mb-3"
                    placeholder="Enter your email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />

                <TouchableOpacity
                    className="bg-black py-3 rounded-lg w-full items-center mb-4"
                    onPress={handlePasswordReset}
                >
                    <Text className="text-white text-lg font-semibold">Reset Password</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.goBack()} className="w-full flex items-center">
                    <Text className="text-gray-600">Back to <Text className="text-black font-semibold">Login</Text></Text>
                </TouchableOpacity>
            </View>
        </TouchableWithoutFeedback>
    );
};

export default ForgotPasswordScreen;
