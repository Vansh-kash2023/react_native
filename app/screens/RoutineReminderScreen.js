import React, { useState, useEffect, useRef } from "react";
import {
  View, Text, TouchableOpacity, ScrollView, TextInput,
  Alert, Keyboard, TouchableWithoutFeedback, ActivityIndicator,
  AppState, Modal, Platform
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Plus, Edit2, X, BellRing, ChevronLeft } from "lucide-react-native";
import { useAudioPlayer } from "expo-audio";
import { API_BASE_URL } from "../config/api";
import { useTheme } from "../context/ThemeContext";

const API_URL = `${API_BASE_URL}/reminders`;

const RoutineRemindersScreen = ({ navigation }) => {
  const { colors, fontSizeMultiplier, loading: themeLoading } = useTheme();
  const [reminders, setReminders] = useState([]);
  const remindersRef = useRef(reminders);
  
  const [loading, setLoading] = useState(true);
  const [addingReminder, setAddingReminder] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Form State
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Alarm State
  const [activeAlarm, setActiveAlarm] = useState(null);
  const player = useAudioPlayer('https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg');

  const appState = useRef(AppState.currentState);

  // Sync remindersRef with state
  useEffect(() => {
    remindersRef.current = reminders;
  }, [reminders]);

  const fetchReminders = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("access_token");
      if (token) {
        const response = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReminders(response.data);
      }
    } catch (error) {
      console.error("Error fetching reminders:", error);
    } finally {
      setLoading(false);
    }
  };

  const playAlarmSound = () => {
    try {
      player.seekTo(0);
      player.play();
    } catch (e) {
      console.log("Error playing alarm sound", e);
    }
  };

  const stopAlarmSound = () => {
    player.pause();
    player.seekTo(0);
    setActiveAlarm(null);
  };

  const checkRemindersForAlert = () => {
    if (activeAlarm) return; // Don't trigger another while one is ringing

    const now = moment();
    remindersRef.current.forEach((reminder) => {
      // Ensure the reminder time format matches "HH:mm" from our logic
      const reminderTime = moment(reminder.time, "HH:mm");
      
      const reminderTimeToday = moment(now).set({
        hour: reminderTime.hours(),
        minute: reminderTime.minutes(),
        second: 0,
        millisecond: 0
      });

      if (now.isSame(reminderTimeToday, "minute")) {
        setActiveAlarm(reminder);
        playAlarmSound();
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

  const openAddModal = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setSelectedTime(new Date());
    setIsModalVisible(true);
  };

  const openEditModal = (reminder) => {
    setEditingId(reminder.id);
    setTitle(reminder.title);
    setDescription(reminder.description || "");
    const timeParts = reminder.time.split(":");
    const date = new Date();
    date.setHours(parseInt(timeParts[0], 10));
    date.setMinutes(parseInt(timeParts[1], 10));
    setSelectedTime(date);
    setIsModalVisible(true);
  };

  const handleTimeChange = (event, date) => {
    if (Platform.OS === 'android') setShowTimePicker(false);
    if (date) setSelectedTime(date);
  };

  const handleSaveReminder = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Title is required.");
      return;
    }

    setAddingReminder(true);
    const timeString = moment(selectedTime).format("HH:mm");

    try {
      const token = await AsyncStorage.getItem("access_token");
      let response;
      if (editingId) {
        // Edit mode
        response = await axios.patch(
          `${API_URL}/${editingId}`,
          { title, description, time: timeString, repeat: "none" },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // Add mode
        response = await axios.post(
          API_URL,
          { title, description, time: timeString, repeat: "none" },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      setIsModalVisible(false);
      Alert.alert("Success", editingId ? "Reminder updated!" : "Reminder added!");
      fetchReminders();
    } catch (error) {
      console.error("Error saving reminder:", error);
      Alert.alert("Error", "Failed to save reminder.");
    } finally {
      setAddingReminder(false);
    }
  };

  const handleDelete = async (id) => {
    Alert.alert("Confirm", "Are you sure you want to delete this reminder?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete", style: "destructive", onPress: async () => {
          setDeletingId(id);
          try {
            const token = await AsyncStorage.getItem("access_token");
            const response = await axios.delete(`${API_URL}/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (response.status === 200) {
              setReminders((prev) => prev.filter((r) => r.id !== id));
              Alert.alert("Success", "Reminder deleted!");
            }
          } catch (error) {
            console.error("Error deleting reminder:", error);
            Alert.alert("Error", "Failed to delete reminder.");
          } finally {
            setDeletingId(null);
          }
        }
      }
    ]);
  };

  if (themeLoading) return null;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingTop: 60, paddingBottom: 16, borderBottomWidth: 1, borderColor: colors.border, backgroundColor: colors.background }}>
        <TouchableOpacity 
          style={{ padding: 8, backgroundColor: colors.card, borderRadius: 20, borderWidth: 1, borderColor: colors.border, marginRight: 16 }} 
          onPress={() => navigation.goBack()}
        >
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={{ fontSize: 24 * fontSizeMultiplier, fontWeight: "bold", color: colors.text, flex: 1 }}>
          Routine Reminders
        </Text>
      </View>
      
      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 24, paddingBottom: 100 }}>

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : (
          reminders.map((reminder) => (
            <View key={reminder.id} style={{
              backgroundColor: colors.card,
              borderRadius: 16,
              padding: 16,
              marginBottom: 16,
              shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 10, elevation: 3,
              borderColor: colors.border, borderWidth: 1
            }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 18 * fontSizeMultiplier, fontWeight: "bold", color: colors.text, marginBottom: 4 }}>
                    {reminder.title}
                  </Text>
                  <Text style={{ fontSize: 16 * fontSizeMultiplier, color: colors.primaryDark, fontWeight: '600', marginBottom: 8 }}>
                    {reminder.time}
                  </Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity onPress={() => openEditModal(reminder)} style={{ marginRight: 12 }}>
                    <Edit2 size={24} color={colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(reminder.id)} disabled={deletingId === reminder.id}>
                    {deletingId === reminder.id ? (
                      <ActivityIndicator size="small" color={colors.danger} />
                    ) : (
                      <Ionicons name="trash" size={24} color={colors.danger} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
              {reminder.description ? (
                <Text style={{ fontSize: 15 * fontSizeMultiplier, color: colors.textMuted }}>
                  {reminder.description}
                </Text>
              ) : null}
            </View>
          ))
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={{
          position: "absolute", bottom: 30, right: 30, width: 64, height: 64,
          borderRadius: 32, backgroundColor: colors.primary, justifyContent: "center",
          alignItems: "center", shadowColor: "#000", shadowOpacity: 0.3, shadowRadius: 10, elevation: 8
        }}
        onPress={openAddModal}
      >
        <Plus size={32} color={colors.white} />
      </TouchableOpacity>

      {/* Add / Edit Modal */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" }}>
          <View style={{ backgroundColor: colors.card, padding: 24, borderTopLeftRadius: 24, borderTopRightRadius: 24 }}>
            
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <Text style={{ fontSize: 20 * fontSizeMultiplier, fontWeight: "bold", color: colors.text }}>
                {editingId ? "Edit Reminder" : "Add Reminder"}
              </Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <X size={28} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={{
                backgroundColor: colors.background, color: colors.text, padding: 16,
                borderRadius: 12, marginBottom: 16, fontSize: 16 * fontSizeMultiplier,
                borderWidth: 1, borderColor: colors.border
              }}
              placeholder="Reminder Title"
              placeholderTextColor={colors.textMuted}
              value={title}
              onChangeText={setTitle}
            />

            <TextInput
              style={{
                backgroundColor: colors.background, color: colors.text, padding: 16,
                borderRadius: 12, marginBottom: 16, fontSize: 16 * fontSizeMultiplier,
                borderWidth: 1, borderColor: colors.border
              }}
              placeholder="Description (Optional)"
              placeholderTextColor={colors.textMuted}
              value={description}
              onChangeText={setDescription}
              multiline
            />

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <Text style={{ fontSize: 16 * fontSizeMultiplier, color: colors.text, fontWeight: '600' }}>
                Time:
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {Platform.OS === 'android' && (
                  <TouchableOpacity 
                    style={{ backgroundColor: colors.primaryLight, padding: 10, borderRadius: 8, marginRight: 10 }}
                    onPress={() => setShowTimePicker(true)}
                  >
                    <Text style={{ color: colors.primaryDark, fontWeight: 'bold' }}>
                      {moment(selectedTime).format("HH:mm")}
                    </Text>
                  </TouchableOpacity>
                )}
                {(showTimePicker || Platform.OS === 'ios') && (
                  <DateTimePicker
                    value={selectedTime}
                    mode="time"
                    display="spinner"
                    is24Hour={true}
                    onChange={handleTimeChange}
                    style={{ height: 120 }}
                    textColor={colors.text} // works on iOS 14+ usually
                  />
                )}
              </View>
            </View>

            <TouchableOpacity
              style={{ backgroundColor: colors.primary, padding: 16, borderRadius: 12, alignItems: "center" }}
              onPress={handleSaveReminder}
              disabled={addingReminder}
            >
              <Text style={{ color: colors.white, fontWeight: "bold", fontSize: 18 * fontSizeMultiplier }}>
                {addingReminder ? "Saving..." : "Save Reminder"}
              </Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

      {/* Alarm Ringing Modal */}
      <Modal visible={!!activeAlarm} animationType="fade" transparent={true}>
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.8)", justifyContent: "center", alignItems: 'center', padding: 24 }}>
            <View style={{ backgroundColor: colors.card, padding: 32, borderRadius: 24, width: '100%', alignItems: 'center' }}>
                <BellRing size={64} color={colors.primary} style={{ marginBottom: 24 }} />
                <Text style={{ fontSize: 24 * fontSizeMultiplier, fontWeight: 'bold', color: colors.text, marginBottom: 8, textAlign: 'center' }}>
                    {activeAlarm?.title}
                </Text>
                <Text style={{ fontSize: 16 * fontSizeMultiplier, color: colors.textMuted, marginBottom: 32, textAlign: 'center' }}>
                    {activeAlarm?.time} - {activeAlarm?.description || "It's time!"}
                </Text>

                <TouchableOpacity
                    style={{ backgroundColor: colors.danger, paddingVertical: 16, paddingHorizontal: 32, borderRadius: 32, width: '100%', alignItems: 'center' }}
                    onPress={stopAlarmSound}
                >
                    <Text style={{ color: colors.white, fontWeight: 'bold', fontSize: 20 * fontSizeMultiplier }}>Dismiss</Text>
                </TouchableOpacity>
            </View>
        </View>
      </Modal>

    </View>
  );
};

export default RoutineRemindersScreen;