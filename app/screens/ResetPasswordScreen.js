import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useTheme } from "../context/ThemeContext";

const ResetPasswordScreen = ({ navigation }) => {
    const { colors, fontSizeMultiplier } = useTheme();
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
        <View style={{ flex: 1, justifyContent: 'center', backgroundColor: colors.background, paddingHorizontal: 24 }}>
            <Text style={{ fontSize: 28 * fontSizeMultiplier, fontWeight: 'bold', color: colors.text, marginBottom: 16 }}>Reset Password</Text>
            <Text style={{ fontSize: 16 * fontSizeMultiplier, color: colors.textMuted, marginBottom: 24 }}>Enter your new password.</Text>

            <TextInput
                style={{ width: '100%', padding: 16, backgroundColor: colors.card, borderRadius: 16, color: colors.text, borderWidth: 1, borderColor: colors.border, marginBottom: 16 }}
                placeholder="New Password"
                placeholderTextColor={colors.textMuted}
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
            />
            <TextInput
                style={{ width: '100%', padding: 16, backgroundColor: colors.card, borderRadius: 16, color: colors.text, borderWidth: 1, borderColor: colors.border, marginBottom: 24 }}
                placeholder="Confirm Password"
                placeholderTextColor={colors.textMuted}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
            />

            <TouchableOpacity style={{ backgroundColor: colors.primary, paddingVertical: 16, borderRadius: 12, alignItems: 'center' }} onPress={handleResetPassword}>
                <Text style={{ color: colors.white, fontSize: 18 * fontSizeMultiplier, fontWeight: '600' }}>Reset Password</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ResetPasswordScreen;
