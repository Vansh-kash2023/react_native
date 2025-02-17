import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  AppState,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons"; // Importing Ionicons

const API_URL = "https://life-path-flask.onrender.com/reminders";

const RoutineRemindersScreen = () => {
  const [reminders, setReminders] = useState([]);
  const [newReminder, setNewReminder] = useState({
    title: "",
    time: "",
    description: "",
  });
  const appState = useRef(AppState.currentState);

  const fetchReminders = async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const remindersWithAlertedFlag = response.data.map((reminder) => ({
        ...reminder,
        alerted: false,
      }));
      setReminders(remindersWithAlertedFlag);
    } catch (error) {
      console.error("Error fetching reminders:", error);
    }
  };

  useEffect(() => {
    // Flag to prevent repeated alerts
    let alertTimeout = null;
  
    const checkReminders = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentTimeInMinutes = currentHour * 60 + currentMinute;
  
      reminders.forEach((reminder, index) => {
        const reminderTimeParts = reminder.time.split(":");
        const reminderHour = parseInt(reminderTimeParts[0], 10);
        const reminderMinute = parseInt(reminderTimeParts[1], 10);
        const reminderTimeInMinutes = reminderHour * 60 + reminderMinute;
  
        if (currentTimeInMinutes === reminderTimeInMinutes && !reminder.alerted) {
          console.log("⏰ Reminder Time Matched for:", reminder.title, " - Alerting!");
  
          Alert.alert("⏰ Reminder!", `${reminder.title} - ${reminder.description || "No description"}`, [
            {
              text: "OK",
              onPress: () => {
                setReminders((prevReminders) => {
                  const updatedReminders = [...prevReminders];
                  updatedReminders[index] = { ...reminder, alerted: true };
                  return updatedReminders;
                });
              },
            },
          ]);
        }
      });
    };
  
    const scheduleReminderCheck = () => {
      const now = new Date();
      const currentSeconds = now.getSeconds();
      const remainingTimeUntilNextMinute = 60 - currentSeconds;
  
      // Clear the timeout if it exists and schedule the next check
      clearTimeout(alertTimeout);
      alertTimeout = setTimeout(() => {
        checkReminders(); // Check reminders once the minute changes
        scheduleReminderCheck(); // Recurse to schedule the next check
      }, remainingTimeUntilNextMinute * 1000);
    };
  
    scheduleReminderCheck(); // Start the recurring check process
  
    const fetchInterval = setInterval(fetchReminders, 30000);
  
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      console.log("App State Changed:", nextAppState);
      appState.current = nextAppState;
  
      if (nextAppState === "active") {
        fetchReminders();
      }
    });
  
    return () => {
      clearInterval(fetchInterval);
      clearTimeout(alertTimeout);
      subscription.remove();
    };
  }, [reminders]);
  

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
          repeat: "none",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newReminderWithAlerted = {
        ...response.data,
        alerted: false,
      };

      setReminders((prevReminders) => [...prevReminders, newReminderWithAlerted]);

      setNewReminder({ title: "", time: "", description: "" });
      Alert.alert("Success", "Reminder added!");
    } catch (error) {
      console.error("Error adding reminder:", error);
      Alert.alert("Error", "Failed to add reminder.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      const response = await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        Alert.alert("Success", "Reminder deleted!");
        fetchReminders(); // Fetch reminders again after deletion
      } else {
        Alert.alert("Error", "Failed to delete reminder.");
      }
    } catch (error) {
      console.error("Error deleting reminder:", error);
      Alert.alert("Error", "Failed to delete reminder.");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView className="flex-1 bg-white px-6">
        <View className="mt-10">
          <Text className="text-4xl font-bold text-gray-800 mb-6">
            Routine Reminders
          </Text>

          <View className="flex flex-col gap-2 mb-4">
            <Text className="font-bold text-lg">Reminder Title</Text>
            <TextInput
              className="w-full p-3 bg-gray-100 rounded-2xl"
              placeholder="Enter reminder title"
              value={newReminder.title}
              onChangeText={(text) => setNewReminder({ ...newReminder, title: text })}
            />
          </View>

          <View className="flex flex-col gap-2 mb-4">
            <Text className="font-bold text-lg">Time (HH:MM)</Text>
            <TextInput
              className="w-full p-3 bg-gray-100 rounded-2xl"
              placeholder="Enter time (HH:MM)"
              value={newReminder.time}
              onChangeText={(text) => setNewReminder({ ...newReminder, time: text })}
            />
          </View>

          <View className="flex flex-col gap-2 mb-4">
            <Text className="font-bold text-lg">Description (Optional)</Text>
            <TextInput
              className="w-full p-3 bg-gray-100 rounded-2xl"
              placeholder="Enter description"
              value={newReminder.description}
              onChangeText={(text) => setNewReminder({ ...newReminder, description: text })}
              multiline
            />
          </View>

          <TouchableOpacity
            className="bg-black py-3 rounded-lg w-full items-center mb-6"
            onPress={addReminder}
          >
            <Text className="text-white text-lg font-semibold">Add Reminder</Text>
          </TouchableOpacity>

          {reminders.map((reminder, index) => (
            <View
              key={reminder.id}
              className="bg-gray-100 rounded-2xl p-4 mb-4"
            >
              <Text className="text-lg font-semibold text-gray-800">
                {reminder.title}
              </Text>
              <Text className="text-gray-600">{reminder.time}</Text>
              {reminder.description && (
                <Text className="text-gray-600 mt-2">{reminder.description}</Text>
              )}
              
              {/* Delete Icon */}
              <TouchableOpacity
                onPress={() => handleDelete(reminder.id)}
                style={{ position: "absolute", top: 10, right: 10 }}
              >
                <Ionicons name="trash" size={24} color="red" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

export default RoutineRemindersScreen;
