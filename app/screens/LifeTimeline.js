import React, { useState, useEffect, useCallback } from "react";
import {
  View, Text, TextInput, TouchableOpacity, Keyboard,
  Alert, Image, ActivityIndicator, KeyboardAvoidingView,
  Platform, ScrollView, TouchableWithoutFeedback
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const InteractiveTimeline = () => {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [imageType, setImageType] = useState("jpeg");
  const [error, setError] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    const getTokenAndFetchMemories = async () => {
      try {
        const token = await AsyncStorage.getItem("access_token");
        if (token) {
          setAccessToken(token);
          fetchMemories(token);
        }
      } catch (err) {
        console.error("Token fetch error:", err);
      }
    };
    getTokenAndFetchMemories();
  }, []);

  const fetchMemories = async (token) => {
    setLoading(true);
    try {
      const res = await axios.get("https://life-path-flask.onrender.com/memories", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 200) {
        const formattedPosts = res.data.map((memory) => ({
          id: memory.id,
          title: memory.title,
          description: memory.description,
          file: memory.image_url,
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
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
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

  const handleAddPost = async () => {
  if (submitting) return;
  Keyboard.dismiss();
  setError("");

  if (!title.trim()) return setError("Please enter a title.");
  if (!image) return setError("Please select an image.");

  setSubmitting(true);
  try {
    const payload = {
      title: title.trim(),
      description: description.trim(),
      date: new Date().toISOString().split("T")[0],
      image: `data:image/${imageType};base64,${image}`,
    };

    const res = await axios.post("https://life-path-flask.onrender.com/memories", payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (res.status === 201) {
      setTitle("");
      setDescription("");
      setImage(null);
      setIsAdding(false);
      Alert.alert("Success", "Memory added successfully!");

      // **Show loader & refetch memories**
      setLoading(true);
      await fetchMemories(accessToken);
    } else {
      setError(res.data.message || "Failed to add memory.");
    }
  } catch (err) {
    console.error("Network Error:", err.message);
    setError("Something went wrong. Check your internet.");
  } finally {
    setSubmitting(false);
  }
};


  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1, padding: 16 }}
          keyboardShouldPersistTaps="handled"
          scrollEnabled={true}
        >
          <Text className="text-4xl font-bold text-gray-800 mb-4 mt-10">
            Interactive Life Timeline
          </Text>

          {error ? <Text className="text-red-500 mb-2">{error}</Text> : null}

          <TouchableOpacity 
            className="bg-black py-3 rounded-lg items-center mb-4 mt-6" 
            onPress={() => setIsAdding((prev) => !prev)}
          >
            <Text className="text-white font-bold text-lg">
              {isAdding ? "Cancel" : "Add New Memory"}
            </Text>
          </TouchableOpacity>

          {isAdding && (
            <View className="mb-4">
              <TextInput className="bg-gray-100 p-3 rounded-lg mb-2" placeholder="Enter title" value={title} onChangeText={setTitle} />
              <TextInput className="bg-gray-100 p-3 rounded-lg mb-2" placeholder="Enter description" value={description} onChangeText={setDescription} />
              <TouchableOpacity className="bg-orange-400 py-3 rounded-lg items-center mb-2" onPress={pickImage}>
                <Text className="text-white font-bold text-lg">Pick an Image</Text>
              </TouchableOpacity>
              {image && (
                <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                  <Image source={{ uri: `data:image/${imageType};base64,${image}` }} style={{ width: "100%", height: 150, borderRadius: 10, marginTop: 10 }} />
                </TouchableWithoutFeedback>
              )}
              <TouchableOpacity className="bg-green-600 py-3 rounded-lg items-center mt-3" onPress={handleAddPost} disabled={submitting}>
                <Text className="text-white font-bold text-lg">{submitting ? "Saving..." : "Save"}</Text>
              </TouchableOpacity>
            </View>
          )}

          {loading ? (
            <ActivityIndicator size="large" color="#000" style={{ marginTop: 20 }} />
          ) : (
            posts.map((item) => (
              <View key={item.id} className="bg-gray-100 p-4 rounded-lg mb-4">
                <Text className="text-lg font-bold text-gray-800 mb-1">{item.title}</Text>
                <Text className="text-gray-600">{item.description}</Text>
                {item.file && (
                  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                    <Image source={{ uri: item.file }} style={{ width: "100%", height: 200, borderRadius: 10, marginTop: 10 }} />
                  </TouchableWithoutFeedback>
                )}
              </View>
            ))
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default InteractiveTimeline;