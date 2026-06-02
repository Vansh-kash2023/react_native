import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Linking, ScrollView, Dimensions } from "react-native";
import { Bot, Home, User, Clock, Users, Brain, PhoneCall, CalendarHeart } from "lucide-react-native"; 
import axios from "axios"; 
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../config/api";
import { useTheme } from "../context/ThemeContext";
import Toast from 'react-native-toast-message';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
    const [emergencyContact, setEmergencyContact] = useState(null);
    const { colors, fontSizeMultiplier, loading } = useTheme();

    useEffect(() => {
        const fetchEmergencyContact = async () => {
            try {
                const token = await AsyncStorage.getItem("access_token"); 
                const response = await axios.get(`${API_BASE_URL}/profile`, {
                    headers: { "Authorization": `Bearer ${token}` },
                });
                setEmergencyContact(response.data.emergency_contact); 
            } catch (error) {
                console.error("Error fetching emergency contact:", error);
            }
        };
        fetchEmergencyContact();
    }, []);

    const handleAssessmentNavigation = async () => {
        try {
            const token = await AsyncStorage.getItem("access_token");
            const res = await axios.get(`${API_BASE_URL}/faces`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data && res.data.length >= 3) {
                navigation.navigate("CognitiveAssessment");
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Requirements Not Met',
                    text2: 'Please add at least 3 familiar faces before unlocking Cognitive Assessments.',
                    position: 'top',
                    visibilityTime: 4000
                });
            }
        } catch (error) {
            console.error("Error fetching faces count:", error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Could not verify requirements. Please check your connection.',
                position: 'top'
            });
        }
    };

    const handleEmergencySOS = () => {
        if (emergencyContact) {
            Linking.openURL(`tel:${emergencyContact}`); 
        } else {
            console.log("Emergency contact not available.");
        }
    };

    if (loading) return null;

    const tileWidth = (width - 48 - 16) / 2; // screen width minus padding (24 left + 24 right = 48) minus gap (16) divided by 2

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <ScrollView contentContainerStyle={{ paddingBottom: 100, paddingTop: 60, paddingHorizontal: 24 }}>
                <Text style={{ fontSize: 28 * fontSizeMultiplier, fontWeight: 'bold', color: colors.text, textAlign: 'center', marginBottom: 32 }}>
                    Dementia Support App
                </Text>

                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 16 }}>
                    
                    {/* Tile 1 */}
                    <TouchableOpacity 
                        style={{ width: tileWidth, height: tileWidth, backgroundColor: colors.primary, borderRadius: 16, padding: 16, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 }} 
                        onPress={() => navigation.navigate("Timeline")}
                    >
                        <CalendarHeart size={36} color={colors.white} style={{ marginBottom: 12 }} />
                        <Text style={{ color: colors.white, fontWeight: '600', fontSize: 16 * fontSizeMultiplier, textAlign: 'center' }}>Life Timeline</Text>
                    </TouchableOpacity>

                    {/* Tile 2 */}
                    <TouchableOpacity 
                        style={{ width: tileWidth, height: tileWidth, backgroundColor: colors.primary, borderRadius: 16, padding: 16, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 }} 
                        onPress={() => navigation.navigate("RoutineReminder")}
                    >
                        <Clock size={36} color={colors.white} style={{ marginBottom: 12 }} />
                        <Text style={{ color: colors.white, fontWeight: '600', fontSize: 16 * fontSizeMultiplier, textAlign: 'center' }}>Routine Reminders</Text>
                    </TouchableOpacity>

                    {/* Tile 3 */}
                    <TouchableOpacity 
                        style={{ width: tileWidth, height: tileWidth, backgroundColor: colors.primary, borderRadius: 16, padding: 16, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 }} 
                        onPress={() => navigation.navigate("Faces")}
                    >
                        <Users size={36} color={colors.white} style={{ marginBottom: 12 }} />
                        <Text style={{ color: colors.white, fontWeight: '600', fontSize: 16 * fontSizeMultiplier, textAlign: 'center' }}>Familiar Faces</Text>
                    </TouchableOpacity>

                    {/* Tile 4 */}
                    <TouchableOpacity 
                        style={{ width: tileWidth, height: tileWidth, backgroundColor: colors.primary, borderRadius: 16, padding: 16, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 }} 
                        onPress={handleAssessmentNavigation}
                    >
                        <Brain size={36} color={colors.white} style={{ marginBottom: 12 }} />
                        <Text style={{ color: colors.white, fontWeight: '600', fontSize: 16 * fontSizeMultiplier, textAlign: 'center' }}>Assessment</Text>
                    </TouchableOpacity>

                    {/* Emergency Tile */}
                    <TouchableOpacity 
                        style={{ width: '100%', height: 80, backgroundColor: colors.danger, borderRadius: 16, padding: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5, marginTop: 8 }} 
                        onPress={handleEmergencySOS}
                    >
                        <PhoneCall size={28} color={colors.white} style={{ marginRight: 12 }} />
                        <Text style={{ color: colors.white, fontWeight: 'bold', fontSize: 18 * fontSizeMultiplier }}>Emergency SOS</Text>
                    </TouchableOpacity>

                </View>
            </ScrollView>

            {/* Bottom Navigation Bar */}
            <View style={{ position: 'absolute', bottom: 0, width: '100%', flexDirection: 'row', justifyContent: 'space-around', backgroundColor: colors.card, paddingVertical: 16, paddingBottom: 24, borderTopWidth: 1, borderColor: colors.border }}>
                <TouchableOpacity style={{ alignItems: 'center' }}>
                    <Home size={24} color={colors.primary} /> 
                    <Text style={{ color: colors.primary, fontWeight: 'bold', fontSize: 12 * fontSizeMultiplier, marginTop: 4 }}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => navigation.navigate("Chatbot")}>
                    <Bot size={24} color={colors.textMuted} />
                    <Text style={{ color: colors.textMuted, fontSize: 12 * fontSizeMultiplier, marginTop: 4 }}>Chatbot</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => navigation.navigate("Profile")}>
                    <User size={24} color={colors.textMuted} />
                    <Text style={{ color: colors.textMuted, fontSize: 12 * fontSizeMultiplier, marginTop: 4 }}>Profile</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default HomeScreen;
