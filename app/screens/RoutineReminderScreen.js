import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
  AppState,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";
import moment from "moment";

const API_URL = "https://life-path-flask.onrender.com/reminders";

const RoutineRemindersScreen = () => {
  const [reminders, setReminders] = useState([]);
  const remindersRef = useRef(reminders);
  const [newReminder, setNewReminder] = useState({ title: "", time: "", description: "" });
  const [loading, setLoading] = useState(true);
  const [addingReminder, setAddingReminder] = useState(false);
  const appState = useRef(AppState.currentState);

  // Sync remindersRef with state
  useEffect(() => {
    remindersRef.current = reminders;
  }, [reminders]);

  const fetchReminders = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("access_token");
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReminders(response.data);
    } catch (error) {
      console.error("Error fetching reminders:", error);
      Alert.alert("Error", "Failed to fetch reminders.");
    } finally {
      setLoading(false);
    }
  };

  const checkRemindersForAlert = () => {
    const now = moment();
    remindersRef.current.forEach((reminder) => {
      const reminderTime = moment(reminder.time, "HH:mm");
      
      const reminderTimeToday = moment(now).set({
        hour: reminderTime.hours(),
        minute: reminderTime.minutes(),
        second: 0,
        millisecond: 0
      });

      if (now.isSame(reminderTimeToday, "minute")) {
        Alert.alert(reminder.title, reminder.description || "Time for your reminder!");
      }
    });
  };

  useEffect(() => {
    fetchReminders();

    const scheduleCheck = () => {
      const now = moment();
      const delay = (60 - now.seconds()) * 1000; // Milliseconds to next minute

      const timeoutId = setTimeout(() => {
        checkRemindersForAlert();
        const intervalId = setInterval(checkRemindersForAlert, 60000);
        intervalRef.current = intervalId;
      }, delay);

      return timeoutId;
    };

    const intervalRef = { current: null };
    const timeoutId = scheduleCheck();

    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === "active") {
        fetchReminders();
        clearTimeout(timeoutId);
        if (intervalRef.current) clearInterval(intervalRef.current);
        scheduleCheck();
      }
      appState.current = nextAppState;
    });

    return () => {
      clearTimeout(timeoutId);
      if (intervalRef.current) clearInterval(intervalRef.current);
      subscription.remove();
    };
  }, []);

  const addReminder = async () => {
    if (!newReminder.title || !newReminder.time) {
      Alert.alert("Error", "Title and Time are required.");
      return;
    }

    setAddingReminder(true);
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

      setReminders((prevReminders) => [...prevReminders, response.data]);
      setNewReminder({ title: "", time: "", description: "" });
      Alert.alert("Success", "Reminder added!");
    } catch (error) {
      console.error("Error adding reminder:", error);
      Alert.alert("Error", "Failed to add reminder.");
    } finally {
      setAddingReminder(false);
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
        setReminders((prevReminders) => prevReminders.filter((reminder) => reminder.id !== id));
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
            disabled={addingReminder}
          >
            {addingReminder ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text className="text-white text-lg font-semibold">Add Reminder</Text>
            )}
          </TouchableOpacity>

          {loading ? (
            <ActivityIndicator size="large" color="black" />
          ) : (
            reminders.map((reminder) => (
              <View key={reminder.id} className="bg-gray-100 rounded-2xl p-4 mb-4">
                <Text className="text-lg font-semibold text-gray-800">
                  {reminder.title}
                </Text>
                <Text className="text-gray-600">{reminder.time}</Text>
                {reminder.description && (
                  <Text className="text-gray-600 mt-2">{reminder.description}</Text>
                )}

                <TouchableOpacity
                  onPress={() => handleDelete(reminder.id)}
                  style={{ position: "absolute", top: 10, right: 10 }}
                >
                  <Ionicons name="trash" size={24} color="red" />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

export default RoutineRemindersScreen;