import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Switch, ActivityIndicator, Alert } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User, LogOut, Sun, Moon, Type, Minus, Plus, ChevronLeft } from "lucide-react-native";
import { API_BASE_URL } from "../config/api";
import { useTheme } from "../context/ThemeContext";

const ProfileScreen = ({ navigation }) => {
    const { colors, fontSizeMultiplier, isDarkMode, toggleTheme, changeFontSize } = useTheme();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const cachedProfile = await AsyncStorage.getItem("cached_profile");
                if (cachedProfile) {
                    setProfileData(JSON.parse(cachedProfile));
                    setLoading(false);
                }
                
                const token = await AsyncStorage.getItem("access_token");
                const response = await axios.get(`${API_BASE_URL}/profile`, {
                    headers: { "Authorization": `Bearer ${token}` },
                });
                
                setProfileData(response.data);
                await AsyncStorage.setItem("cached_profile", JSON.stringify(response.data));
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleLogout = async () => {
        Alert.alert("Logout", "Are you sure you want to log out?", [
            { text: "Cancel", style: "cancel" },
            { 
                text: "Logout", 
                style: "destructive", 
                onPress: async () => {
                    await AsyncStorage.removeItem("access_token");
                    navigation.replace("Login");
                } 
            }
        ]);
    };

    const handleFontSizeChange = (increment) => {
        const newSize = increment ? fontSizeMultiplier + 0.1 : fontSizeMultiplier - 0.1;
        if (newSize >= 0.8 && newSize <= 1.5) {
            changeFontSize(parseFloat(newSize.toFixed(1)));
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingTop: 60, paddingBottom: 16, borderBottomWidth: 1, borderColor: colors.border, backgroundColor: colors.background }}>
                <TouchableOpacity 
                    style={{ padding: 8, backgroundColor: colors.card, borderRadius: 20, borderWidth: 1, borderColor: colors.border, marginRight: 16 }} 
                    onPress={() => navigation.goBack()}
                >
                    <ChevronLeft size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={{ fontSize: 28 * fontSizeMultiplier, fontWeight: 'bold', color: colors.text, flex: 1 }}>
                    Profile
                </Text>
            </View>
            <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 24, paddingBottom: 100 }}>

                {/* Profile Section */}
                <View style={{ backgroundColor: colors.card, padding: 20, borderRadius: 16, marginBottom: 24, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 3, borderColor: colors.border, borderWidth: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                        <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: colors.primaryLight, justifyContent: 'center', alignItems: 'center', marginRight: 16 }}>
                            <User size={24} color={colors.primaryDark} />
                        </View>
                        <View>
                            <Text style={{ fontSize: 20 * fontSizeMultiplier, fontWeight: 'bold', color: colors.text }}>
                                {profileData?.name || "Patient Profile"}
                            </Text>
                        </View>
                    </View>
                    
                    <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 12 }} />
                    
                    <View>
                        <Text style={{ fontSize: 14 * fontSizeMultiplier, color: colors.textMuted, marginBottom: 4 }}>Emergency Contact</Text>
                        <Text style={{ fontSize: 16 * fontSizeMultiplier, fontWeight: '600', color: colors.text }}>
                            {profileData?.emergency_contact || "Not Set"}
                        </Text>
                    </View>
                </View>

                {/* Settings Section */}
                <Text style={{ fontSize: 24 * fontSizeMultiplier, fontWeight: 'bold', color: colors.text, mb: 16, marginBottom: 16 }}>
                    Settings
                </Text>

                <View style={{ backgroundColor: colors.card, borderRadius: 16, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 3, borderColor: colors.border, borderWidth: 1, marginBottom: 24 }}>
                    
                    {/* Dark Mode Toggle */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            {isDarkMode ? <Moon size={24} color={colors.primary} /> : <Sun size={24} color={colors.primary} />}
                            <Text style={{ fontSize: 18 * fontSizeMultiplier, fontWeight: '500', color: colors.text, marginLeft: 16 }}>
                                Dark Mode
                            </Text>
                        </View>
                        <Switch
                            value={isDarkMode}
                            onValueChange={toggleTheme}
                            trackColor={{ false: colors.border, true: colors.primary }}
                            thumbColor={colors.white}
                        />
                    </View>

                    <View style={{ height: 1, backgroundColor: colors.border }} />

                    {/* Font Size Adjust */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Type size={24} color={colors.primary} />
                            <Text style={{ fontSize: 18 * fontSizeMultiplier, fontWeight: '500', color: colors.text, marginLeft: 16 }}>
                                Text Size
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.background, borderRadius: 20, padding: 4 }}>
                            <TouchableOpacity style={{ padding: 8, borderRadius: 16, backgroundColor: colors.card }} onPress={() => handleFontSizeChange(false)}>
                                <Minus size={20} color={colors.text} />
                            </TouchableOpacity>
                            <Text style={{ marginHorizontal: 16, fontSize: 18, fontWeight: 'bold', color: colors.text }}>
                                {Math.round(fontSizeMultiplier * 100)}%
                            </Text>
                            <TouchableOpacity style={{ padding: 8, borderRadius: 16, backgroundColor: colors.card }} onPress={() => handleFontSizeChange(true)}>
                                <Plus size={20} color={colors.text} />
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>

                {/* Logout Button */}
                <TouchableOpacity 
                    style={{ backgroundColor: colors.danger, padding: 16, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
                    onPress={handleLogout}
                >
                    <LogOut size={20} color={colors.white} style={{ marginRight: 8 }} />
                    <Text style={{ color: colors.white, fontWeight: 'bold', fontSize: 18 * fontSizeMultiplier }}>
                        Logout
                    </Text>
                </TouchableOpacity>

            </ScrollView>
        </View>
    );
};

export default ProfileScreen;
