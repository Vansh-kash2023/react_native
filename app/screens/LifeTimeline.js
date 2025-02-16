import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, Keyboard, TouchableWithoutFeedback, Alert, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

const InteractiveTimeline = () => {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAddMemoryToggle = () => {
    setIsAdding(!isAdding);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleAddPost = async () => {
    Keyboard.dismiss();

    if (!title.trim()) {
      setError("Please enter a title.");
      return;
    }
    if (!image) {
      setError("Please select an image.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("date", new Date().toISOString().split("T")[0]);

    const filename = image.split("/").pop();
    const fileType = filename.split(".").pop();
    formData.append("file", {
      uri: image,
      name: filename,
      type: `image/${fileType}`,
    });

    try {
      const response = await axios.post("https://life-path-flask.onrender.com/memories", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response);
      if (response.status === 201) {
        const newPost = {
          id: response.data.id,
          title: response.data.title,
          description: response.data.description,
          file: response.data.file, // Adjust if needed
        };

        setPosts((prevPosts) => [...prevPosts, newPost]);
        setTitle("");
        setDescription("");
        setImage(null);
        setError("");
        setIsAdding(false);
        Alert.alert("Success", "Memory added successfully!");
      } else {
        setError(response.data.message || "Failed to add memory. Please try again.");
      }
    } catch (err) {
      console.error("Error adding memory:", err.response?.data || err.message);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 bg-white p-4">
        <View className="mt-20">
          <Text className="text-4xl font-bold text-gray-800 mb-4">Interactive Life Timeline</Text>

          {error ? <Text className="text-red-500 mb-2">{error}</Text> : null}

          <TouchableOpacity className="bg-black py-3 rounded-lg items-center mb-4 mt-6" onPress={handleAddMemoryToggle}>
            <Text className="text-white font-bold text-lg">{isAdding ? "Cancel" : "Add New Memory"}</Text>
          </TouchableOpacity>

          {isAdding && (
            <View className="mb-4">
              <TextInput className="bg-gray-100 p-3 rounded-lg mb-2" placeholder="Enter title" value={title} onChangeText={setTitle} />
              <TextInput className="bg-gray-100 p-3 rounded-lg mb-2" placeholder="Enter description" value={description} onChangeText={setDescription} />
              <TouchableOpacity className="bg-blue-600 py-3 rounded-lg items-center mb-2" onPress={pickImage}>
                <Text className="text-white font-bold text-lg">Pick an Image</Text>
              </TouchableOpacity>
              {image && <Image source={{ uri: image }} className="w-full h-40 rounded-lg mb-2" />}
              <TouchableOpacity className="bg-green-600 py-3 rounded-lg items-center" onPress={handleAddPost}>
                <Text className="text-white font-bold text-lg">Save</Text>
              </TouchableOpacity>
            </View>
          )}

          <FlatList
            data={posts}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 16 }}
            renderItem={({ item }) => (
              <View className="bg-gray-100 p-4 rounded-lg mb-4">
                <Text className="text-lg font-bold text-gray-800 mb-1">{item.title}</Text>
                <Text className="text-gray-600">{item.description}</Text>
                {item.file && <Image source={{ uri: item.file }} className="w-full h-40 rounded-lg mt-2" />}
              </View>
            )}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

// ✅ **Corrected Export**
export default InteractiveTimeline;
