import React, { useState, useEffect } from "react";
import {
  View, Text, TextInput, TouchableOpacity, Keyboard,
  Alert, Image, ActivityIndicator, KeyboardAvoidingView,
  Platform, ScrollView, TouchableWithoutFeedback, Modal
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from '@expo/vector-icons';
import { Plus, Edit2, X, ChevronLeft } from "lucide-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { API_BASE_URL } from "../config/api";
import { useTheme } from "../context/ThemeContext";

const InteractiveTimeline = ({ navigation }) => {
  const { colors, fontSizeMultiplier } = useTheme();
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [imageType, setImageType] = useState("jpeg");
  const [error, setError] = useState("");
  
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    const getTokenAndFetchMemories = async () => {
      try {
        const token = await AsyncStorage.getItem("access_token");
        if (token) {
          setAccessToken(token);
          fetchMemories(token);
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error("Token fetch error:", err);
        setLoading(false);
      }
    };
    getTokenAndFetchMemories();
  }, []);

  const fetchMemories = async (token) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/memories`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 200) {
        const formattedPosts = res.data.map((memory) => ({
          id: memory.id,
          title: memory.title,
          description: memory.description,
          file: memory.image_url,
          date: memory.date || new Date().toISOString().split("T")[0]
        }));
        setPosts(formattedPosts);
      }
    } catch (err) {
      console.error("Error fetching memories:", err.message);
      setError("Failed to load memories.");
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0].base64);
      setImageType(result.assets[0].mimeType?.split("/")[1] || "jpeg");
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setImage(null);
    setDate(new Date());
    setError("");
    setIsModalVisible(true);
  };

  const openEditModal = (post) => {
    setEditingId(post.id);
    setTitle(post.title);
    setDescription(post.description);
    setImage(null); // Force user to pick new image or we'll send without it
    setDate(post.date ? new Date(post.date) : new Date());
    setError("");
    setIsModalVisible(true);
  };

  const handleSavePost = async () => {
    if (submitting) return;
    Keyboard.dismiss();
    setError("");

    if (!title.trim()) return setError("Please enter a title.");
    if (!editingId && !image) return setError("Please select an image for new memories.");

    setSubmitting(true);
    try {
      let payload = {
        title: title.trim(),
        description: description.trim(),
        date: date.toISOString().split("T")[0],
      };

      if (image) {
        payload.image = `data:image/${imageType};base64,${image}`;
      }

      let res;
      if (editingId) {
        // Edit mode
        res = await axios.patch(`${API_BASE_URL}/memories/${editingId}`, payload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
      } else {
        // Add mode
        res = await axios.post(`${API_BASE_URL}/memories`, payload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
      }

      if (res.status === 201 || res.status === 200) {
        setIsModalVisible(false);
        Alert.alert("Success", editingId ? "Memory updated!" : "Memory added!");
        await fetchMemories(accessToken);
      } else {
        setError(res.data.message || "Failed to save memory.");
      }
    } catch (err) {
      console.error("Network Error:", err.message);
      setError("Something went wrong. Check your internet.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    Alert.alert("Confirm", "Are you sure you want to delete this memory?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete", style: "destructive", onPress: async () => {
          setDeleting(id);
          try {
            const res = await axios.delete(`${API_BASE_URL}/memories/${id}`, {
              headers: { Authorization: `Bearer ${accessToken}` },
            });
            if (res.status === 200) {
              Alert.alert("Success", "Memory deleted!");
              await fetchMemories(accessToken);
            } else {
              setError(res.data.message || "Failed to delete memory.");
            }
          } catch (err) {
            console.error("Error deleting memory:", err.message);
            setError("Failed to delete memory.");
          } finally {
            setDeleting(null);
          }
        }
      }
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingTop: 60, paddingBottom: 16, borderBottomWidth: 1, borderColor: colors.border, backgroundColor: colors.background }}>
        <TouchableOpacity 
          style={{ padding: 8, backgroundColor: colors.card, borderRadius: 20, borderWidth: 1, borderColor: colors.border, marginRight: 16 }} 
          onPress={() => navigation.goBack()}
        >
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={{ fontSize: 24 * fontSizeMultiplier, fontWeight: 'bold', color: colors.text, flex: 1 }}>
          Life Timeline
        </Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 24, paddingBottom: 100 }}>

        {error && !isModalVisible ? <Text style={{ color: colors.danger, marginBottom: 12 }}>{error}</Text> : null}

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
        ) : (
          posts.map((item) => (
            <View key={item.id} style={{ 
                backgroundColor: colors.card, 
                borderRadius: 16, 
                padding: 16, 
                marginBottom: 16,
                shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 3,
                borderColor: colors.border, borderWidth: 1
            }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 18 * fontSizeMultiplier, fontWeight: 'bold', color: colors.text, marginBottom: 4 }}>
                    {item.title}
                  </Text>
                  <Text style={{ fontSize: 12 * fontSizeMultiplier, color: colors.textMuted, marginBottom: 8 }}>
                    {item.date}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity onPress={() => openEditModal(item)} style={{ marginRight: 12 }}>
                    <Edit2 size={24} color={colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(item.id)} disabled={deleting === item.id}>
                    {deleting === item.id ? (
                      <ActivityIndicator size="small" color={colors.danger} />
                    ) : (
                      <Ionicons name="trash" size={24} color={colors.danger} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
              
              <Text style={{ fontSize: 15 * fontSizeMultiplier, color: colors.textMuted, marginBottom: 12 }}>
                {item.description}
              </Text>
              
              {item.file ? (
                <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                  <Image
                    source={{ uri: item.file }}
                    style={{ width: "100%", height: 200, borderRadius: 12 }}
                  />
                </TouchableWithoutFeedback>
              ) : null}
            </View>
          ))
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={{
          position: 'absolute', bottom: 30, right: 30, width: 64, height: 64, 
          borderRadius: 32, backgroundColor: colors.primary, justifyContent: 'center', 
          alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 10, elevation: 8
        }}
        onPress={openAddModal}
      >
        <Plus size={32} color={colors.white} />
      </TouchableOpacity>

      {/* Add / Edit Modal */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
            <View style={{ backgroundColor: colors.card, padding: 24, borderTopLeftRadius: 24, borderTopRightRadius: 24 }}>
              
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <Text style={{ fontSize: 20 * fontSizeMultiplier, fontWeight: 'bold', color: colors.text }}>
                  {editingId ? "Edit Memory" : "Add New Memory"}
                </Text>
                <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                  <X size={28} color={colors.textMuted} />
                </TouchableOpacity>
              </View>

              {error ? <Text style={{ color: colors.danger, marginBottom: 12 }}>{error}</Text> : null}

              <TextInput
                style={{ 
                  backgroundColor: colors.background, color: colors.text, padding: 16, 
                  borderRadius: 12, marginBottom: 12, fontSize: 16 * fontSizeMultiplier,
                  borderWidth: 1, borderColor: colors.border
                }}
                placeholder="Enter title"
                placeholderTextColor={colors.textMuted}
                value={title}
                onChangeText={setTitle}
              />

              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(false);
                    if (selectedDate) setDate(selectedDate);
                  }}
                />
              )}
              <TouchableOpacity
                style={{ 
                  backgroundColor: colors.background, padding: 16, 
                  borderRadius: 12, marginBottom: 12, flexDirection: 'row', alignItems: 'center',
                  borderWidth: 1, borderColor: colors.border
                }}
                onPress={() => setShowDatePicker(true)}
              >
                <Ionicons name="calendar" size={20} color={colors.primary} style={{ marginRight: 8 }} />
                <Text style={{ fontSize: 16 * fontSizeMultiplier, color: colors.text }}>
                  {date.toISOString().split("T")[0]}
                </Text>
              </TouchableOpacity>

              <TextInput
                style={{ 
                  backgroundColor: colors.background, color: colors.text, padding: 16, 
                  borderRadius: 12, marginBottom: 12, fontSize: 16 * fontSizeMultiplier,
                  borderWidth: 1, borderColor: colors.border
                }}
                placeholder="Enter description"
                placeholderTextColor={colors.textMuted}
                value={description}
                onChangeText={setDescription}
                multiline
              />

              <TouchableOpacity
                style={{ 
                  backgroundColor: colors.primaryLight, padding: 16, borderRadius: 12, 
                  alignItems: 'center', marginBottom: 12 
                }}
                onPress={pickImage}
              >
                <Text style={{ color: colors.primaryDark, fontWeight: 'bold', fontSize: 16 * fontSizeMultiplier }}>
                  {image ? "Change Image" : (editingId ? "Update Image (Optional)" : "Pick an Image")}
                </Text>
              </TouchableOpacity>

              {image && (
                <Image
                  source={{ uri: `data:image/${imageType};base64,${image}` }}
                  style={{ width: "100%", height: 150, borderRadius: 12, marginBottom: 12 }}
                />
              )}

              <TouchableOpacity
                style={{ backgroundColor: colors.primary, padding: 16, borderRadius: 12, alignItems: 'center' }}
                onPress={handleSavePost}
                disabled={submitting}
              >
                <Text style={{ color: colors.white, fontWeight: 'bold', fontSize: 18 * fontSizeMultiplier }}>
                  {submitting ? "Saving..." : "Save Memory"}
                </Text>
              </TouchableOpacity>

            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

    </View>
  );
};

export default InteractiveTimeline;