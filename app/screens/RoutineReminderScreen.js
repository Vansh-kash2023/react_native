import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
  TextInput,
  Alert,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "https://life-path-flask.onrender.com/reminders"; // Update with your API

const RoutineRemindersScreen = () => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [repeatDaily, setRepeatDaily] = useState(false);
  const [voiceReminder, setVoiceReminder] = useState(false);
  const [newReminder, setNewReminder] = useState({
    title: "",
    time: "",
    description: "",
  });

  // Fetch Reminders from Backend
  const fetchReminders = async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReminders(response.data);
    } catch (error) {
      console.error("Error fetching reminders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  // Add a New Reminder
  const addReminder = async () => {
    if (!newReminder.title || !newReminder.time) {
      Alert.alert("Error", "Title and Time are required.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("access_token");
      const response = await axios.post(
        API_URL,
        {
          title: newReminder.title,
          description: newReminder.description,
          time: newReminder.time,
          repeat: repeatDaily ? "daily" : "none",
          status: true, // Set status to active
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update UI
      setReminders([...reminders, response.data]);
      setNewReminder({ title: "", time: "", description: "" });
      Alert.alert("Success", "Reminder added!");
    } catch (error) {
      console.error("Error adding reminder:", error);
      Alert.alert("Error", "Failed to add reminder.");
    }
  };

  return (
    <ScrollView className="flex-1 bg-white p-6">
      <View className="mt-20">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-4xl font-bold text-gray-900 mb-4">
            Routine Reminders
          </Text>
        </View>

        {/* Add Reminder Form */}
        <View className="mb-6 space-y-3">
          <TextInput
            className="border border-gray-300 rounded-lg p-3"
            placeholder="Reminder Title"
            value={newReminder.title}
            onChangeText={(text) => setNewReminder({ ...newReminder, title: text })}
          />
          <TextInput
            className="border border-gray-300 rounded-lg p-3"
            placeholder="Time (HH:MM)"
            value={newReminder.time}
            onChangeText={(text) => setNewReminder({ ...newReminder, time: text })}
          />
          <TextInput
            className="border border-gray-300 rounded-lg p-3"
            placeholder="Description (Optional)"
            value={newReminder.description}
            onChangeText={(text) => setNewReminder({ ...newReminder, description: text })}
          />
          <TouchableOpacity
            onPress={addReminder}
            className="bg-black py-3 rounded-lg items-center"
          >
            <Text className="text-white text-base">Add Reminder</Text>
          </TouchableOpacity>
        </View>

        {/* Reminders List */}
        {loading ? (
          <Text>Loading reminders...</Text>
        ) : (
          reminders.map((reminder, index) => (
            <View key={index} className="mb-4">
              <Text className="text-lg font-bold text-gray-900">{reminder.title}</Text>
              <Text className="text-sm text-gray-500">{reminder.time}</Text>
            </View>
          ))
        )}

        {/* Additional Options */}
        <View className="mt-6">
          <Text className="text-lg font-bold text-gray-900 mb-4">Additional Options</Text>

          {/* Repeat Daily Option */}
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-base font-bold text-gray-800">Repeat Daily</Text>
            <Switch value={repeatDaily} onValueChange={() => setRepeatDaily(!repeatDaily)} />
          </View>

          {/* Enable Voice Reminder Option */}
          <View className="flex-row justify-between items-center">
            <Text className="text-base text-gray-800 font-bold">Enable Voice Reminder</Text>
            <Switch value={voiceReminder} onValueChange={() => setVoiceReminder(!voiceReminder)} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default RoutineRemindersScreen;
