import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { RadioButton } from "react-native-paper";

const CognitiveAssessmentScreen = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userResponses, setUserResponses] = useState([]);
  const [score, setScore] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [squareCount, setSquareCount] = useState("");

  useEffect(() => {
    getTokenAndFetchMemories();
  }, []);

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

  const fetchMemories = async (token) => {
    setLoading(true);
    try {
      const res = await axios.get(
        "https://life-path-flask.onrender.com/memories",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.status === 200 && res.data.length >= 3) {
        const shuffled = res.data.sort(() => 0.5 - Math.random());
        const selectedMemories = shuffled.slice(0, 3).map((memory, index) => ({
          id: memory.id,
          title: memory.title,
          description: memory.description,
          file: memory.image_url,
          questionNumber: index + 1,
        }));
        setPosts(selectedMemories);
      }
    } catch (err) {
      console.error("Error fetching memories:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResponse = (question, answer, index, correctAnswer = null) => {
    let questionScore = correctAnswer ? (answer === correctAnswer ? 2 : 0) : answer === "Yes" ? 2 : 0;

    setUserResponses((prevResponses) => {
      const updatedResponses = [...prevResponses];
      updatedResponses[index] = { question, answer, score: questionScore };
      return updatedResponses;
    });

    setSelectedOptions((prev) => ({ ...prev, [index]: answer }));
    setScore((prevScore) => prevScore + questionScore);
  };

  const handleSquareCountChange = (text) => {
    const number = parseInt(text, 10);
    if (!isNaN(number) && number >= 0 && number <= 10) {
      setSquareCount(text);

      setUserResponses((prevResponses) => {
        const updatedResponses = [...prevResponses];
        updatedResponses[4] = { question: "How many squares are in this image?", answer: number, score: number === 10 ? 2 : 0 };
        return updatedResponses;
      });

      setScore((prevScore) => (number === 10 ? prevScore + 2 : prevScore));
    }
  };

  const logResponses = () => {
    console.log("User Responses:", userResponses);
  };

  const handleDayResponse = (text) => {
    const today = new Date().toLocaleDateString("en-US", { weekday: "long" }); // Get today's day (e.g., "Monday")
    const formattedInput = text.trim().toLowerCase();
    const formattedToday = today.toLowerCase();

    const isCorrect = formattedInput === formattedToday;
    const questionScore = isCorrect ? 2 : 0;

    setUserResponses((prevResponses) => {
      const updatedResponses = [...prevResponses];
      updatedResponses[7] = { question: "Which day is today?", answer: text, score: questionScore };
      return updatedResponses;
    });

    setScore((prevScore) => (isCorrect ? prevScore + 2 : prevScore));
  };

  const handleAnimalResponse = (value) => {
    const isCorrect = value === "Dog";
    const questionScore = isCorrect ? 2 : 0;

    setUserResponses((prevResponses) => {
      const updatedResponses = [...prevResponses];
      updatedResponses[8] = { question: "Identify the animal in the image", answer: value, score: questionScore };
      return updatedResponses;
    });

    setSelectedOptions((prev) => ({ ...prev, 8: value }));
    setScore((prevScore) => (isCorrect ? prevScore + 2 : prevScore));
  };

  const handleStraightLineResponse = (value) => {
    const isCorrect = value === "No";
    const questionScore = isCorrect ? 2 : 0;

    setUserResponses((prevResponses) => {
      const updatedResponses = [...prevResponses];
      updatedResponses[9] = { question: "Does the image contain a straight line?", answer: value, score: questionScore };
      return updatedResponses;
    });

    setSelectedOptions((prev) => ({ ...prev, 9: value }));
    setScore((prevScore) => (isCorrect ? prevScore + 2 : prevScore));
  };


  return (
    <ScrollView className="flex-1 bg-white p-6">
      <View className="mt-10 mb-6">
        <Text className="text-3xl font-bold text-gray-900">Cognitive Assessment</Text>
        <Text className="text-base text-gray-700 mt-2">Follow the prompts and answer the questions as best as you can.</Text>
      </View>

      <View className="h-[1px] bg-gray-300 my-4" />

      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        posts.map((post, index) => (
          <View key={post.id} className="mb-6">
            <Text className="text-lg font-medium text-gray-800 mb-2">Q{post.questionNumber}. Do you remember this memory?</Text>
            <Image source={{ uri: post.file }} className="w-full h-40 rounded-lg mb-4" resizeMode="contain" />
            <View className="flex-row gap-4">
              {["Yes", "No"].map((option) => (
                <TouchableOpacity
                  key={option}
                  className={`px-5 py-3 rounded-lg border ${selectedOptions[index] === option ? "bg-black border-black" : "border-gray-400"}`}
                  onPress={() => handleResponse("Do you remember this memory?", option, index)}
                >
                  <Text className={`text-lg ${selectedOptions[index] === option ? "text-white" : "text-black"}`}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))
      )}

      <View className="mb-6">
        <Text className="text-lg font-medium text-gray-800 mb-2">Q4. What shape is this?</Text>
        <Image source={require("./../assets/square_shape.png")} className="w-32 h-32 self-center rounded-lg mb-4" resizeMode="contain" />
        <RadioButton.Group
          onValueChange={(value) => handleResponse("What shape is this?", value, 3, "Square")}
          value={selectedOptions[3] || ""}
        >
          {["Square", "Rectangle", "Triangle", "Circle"].map((option) => (
            <TouchableOpacity key={option} className="flex-row items-center mb-2" onPress={() => handleResponse("What shape is this?", option, 3, "Square")}>
              <RadioButton value={option} />
              <Text className={`ml-2 text-lg ${selectedOptions[3] === option ? "text-black font-bold" : "text-gray-800"}`}>{option}</Text>
            </TouchableOpacity>
          ))}
        </RadioButton.Group>
      </View>

      <View className="mb-6">
        <Text className="text-lg font-medium text-gray-800 mb-2">Q5. How many squares are in this image?</Text>
        <Image source={require("./../assets/square.png")} className="w-32 h-32 self-center rounded-lg mb-4" resizeMode="contain" />
        <TextInput
          className="border border-gray-400 p-3 rounded-lg text-lg"
          keyboardType="numeric"
          maxLength={2}
          value={squareCount}
          onChangeText={handleSquareCountChange}
          placeholder="Enter a number between 0-10"
        />
      </View>

      {/* Question 6 */}
      <View className="mb-6">
        <Text className="text-lg font-medium text-gray-800 mb-2">Q6. Which option is the inverted version of the image below?</Text>
        <Image source={require("./../assets/inverted.png")} className="w-32 h-32 self-center rounded-lg mb-4" resizeMode="contain" />
        <RadioButton.Group
          onValueChange={(value) => handleResponse("Which option is the inverted image?", value, 5, "B")}
          value={selectedOptions[5] || ""}
        >
          {["A", "B", "C", "D"].map((option) => (
            <TouchableOpacity key={option} className="flex-row items-center mb-2" onPress={() => handleResponse("Which option is the inverted image?", option, 5, "B")}>
              <RadioButton value={option} />
              <Text className={`ml-2 text-lg ${selectedOptions[5] === option ? "text-black font-bold" : "text-gray-800"}`}>{option}</Text>
            </TouchableOpacity>
          ))}
        </RadioButton.Group>
      </View>

      <View className="mb-6">
        <Text className="text-lg font-medium text-gray-800 mb-2">
          Q7. After how many years does a leap year come?
        </Text>

        <RadioButton.Group
          onValueChange={(value) => handleResponse("After how many years does a leap year come?", value, 6, "4")}
          value={selectedOptions[6] || ""}
        >
          {["2", "3", "4", "5"].map((option) => (
            <TouchableOpacity key={option} className="flex-row items-center mb-2" onPress={() => handleResponse("After how many years does a leap year come?", option, 6, "4")}>
              <RadioButton value={option} />
              <Text className={`ml-2 text-lg ${selectedOptions[6] === option ? "text-black font-bold" : "text-gray-800"}`}>{option}</Text>
            </TouchableOpacity>
          ))}
        </RadioButton.Group>
      </View>

      <View className="mb-6">
        <Text className="text-lg font-medium text-gray-800 mb-2">
          Q8. Which day is today?
        </Text>

        <TextInput
          className="border border-gray-400 p-3 rounded-lg text-lg"
          placeholder="Enter the day (e.g., Monday)"
          onChangeText={handleDayResponse}
        />
      </View>

      <View className="mb-6">
        <Text className="text-lg font-medium text-gray-800 mb-2">
          Q9. What animal is shown in the image?
        </Text>

        <Image source={require("./../assets/dog.png")} className="w-40 h-40 self-center rounded-lg mb-4" resizeMode="contain" />

        <RadioButton.Group onValueChange={handleAnimalResponse} value={selectedOptions[8] || ""}>
          {["Dog", "Cat", "Rabbit", "Elephant"].map((option) => (
            <TouchableOpacity key={option} className="flex-row items-center mb-2" onPress={() => handleAnimalResponse(option)}>
              <RadioButton value={option} />
              <Text className={`ml-2 text-lg ${selectedOptions[8] === option ? "text-black font-bold" : "text-gray-800"}`}>{option}</Text>
            </TouchableOpacity>
          ))}
        </RadioButton.Group>
      </View>

      <View className="mb-6">
        <Text className="text-lg font-medium text-gray-800 mb-2">
          Q10. Does the image contain a straight line?
        </Text>

        <Image source={require("./../assets/straightline.png")} className="w-40 h-40 self-center rounded-lg mb-4" resizeMode="contain" />

        <View className="flex-row gap-4">
          {["Yes", "No"].map((option) => (
            <TouchableOpacity
              key={option}
              className={`px-5 py-3 rounded-lg border ${selectedOptions[9] === option ? "bg-black border-black" : "border-gray-400"}`}
              onPress={() => handleStraightLineResponse(option)}
            >
              <Text className={`text-lg ${selectedOptions[9] === option ? "text-white" : "text-black"}`}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <TouchableOpacity className="bg-black py-3 rounded-lg mt-4 mb-10" onPress={logResponses}>
        <Text className="text-white text-lg text-center font-bold">Log Responses</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default CognitiveAssessmentScreen;