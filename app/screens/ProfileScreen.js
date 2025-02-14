import React, { useState } from "react";
import { View, Text, TouchableOpacity, Switch, ScrollView } from "react-native";

const SettingsScreen = () => {
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
                <TouchableOpacity className="bg-black py-3 rounded-lg items-center">
                    <Text className="text-white" style={{ fontSize: textSize }}>
                        Edit Reminders
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Emergency Contacts */}
            <View className="mb-6">
                <Text
                    className="font-semibold text-gray-800 mb-2"
                    style={{ fontSize: textSize }}
                >
                    Emergency Contacts
                </Text>
                <TouchableOpacity className="bg-black py-3 rounded-lg items-center">
                    <Text className="text-white" style={{ fontSize: textSize }}>
                        Add Emergency Contact
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Accessibility Options */}
            <View className="mb-6">
                <Text
                    className="font-semibold text-gray-800 mb-4"
                    style={{ fontSize: textSize }}
                >
                    Accessibility Options
                </Text>

                {/* Increase Text Size */}
                <View className="flex-row justify-between items-center mb-4">
                    <Text style={{ fontSize: textSize }} className="text-gray-700">
                        Increase Text Size
                    </Text>
                    <Switch
                        value={increaseTextSize}
                        onValueChange={(value) => setIncreaseTextSize(value)}
                    />
                </View>

                {/* High Contrast Mode */}
                <View className="flex-row justify-between items-center">
                    <Text style={{ fontSize: textSize }} className="text-gray-700">
                        High Contrast Mode
                    </Text>
                    <Switch
                        value={highContrastMode}
                        onValueChange={(value) => setHighContrastMode(value)}
                    />
                </View>
            </View>

            {/* Cognitive Test Preferences */}
            <View className="mb-6">
                <Text
                    className="font-semibold text-gray-800 mb-4"
                    style={{ fontSize: textSize }}
                >
                    Cognitive Test Preferences
                </Text>

                {/* Enable Timed Tests */}
                <View className="flex-row justify-between items-center mb-4">
                    <Text style={{ fontSize: textSize }} className="text-gray-700">
                        Enable Timed Tests
                    </Text>
                    <Switch
                        value={enableTimedTests}
                        onValueChange={(value) => setEnableTimedTests(value)}
                    />
                </View>

                {/* Receive Test Reminders */}
                <View className="flex-row justify-between items-center">
                    <Text style={{ fontSize: textSize }} className="text-gray-700">
                        Receive Test Reminders
                    </Text>
                    <Switch
                        value={receiveTestReminders}
                        onValueChange={(value) => setReceiveTestReminders(value)}
                    />
                </View>
            </View>
            </View>
        </ScrollView>
    );
};

export default SettingsScreen;
