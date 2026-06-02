import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Keyboard, TouchableWithoutFeedback, Alert, ActivityIndicator } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../config/api";
import { useTheme } from "../context/ThemeContext";

const SignupScreen = ({ navigation }) => {
    const { colors, fontSizeMultiplier } = useTheme();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [emergencyContact, setEmergencyContact] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignup = async () => {
        Keyboard.dismiss(); 
        setError(""); 
        setLoading(true); 

        if (!name.trim()) return setError("Please enter your name.");
        if (!email.trim()) return setError("Please enter your email.");
        if (!password.trim()) return setError("Please enter your password.");

        try {
            const response = await axios.post(`${API_BASE_URL}/signup`, {
                name,
                email,
                password,
                emergency_contact: emergencyContact
            });
        
            if (response.status === 201) {
                Alert.alert("Signup Successful", "Your account has been created!", [
                    { text: "OK", onPress: () => navigation.navigate("Login") }
                ]);
            } else {
                setError(response.data.message || "Signup failed. Please try again.");
            }
        } catch (err) {
            console.error("Signup Error:", err);
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false); 
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ flex: 1, justifyContent: 'center', backgroundColor: colors.background, paddingHorizontal: 24 }}>
                <Text style={{ fontSize: 36 * fontSizeMultiplier, fontWeight: 'bold', color: colors.text, marginBottom: 8 }}>Sign Up</Text>

                {error ? <Text style={{ color: colors.danger, marginBottom: 12 }}>{error}</Text> : null}
                <Text style={{ textAlign: 'left', color: colors.textMuted, marginBottom: 24, fontSize: 16 * fontSizeMultiplier }}>Please fill in the details below to create your account</Text>

                <View style={{ marginBottom: 16 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 18 * fontSizeMultiplier, color: colors.text, marginBottom: 8 }}>Name</Text>
                    <TextInput
                        style={{ width: '100%', padding: 16, backgroundColor: colors.card, borderRadius: 16, color: colors.text, borderWidth: 1, borderColor: colors.border }}
                        placeholder="Enter your name"
                        placeholderTextColor={colors.textMuted}
                        value={name}
                        onChangeText={setName}
                    />
                </View>

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

                <View style={{ marginBottom: 16 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 18 * fontSizeMultiplier, color: colors.text, marginBottom: 8 }}>Password</Text>
                    <TextInput
                        style={{ width: '100%', padding: 16, backgroundColor: colors.card, borderRadius: 16, color: colors.text, borderWidth: 1, borderColor: colors.border }}
                        placeholder="Create a password"
                        placeholderTextColor={colors.textMuted}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                </View>

                <View style={{ marginBottom: 24 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 18 * fontSizeMultiplier, color: colors.text, marginBottom: 8 }}>Emergency Contact</Text>
                    <TextInput
                        style={{ width: '100%', padding: 16, backgroundColor: colors.card, borderRadius: 16, color: colors.text, borderWidth: 1, borderColor: colors.border }}
                        placeholder="Enter emergency contact's number"
                        placeholderTextColor={colors.textMuted}
                        value={emergencyContact}
                        onChangeText={setEmergencyContact}
                        keyboardType="phone-pad"
                    />
                </View>

                <TouchableOpacity
                    style={{ backgroundColor: colors.primary, paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginBottom: 24, opacity: loading ? 0.7 : 1 }}
                    onPress={handleSignup}
                    disabled={loading} 
                >
                    {loading ? (
                        <ActivityIndicator size="small" color={colors.white} />
                    ) : (
                        <Text style={{ color: colors.white, fontSize: 18 * fontSizeMultiplier, fontWeight: '600' }}>Create Account</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("Login")} style={{ alignItems: 'center' }}>
                    <Text style={{ color: colors.textMuted, fontSize: 16 * fontSizeMultiplier }}>
                        Already have an account? <Text style={{ color: colors.text, fontWeight: '600' }}>Login</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </TouchableWithoutFeedback>
    );
};

export default SignupScreen;
