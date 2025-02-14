import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";

const InteractiveTimeline = () => {
  const [posts, setPosts] = useState([
    { id: "1", title: "Family Vacation", description: "At the beach with family - 2021" },
    { id: "2", title: "Graduation Day", description: "Celebrating my degree - 2019" },
  ]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAddMemoryToggle = () => {
    setIsAdding(!isAdding);
  };

  const handleAddPost = () => {
    Keyboard.dismiss();
    if (!title.trim()) {
      setError("Please enter a title.");
      return;
    }
    if (!description.trim()) {
      setError("Please enter a description.");
      return;
    }

    setPosts((prevPosts) => [
      ...prevPosts,
      { id: Date.now().toString(), title, description },
    ]);
    setTitle("");
    setDescription("");
    setError("");
    setIsAdding(false);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 bg-white p-4 ">
        <View className="mt-20">
        <Text className="text-4xl font-bold text-gray-800 mb-4">
          Interactive Life Timeline
        </Text>

        {error ? <Text className="text-red-500 mb-2">{error}</Text> : null}

        <TouchableOpacity
          className="bg-black py-3 rounded-lg items-center mb-4 mt-6"
          onPress={handleAddMemoryToggle}
        >
          <Text className="text-white font-bold text-lg">
            {isAdding ? "Cancel" : "Add New Memory"}
          </Text>
        </TouchableOpacity>

        {isAdding && (
          <View className="mb-4">
            <TextInput
              className="bg-gray-100 p-3 rounded-lg mb-2"
              placeholder="Enter title"
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              className="bg-gray-100 p-3 rounded-lg mb-2"
              placeholder="Enter description"
              value={description}
              onChangeText={setDescription}
            />
            <TouchableOpacity
              className="bg-green-600 py-3 rounded-lg items-center"
              onPress={handleAddPost}
            >
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
              <Text className="text-lg font-bold text-gray-800 mb-1">
                {item.title}
              </Text>
              <Text className="text-gray-600">{item.description}</Text>
            </View>
          )}
        />
          </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default InteractiveTimeline;
