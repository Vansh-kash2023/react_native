import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, BackHandler } from "react-native";
import { Brain, CheckCircle } from "lucide-react-native";
import { useTheme } from "../context/ThemeContext";

const AssessmentResultScreen = ({ navigation, route }) => {
    const { colors, fontSizeMultiplier } = useTheme();
    const { score, conditionMessage } = route.params || { score: 0, conditionMessage: "No data available." };

    // Prevent physical back button on Android
    useEffect(() => {
        const backAction = () => {
            navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove();
    }, [navigation]);

    return (
        <View style={{ flex: 1, backgroundColor: colors.background, padding: 24, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ width: '100%', backgroundColor: colors.card, padding: 32, borderRadius: 24, alignItems: 'center', borderWidth: 1, borderColor: colors.border, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 }}>
                
                <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: colors.primaryLight, justifyContent: 'center', alignItems: 'center', marginBottom: 24 }}>
                    <Brain size={40} color={colors.primaryDark} />
                </View>

                <Text style={{ fontSize: 24 * fontSizeMultiplier, fontWeight: 'bold', color: colors.text, marginBottom: 8, textAlign: 'center' }}>
                    Assessment Complete
                </Text>

                <Text style={{ fontSize: 16 * fontSizeMultiplier, color: colors.textMuted, textAlign: 'center', marginBottom: 32 }}>
                    Your responses have been successfully recorded.
                </Text>

                <View style={{ width: '100%', backgroundColor: colors.background, padding: 16, borderRadius: 12, marginBottom: 32, borderWidth: 1, borderColor: colors.border }}>
                    <Text style={{ fontSize: 14 * fontSizeMultiplier, color: colors.textMuted, marginBottom: 4, textAlign: 'center' }}>
                        Your Score
                    </Text>
                    <Text style={{ fontSize: 48 * fontSizeMultiplier, fontWeight: 'bold', color: colors.primary, textAlign: 'center', marginBottom: 12 }}>
                        {score} <Text style={{ fontSize: 18 * fontSizeMultiplier, color: colors.textMuted }}>/ 30</Text>
                    </Text>

                    <Text style={{ fontSize: 16 * fontSizeMultiplier, fontWeight: '600', color: colors.text, textAlign: 'center' }}>
                        {conditionMessage}
                    </Text>
                </View>

                <TouchableOpacity 
                    style={{ width: '100%', backgroundColor: colors.primary, paddingVertical: 16, borderRadius: 12, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}
                    onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Home' }] })}
                >
                    <CheckCircle size={20} color={colors.white} style={{ marginRight: 8 }} />
                    <Text style={{ fontSize: 18 * fontSizeMultiplier, fontWeight: 'bold', color: colors.white }}>
                        Return to Home
                    </Text>
                </TouchableOpacity>

            </View>
        </View>
    );
};

export default AssessmentResultScreen;
