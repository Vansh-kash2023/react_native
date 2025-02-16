import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
} from "react-native";

const RoutineRemindersScreen = () => {
  const [repeatDaily, setRepeatDaily] = useState(false);
  const [voiceReminder, setVoiceReminder] = useState(false);

  const toggleRepeatDaily = () => setRepeatDaily(!repeatDaily);
  const toggleVoiceReminder = () => setVoiceReminder(!voiceReminder);

  return (
    <ScrollView className="flex-1 bg-white p-6">
        <View className="mt-20">
      {/* Header Section */}
      <View className="mb-6">
        <Text className="text-4xl font-bold text-gray-900 mb-4">
          Routine Reminders
        </Text>
        <TouchableOpacity className="bg-black py-3 rounded-lg items-center">
          <Text className="text-white text-base">Add Reminder</Text>
        </TouchableOpacity>
      </View>

      {/* Reminders List */}
      <View className="mb-6">
        {[
          { title: "Morning Medication", time: "8:00 AM" },
          { title: "Walk the Dog", time: "9:30 AM" },
          { title: "Lunch with Friends", time: "12:00 PM" },
          { title: "Afternoon Nap", time: "2:00 PM" },
        ].map((reminder, index) => (
          <View key={index} className="mb-4">
            <Text className="text-lg font-bold text-gray-900">
              {reminder.title} 
            </Text>
            <Text className="text-sm text-gray-500">{reminder.time}</Text>
          </View>
        ))}
      </View>

      {/* Edit and Delete Buttons */}
      <View className="mb-6 space-y-4">
        <TouchableOpacity className="bg-gray-100 py-3 rounded-lg items-center">
          <Text className="text-gray-900 text-base">Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-gray-100 py-3 rounded-lg items-center">
          <Text className="text-gray-900 text-base">Delete</Text>
        </TouchableOpacity>
      </View>

      {/* Additional Options */}
      <View>
        <Text className="text-lg font-bold text-gray-900 mb-4">
          Additional Options
        </Text>

        {/* Repeat Daily Option */}
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-base font-bold text-gray-800">Repeat Daily</Text>
          <Switch value={repeatDaily} onValueChange={toggleRepeatDaily} />
        </View>

        {/* Enable Voice Reminder Option */}
        <View className="flex-row justify-between items-center">
          <Text className="text-base text-gray-800 font-bold">
            Enable Voice Reminder
          </Text>
          <Switch value={voiceReminder} onValueChange={toggleVoiceReminder} />
        </View>
      </View>
      </View>
    </ScrollView>
  );
};

export default RoutineRemindersScreen;
