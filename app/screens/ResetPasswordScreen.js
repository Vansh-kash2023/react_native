import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";

const ResetPasswordScreen = ({ navigation }) => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleResetPassword = async () => {
        if (newPassword !== confirmPassword) {
            return Alert.alert("Error", "Passwords do not match.");
        }

        try {
            
                Alert.alert("Success");
                navigation.navigate("Login");
            
        } catch (error) {
            Alert.alert("Error", error.message);
        }
    };

    return (
        <View className="flex-1 justify-center bg-white px-6">
            <Text className="text-2xl font-bold text-gray-800 mb-4">Reset Password</Text>
            <Text className="text-gray-600 mb-4">Enter your new password.</Text>

            <TextInput
                className="w-full p-3 bg-gray-100 rounded-2xl mb-3"
                placeholder="New Password"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
            />
            <TextInput
                className="w-full p-3 bg-gray-100 rounded-2xl mb-3"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
            />

            <TouchableOpacity className="bg-black py-3 rounded-lg w-full items-center" onPress={handleResetPassword}>
                <Text className="text-white text-lg font-semibold">Reset Password</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ResetPasswordScreen;
