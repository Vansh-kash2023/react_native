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
import { API_BASE_URL } from "../config/api";
import { useTheme } from "../context/ThemeContext";
import Toast from 'react-native-toast-message';

const FamiliarFaces = ({ navigation }) => {
  const { colors, fontSizeMultiplier } = useTheme();
  const [posts, setPosts] = useState([]);
  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [imageType, setImageType] = useState("jpeg");
  const [error, setError] = useState("");
  
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
      const res = await axios.get(`${API_BASE_URL}/faces`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 200) {
        const formattedPosts = res.data.map((memory) => ({
          id: memory.id,
          name: memory.name,
          relationship: memory.relationship,
          description: memory.description || "",
          file: memory.image_url,
        }));
        setPosts(formattedPosts);
      }
    } catch (err) {
      console.error("Error fetching faces:", err.message);
      setError("Failed to load familiar faces.");
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
    setName("");
    setRelationship("");
    setDescription("");
    setImage(null);
    setError("");
    setIsModalVisible(true);
  };

  const openEditModal = (post) => {
    setEditingId(post.id);
    setName(post.name);
    setRelationship(post.relationship);
    setDescription(post.description);
    setImage(null);
    setError("");
    setIsModalVisible(true);
  };

  const handleSavePost = async () => {
    if (submitting) return;
    Keyboard.dismiss();
    setError("");

    if (!name.trim()) return setError("Please enter a name.");
    if (!relationship.trim()) return setError("Please enter a relationship.");
    if (!editingId && !image) return setError("Please select an image.");

    setSubmitting(true);
    try {
      let payload = {
        name: name.trim(),
        relationship: relationship.trim(),
        description: description.trim(),
        date: new Date().toISOString().split("T")[0],
      };

      if (image) {
        payload.image = `data:image/${imageType};base64,${image}`;
      }

      let res;
      if (editingId) {
        res = await axios.patch(`${API_BASE_URL}/faces/${editingId}`, payload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
      } else {
        res = await axios.post(`${API_BASE_URL}/faces`, payload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
      }

      if (res.status === 201 || res.status === 200) {
        setIsModalVisible(false);
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: editingId ? "Relationship updated!" : "Relationship added!",
          position: 'top',
        });
        await fetchMemories(accessToken);
      } else {
        setError(res.data.message || "Failed to save relationship.");
      }
    } catch (err) {
      console.error("Network Error:", err.message);
      setError("Something went wrong. Check your internet.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    Alert.alert("Confirm", "Are you sure you want to delete this familiar face?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete", style: "destructive", onPress: async () => {
          setDeleting(id);
          try {
            const res = await axios.delete(`${API_BASE_URL}/faces/${id}`, {
              headers: { Authorization: `Bearer ${accessToken}` },
            });
            if (res.status === 200) {
              Toast.show({
                type: 'success',
                text1: 'Deleted',
                text2: 'Relationship removed successfully.',
                position: 'top',
              });
              await fetchMemories(accessToken);
            } else {
              setError(res.data.message || "Failed to delete relationship.");
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

  const getRelationshipColor = (rel) => {
    if (!rel) return colors.textMuted || '#94a3b8';
    const r = rel.toLowerCase();
    if (['wife', 'husband', 'spouse', 'partner'].some(keyword => r.includes(keyword))) return '#ec4899'; // pink
    if (['son', 'daughter', 'child', 'kid'].some(keyword => r.includes(keyword))) return '#8b5cf6'; // violet
    if (['mother', 'father', 'parent', 'mom', 'dad'].some(keyword => r.includes(keyword))) return '#14b8a6'; // teal
    if (['sister', 'brother', 'sibling'].some(keyword => r.includes(keyword))) return '#f59e0b'; // amber
    if (['friend', 'buddy'].some(keyword => r.includes(keyword))) return '#10b981'; // emerald
    if (['caregiver', 'nurse', 'doctor'].some(keyword => r.includes(keyword))) return '#3b82f6'; // blue
    return colors.textMuted || '#94a3b8'; // fallback
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
          Familiar Faces
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
                  <Text style={{ fontSize: 20 * fontSizeMultiplier, fontWeight: 'bold', color: colors.text, marginBottom: 6 }}>
                    {item.name}
                  </Text>
                  <View style={{ backgroundColor: getRelationshipColor(item.relationship), alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 16, marginBottom: 12 }}>
                    <Text style={{ fontSize: 13 * fontSizeMultiplier, fontWeight: '600', color: '#fff' }}>
                        {item.relationship}
                    </Text>
                  </View>
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
              
              {item.description ? (
                <Text style={{ fontSize: 15 * fontSizeMultiplier, color: colors.textMuted, marginBottom: 12 }}>
                    {item.description}
                </Text>
              ) : null}
              
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
                  {editingId ? "Edit Relationship" : "Add New Face"}
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
                placeholder="Name"
                placeholderTextColor={colors.textMuted}
                value={name}
                onChangeText={setName}
              />
              <TextInput
                style={{ 
                  backgroundColor: colors.background, color: colors.text, padding: 16, 
                  borderRadius: 12, marginBottom: 12, fontSize: 16 * fontSizeMultiplier,
                  borderWidth: 1, borderColor: colors.border
                }}
                placeholder="Relationship (e.g. Son, Daughter, Friend)"
                placeholderTextColor={colors.textMuted}
                value={relationship}
                onChangeText={setRelationship}
              />
              <TextInput
                style={{ 
                  backgroundColor: colors.background, color: colors.text, padding: 16, 
                  borderRadius: 12, marginBottom: 12, fontSize: 16 * fontSizeMultiplier,
                  borderWidth: 1, borderColor: colors.border
                }}
                placeholder="Description (e.g. How we met - optional)"
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
                  {submitting ? "Saving..." : "Save Face"}
                </Text>
              </TouchableOpacity>

            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

    </View>
  );
};

export default FamiliarFaces;
