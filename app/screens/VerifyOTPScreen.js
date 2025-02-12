import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";

const VerifyOTPScreen = ({ navigation, route }) => {
    const { email } = route.params;
    const [otp, setOtp] = useState("");

    const handleVerifyOTP = async () => {
        try {
                navigation.navigate("ResetPasswordScreen", { email });
        } catch (error) {
            Alert.alert("Error", error.message);
        }
    };

    return (
        <View className="flex-1 justify-center bg-white px-6">
            <Text className="text-2xl font-bold text-gray-800 mb-4">Enter OTP</Text>
            <Text className="text-gray-600 mb-4">Check your email for the OTP.</Text>

            <TextInput
                className="w-full p-3 bg-gray-100 rounded-2xl mb-3"
                placeholder="Enter OTP"
                value={otp}
                onChangeText={setOtp}
                keyboardType="numeric"
            />

            <TouchableOpacity className="bg-black py-3 rounded-lg w-full items-center" onPress={handleVerifyOTP}>
                <Text className="text-white text-lg font-semibold">Verify OTP</Text>
            </TouchableOpacity>
        </View>
    );
};

export default VerifyOTPScreen;
