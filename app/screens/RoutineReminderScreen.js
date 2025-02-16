// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   ScrollView,
//   Switch,
//   TextInput,
//   Alert,
// } from "react-native";
// import axios from "axios";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const API_URL = "https://life-path-flask.onrender.com/reminders"; // Update with your API

// const RoutineRemindersScreen = () => {
//   const [reminders, setReminders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [repeatDaily, setRepeatDaily] = useState(false);
//   const [voiceReminder, setVoiceReminder] = useState(false);
//   const [newReminder, setNewReminder] = useState({
//     title: "",
//     time: "",
//     description: "",
//   });

//   // Fetch Reminders from Backend
//   const fetchReminders = async () => {
//     try {
//       const token = await AsyncStorage.getItem("access_token");
//       const response = await axios.get(API_URL, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setReminders(response.data);
//     } catch (error) {
//       console.error("Error fetching reminders:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchReminders();
//   }, []);

//   // Add a New Reminder
//   const addReminder = async () => {
//     if (!newReminder.title || !newReminder.time) {
//       Alert.alert("Error", "Title and Time are required.");
//       return;
//     }

//     try {
//       const token = await AsyncStorage.getItem("access_token");
//       const response = await axios.post(
//         API_URL,
//         {
//           title: newReminder.title,
//           description: newReminder.description,
//           time: newReminder.time,
//           repeat: repeatDaily ? "daily" : "none",
//           status: true, // Set status to active
//         },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       // Update UI
//       setReminders([...reminders, response.data]);
//       setNewReminder({ title: "", time: "", description: "" });
//       Alert.alert("Success", "Reminder added!");
//     } catch (error) {
//       console.error("Error adding reminder:", error);
//       Alert.alert("Error", "Failed to add reminder.");
//     }
//   };

//   return (
//     <ScrollView className="flex-1 bg-white p-6">
//       <View className="mt-20">
//         {/* Header */}
//         <View className="mb-6">
//           <Text className="text-4xl font-bold text-gray-900 mb-4">
//             Routine Reminders
//           </Text>
//         </View>

//         {/* Add Reminder Form */}
//         <View className="mb-6 space-y-3">
//           <TextInput
//             className="border border-gray-300 rounded-lg p-3"
//             placeholder="Reminder Title"
//             value={newReminder.title}
//             onChangeText={(text) => setNewReminder({ ...newReminder, title: text })}
//           />
//           <TextInput
//             className="border border-gray-300 rounded-lg p-3"
//             placeholder="Time (HH:MM)"
//             value={newReminder.time}
//             onChangeText={(text) => setNewReminder({ ...newReminder, time: text })}
//           />
//           <TextInput
//             className="border border-gray-300 rounded-lg p-3"
//             placeholder="Description (Optional)"
//             value={newReminder.description}
//             onChangeText={(text) => setNewReminder({ ...newReminder, description: text })}
//           />
//           <TouchableOpacity
//             onPress={addReminder}
//             className="bg-black py-3 rounded-lg items-center"
//           >
//             <Text className="text-white text-base">Add Reminder</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Reminders List */}
//         {loading ? (
//           <Text>Loading reminders...</Text>
//         ) : (
//           reminders.map((reminder, index) => (
//             <View key={index} className="mb-4">
//               <Text className="text-lg font-bold text-gray-900">{reminder.title}</Text>
//               <Text className="text-sm text-gray-500">{reminder.time}</Text>
//             </View>
//           ))
//         )}

//         {/* Additional Options */}
//         <View className="mt-6">
//           <Text className="text-lg font-bold text-gray-900 mb-4">Additional Options</Text>

//           {/* Repeat Daily Option */}
//           <View className="flex-row justify-between items-center mb-4">
//             <Text className="text-base font-bold text-gray-800">Repeat Daily</Text>
//             <Switch value={repeatDaily} onValueChange={() => setRepeatDaily(!repeatDaily)} />
//           </View>

//           {/* Enable Voice Reminder Option */}
//           <View className="flex-row justify-between items-center">
//             <Text className="text-base text-gray-800 font-bold">Enable Voice Reminder</Text>
//             <Switch value={voiceReminder} onValueChange={() => setVoiceReminder(!voiceReminder)} />
//           </View>
//         </View>
//       </View>
//     </ScrollView>
//   );
// };

// export default RoutineRemindersScreen;

import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  AppState,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
      console.log("Fetched Reminders:", response.data);
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
    fetchReminders();

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

          Alert.alert("⏰ Reminder!", `${reminder.title} - ${reminder.description}`, [
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

    const reminderCheckInterval = setInterval(checkReminders, 60000); // Check every minute
    const fetchInterval = setInterval(fetchReminders, 30000); // Fetch every 30 seconds

    const subscription = AppState.addEventListener("change", (nextAppState) => {
      console.log("App State Changed:", nextAppState);
      appState.current = nextAppState;

      if (nextAppState === "active") {
        fetchReminders(); // Or re-evaluate if needed
      }
    });

    return () => {
      clearInterval(reminderCheckInterval);
      clearInterval(fetchInterval);
      subscription.remove();
    };
  }, []);

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
          repeat: "none", // Or whatever your API expects
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

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "white", padding: 20 }}>
      {/* ... (Your JSX for title, inputs, button, and reminder list) ... */}
      <View style={{ marginTop: 40 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>
          Routine Reminders
        </Text>

        <TextInput
          style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
          placeholder="Reminder Title"
          value={newReminder.title}
          onChangeText={(text) => setNewReminder({ ...newReminder, title: text })}
        />
        <TextInput
          style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
          placeholder="Time (HH:MM, 24hr format)"
          value={newReminder.time}
          onChangeText={(text) => setNewReminder({ ...newReminder, time: text })}
        />
        <TextInput
          style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
          placeholder="Description (Optional)"
          value={newReminder.description}
          onChangeText={(text) => setNewReminder({ ...newReminder, description: text })}
        />
        <TouchableOpacity
          onPress={addReminder}
          style={{
            backgroundColor: "black",
            padding: 15,
            alignItems: "center",
            borderRadius: 5,
          }}
        >
          <Text style={{ color: "white", fontSize: 16 }}>Add Reminder</Text>
        </TouchableOpacity>

        {reminders.map((reminder, index) => (
          <View key={index} style={{ marginTop: 10, padding: 10, borderWidth: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>{reminder.title}</Text>
            <Text style={{ fontSize: 14, color: "gray" }}>{reminder.time}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default RoutineRemindersScreen;