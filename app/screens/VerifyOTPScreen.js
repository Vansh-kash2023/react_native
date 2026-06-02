import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useTheme } from "../context/ThemeContext";

const VerifyOTPScreen = ({ navigation, route }) => {
    const { colors, fontSizeMultiplier } = useTheme();
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
        <View style={{ flex: 1, justifyContent: 'center', backgroundColor: colors.background, paddingHorizontal: 24 }}>
            <Text style={{ fontSize: 28 * fontSizeMultiplier, fontWeight: 'bold', color: colors.text, marginBottom: 16 }}>Enter OTP</Text>
            <Text style={{ fontSize: 16 * fontSizeMultiplier, color: colors.textMuted, marginBottom: 24 }}>Check your email for the OTP.</Text>

            <TextInput
                style={{ width: '100%', padding: 16, backgroundColor: colors.card, borderRadius: 16, color: colors.text, borderWidth: 1, borderColor: colors.border, marginBottom: 24 }}
                placeholder="Enter OTP"
                placeholderTextColor={colors.textMuted}
                value={otp}
                onChangeText={setOtp}
                keyboardType="numeric"
            />

            <TouchableOpacity style={{ backgroundColor: colors.primary, paddingVertical: 16, borderRadius: 12, alignItems: 'center' }} onPress={handleVerifyOTP}>
                <Text style={{ color: colors.white, fontSize: 18 * fontSizeMultiplier, fontWeight: '600' }}>Verify OTP</Text>
            </TouchableOpacity>
        </View>
    );
};

export default VerifyOTPScreen;
