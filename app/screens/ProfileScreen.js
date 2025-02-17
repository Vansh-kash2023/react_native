import React, { useState } from "react";
import { View, Text, TouchableOpacity, Switch, ScrollView } from "react-native";

const SettingsScreen = ({navigation}) => {
    const [increaseTextSize, setIncreaseTextSize] = useState(false);
    const [highContrastMode, setHighContrastMode] = useState(false);
    const [enableTimedTests, setEnableTimedTests] = useState(false);
    const [receiveTestReminders, setReceiveTestReminders] = useState(false);

    // Dynamic text size based on state
    const textSize = increaseTextSize ? 20 : 16; // Larger size when toggled, default is 16

    return (
        <ScrollView className="flex-1 bg-white p-4">
            <View className="mt-20">
            <Text
                className="font-bold text-gray-900 mb-6 text-4xl"
                 // Dynamically adjust size (bigger for headers)
            >
                Settings/Profile
            </Text>

            {/* Manage Reminders */}
            <View className="mb-6">
                <Text
                    className="font-semibold text-gray-800 mb-2"
                    style={{ fontSize: textSize }}
                >
                    Manage Reminders
                </Text>
                <TouchableOpacity className="bg-black py-3 rounded-lg items-center"  onPress={() => navigation.navigate("RoutineReminder")}>
                    <Text className="text-white" style={{ fontSize: textSize }}>
                        Edit Reminders
                    </Text>
                </TouchableOpacity>
            </View>

          

         
            </View>
        </ScrollView>
    );
};

export default SettingsScreen;
