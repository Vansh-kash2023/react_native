import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";

const ForgotPasswordScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");

    const handleSendOTP = async () => {
        try {
                navigation.navigate("VerifyOTPScreen", { email });
        } catch (error) {
            Alert.alert("Error", error.message);
        }
    };

    return (
        <View className="flex-1 justify-center bg-white px-6">
            <Text className="text-2xl font-bold text-gray-800 mb-4">Forgot Password?</Text>
            <Text className="text-gray-600 mb-4">Enter your email to receive an OTP.</Text>

            <TextInput
                className="w-full p-3 bg-gray-100 rounded-2xl mb-3"
                placeholder="Enter Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />

            <TouchableOpacity className="bg-black py-3 rounded-lg w-full items-center" onPress={handleSendOTP}>
                <Text className="text-white text-lg font-semibold">Send OTP</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ForgotPasswordScreen;
