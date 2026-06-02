import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useTheme } from "../context/ThemeContext";

const ForgotPasswordScreen = ({ navigation }) => {
    const { colors, fontSizeMultiplier } = useTheme();
    const [email, setEmail] = useState("");

    const handleSendOTP = async () => {
        try {
                navigation.navigate("VerifyOTPScreen", { email });
        } catch (error) {
            Alert.alert("Error", error.message);
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', backgroundColor: colors.background, paddingHorizontal: 24 }}>
            <Text style={{ fontSize: 28 * fontSizeMultiplier, fontWeight: 'bold', color: colors.text, marginBottom: 16 }}>Forgot Password?</Text>
            <Text style={{ fontSize: 16 * fontSizeMultiplier, color: colors.textMuted, marginBottom: 24 }}>Enter your email to receive an OTP.</Text>

            <TextInput
                style={{ width: '100%', padding: 16, backgroundColor: colors.card, borderRadius: 16, color: colors.text, borderWidth: 1, borderColor: colors.border, marginBottom: 24 }}
                placeholder="Enter Email"
                placeholderTextColor={colors.textMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />

            <TouchableOpacity style={{ backgroundColor: colors.primary, paddingVertical: 16, borderRadius: 12, alignItems: 'center' }} onPress={handleSendOTP}>
                <Text style={{ color: colors.white, fontSize: 18 * fontSizeMultiplier, fontWeight: '600' }}>Send OTP</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ForgotPasswordScreen;
