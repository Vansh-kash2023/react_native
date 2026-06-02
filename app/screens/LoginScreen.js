import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Keyboard, TouchableWithoutFeedback, Alert, ActivityIndicator } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../config/api";
import { useTheme } from "../context/ThemeContext";
import Toast from 'react-native-toast-message';

const LoginScreen = ({ navigation }) => {
    const { colors, fontSizeMultiplier } = useTheme();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (loading) return; 
        Keyboard.dismiss();
        setError("");

        if (!email.trim()) return setError("Please enter your email.");
        if (!password.trim()) return setError("Please enter your password.");

        setLoading(true); 

        try {
            const response = await axios.post(`${API_BASE_URL}/login`, {
                email,
                password
            });

            if (response.status === 200 && response.data.access_token) {
                await AsyncStorage.setItem("access_token", response.data.access_token);

                Toast.show({
                    type: 'success',
                    text1: 'Login Successful',
                    text2: 'Welcome back!',
                    position: 'top',
                });
                navigation.navigate("Home");
            } else {
                setError(response.data.message || "Login failed. Please try again.");
            }
        } catch (err) {
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false); 
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ flex: 1, justifyContent: 'center', backgroundColor: colors.background, paddingHorizontal: 24 }}>
                <View style={{ width: '100%', alignSelf: 'flex-start' }}>
                    <Text style={{ fontSize: 36 * fontSizeMultiplier, fontWeight: 'bold', color: colors.text, marginBottom: 24 }}>Login</Text>
                </View>

                {error ? <Text style={{ color: colors.danger, marginBottom: 12 }}>{error}</Text> : null}

                <View style={{ marginBottom: 16 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 18 * fontSizeMultiplier, color: colors.text, marginBottom: 8 }}>Email</Text>
                    <TextInput
                        style={{ width: '100%', padding: 16, backgroundColor: colors.card, borderRadius: 16, color: colors.text, borderWidth: 1, borderColor: colors.border }}
                        placeholder="Enter your email"
                        placeholderTextColor={colors.textMuted}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                    />
                </View>

                <View style={{ marginBottom: 24 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 18 * fontSizeMultiplier, color: colors.text, marginBottom: 8 }}>Password</Text>
                    <TextInput
                        style={{ width: '100%', padding: 16, backgroundColor: colors.card, borderRadius: 16, color: colors.text, borderWidth: 1, borderColor: colors.border }}
                        placeholder="Enter your password"
                        placeholderTextColor={colors.textMuted}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                </View>

                <TouchableOpacity
                    style={{ backgroundColor: colors.primary, paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginBottom: 16, opacity: loading ? 0.7 : 1 }}
                    onPress={handleLogin}
                    disabled={loading} 
                >
                    {loading ? (
                        <ActivityIndicator size="small" color={colors.white} />
                    ) : (
                        <Text style={{ color: colors.white, fontSize: 18 * fontSizeMultiplier, fontWeight: '600' }}>Login</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")} style={{ width: '100%', alignItems: 'center', marginVertical: 12 }}>
                    <Text style={{ color: colors.textMuted, fontSize: 16 * fontSizeMultiplier }}>Forgot Password?</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("Signup")} style={{ width: '100%', alignItems: 'center' }}>
                    <Text style={{ color: colors.textMuted, fontSize: 16 * fontSizeMultiplier }}>
                        Don't have an account? <Text style={{ color: colors.text, fontWeight: '600' }}>Sign Up</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </TouchableWithoutFeedback>
    );
};

export default LoginScreen;
