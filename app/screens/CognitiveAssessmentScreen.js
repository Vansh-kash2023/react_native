import React, { useState, useEffect } from "react";
import {
  View, Text, TouchableOpacity, ScrollView,
  Image, ActivityIndicator, TextInput, Alert
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { RadioButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { API_BASE_URL } from "../config/api";
import Toast from 'react-native-toast-message';
import { useTheme } from "../context/ThemeContext";
import { ChevronLeft } from "lucide-react-native";

const CognitiveAssessmentScreen = () => {
  const navigation = useNavigation();
  const { colors, fontSizeMultiplier } = useTheme();
  
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
      const res = await axios.get(`${API_BASE_URL}/memories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (res.status === 200) {
        if (res.data.length < 3) {
          Alert.alert(
            "Insufficient Memories",
            "Please add at least 3 memories to take the assessment.",
            [{ text: "OK", onPress: () => navigation.navigate("Timeline") }]
          );
        } else {
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
      }
    } catch (err) {
      console.error("Error fetching memories:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResponse = (question, answer, index, correctAnswer = null) => {
    let questionScore = correctAnswer ? (answer === correctAnswer ? 3 : 0) : answer === "Yes" ? 3 : 0;
  
    setUserResponses((prevResponses) => {
      const updatedResponses = [...prevResponses];
      updatedResponses[index] = {
        question: question,
        answer_text: answer,
        scored: questionScore,
      };
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
        updatedResponses[4] = {
          question: "How many squares are in this image?",
          answer_text: number.toString(),
          scored: number === 10 ? 3 : 0,
        };
        return updatedResponses;
      });
      setScore((prevScore) => (number === 10 ? prevScore + 3 : prevScore));
    }
  };

  const handleDayResponse = (text) => {
    const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
    const formattedInput = text.trim().toLowerCase();
    const formattedToday = today.toLowerCase();
    const isCorrect = formattedInput === formattedToday;
    const questionScore = isCorrect ? 3 : 0;

    setUserResponses((prevResponses) => {
      const updatedResponses = [...prevResponses];
      updatedResponses[7] = { question: "Which day is today?", answer_text: text, scored: questionScore };
      return updatedResponses;
    });
    setScore((prevScore) => (isCorrect ? prevScore + 3 : prevScore));
  };

  const handleAnimalResponse = (value) => {
    const isCorrect = value === "Dog";
    const questionScore = isCorrect ? 3 : 0;

    setUserResponses((prevResponses) => {
      const updatedResponses = [...prevResponses];
      updatedResponses[8] = { question: "Identify the animal in the image", answer_text: value, scored: questionScore };
      return updatedResponses;
    });

    setSelectedOptions((prev) => ({ ...prev, 8: value }));
    setScore((prevScore) => (isCorrect ? prevScore + 3 : prevScore));
  };

  const handleStraightLineResponse = (value) => {
    const isCorrect = value === "No";
    const questionScore = isCorrect ? 3 : 0;

    setUserResponses((prevResponses) => {
      const updatedResponses = [...prevResponses];
      updatedResponses[9] = { question: "Does the image contain a straight line?", answer_text: value, scored: questionScore };
      return updatedResponses;
    });

    setSelectedOptions((prev) => ({ ...prev, 9: value }));
    setScore((prevScore) => (isCorrect ? prevScore + 3 : prevScore));
  };

  const submithandler = async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      if (token) {
        const res = await axios.post(`${API_BASE_URL}/answers`, userResponses, { 
          headers: { Authorization: `Bearer ${token}` } 
        });
  
        if (res.status === 201) {
          let conditionMessage = "";
          if (score < 10) conditionMessage = "Your condition is severe.";
          else if (score >= 10 && score < 19) conditionMessage = "Your condition is Moderate.";
          else if (score >= 20 && score < 25) conditionMessage = "Your condition is Mild.";
          else if (score >= 25) conditionMessage = "Your condition is normal. No need to worry.";
  
          navigation.replace("AssessmentResult", { score, conditionMessage });
        }
      }
    } catch (err) {
      console.error("Error submitting assessment:", err.message);
      Alert.alert("Submission Failed", "There was an error submitting your assessment. Please try again.");
    }
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
        <Text style={{ fontSize: 24 * fontSizeMultiplier, fontWeight: "bold", color: colors.text, flex: 1 }}>
          Cognitive Assessment
        </Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 24, paddingBottom: 40 }}>
      <View style={{ marginBottom: 24 }}>
        <Text style={{ fontSize: 16 * fontSizeMultiplier, color: colors.textMuted, marginTop: 8 }}>
          Follow the prompts and answer the questions as best as you can.
        </Text>
      </View>

      <View style={{ height: 1, backgroundColor: colors.border, marginBottom: 24 }} />

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        posts.map((post, index) => (
          <View key={post.id} style={{ marginBottom: 32, backgroundColor: colors.card, padding: 20, borderRadius: 16, borderColor: colors.border, borderWidth: 1 }}>
            <Text style={{ fontSize: 18 * fontSizeMultiplier, fontWeight: "600", color: colors.text, marginBottom: 12 }}>
              Q{post.questionNumber}. Do you remember this memory?
            </Text>
            <Image source={{ uri: post.file }} style={{ width: "100%", height: 160, borderRadius: 12, marginBottom: 16 }} resizeMode="contain" />
            <View style={{ flexDirection: "row", gap: 16 }}>
              {["Yes", "No"].map((option) => {
                const isSelected = selectedOptions[index] === option;
                return (
                  <TouchableOpacity
                    key={option}
                    style={{
                      flex: 1, paddingVertical: 12, borderRadius: 12, borderWidth: 1,
                      borderColor: isSelected ? colors.primary : colors.border,
                      backgroundColor: isSelected ? colors.primary : colors.background,
                      alignItems: 'center'
                    }}
                    onPress={() => handleResponse("Do you remember this memory?", option, index)}
                  >
                    <Text style={{ fontSize: 18 * fontSizeMultiplier, fontWeight: "600", color: isSelected ? colors.white : colors.text }}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))
      )}

      {/* Render static questions with similar styling */}
      {[
        { q: "Q4. What shape is this?", img: require("./../assets/square_shape.png"), type: "radio", idx: 3, opts: ["Square", "Rectangle", "Triangle", "Circle"], correct: "Square" },
        { q: "Q6. Which option is the inverted version?", img: require("./../assets/inverted.png"), type: "radio", idx: 5, opts: ["A", "B", "C", "D"], correct: "B" },
        { q: "Q7. After how many years does a leap year come?", type: "radio", idx: 6, opts: ["2", "3", "4", "5"], correct: "4" },
        { q: "Q9. What animal is shown in the image?", img: require("./../assets/dog.png"), type: "radio", idx: 8, opts: ["Dog", "Cat", "Rabbit", "Elephant"], handler: handleAnimalResponse },
      ].map((item, i) => (
        <View key={item.idx} style={{ marginBottom: 32, backgroundColor: colors.card, padding: 20, borderRadius: 16, borderColor: colors.border, borderWidth: 1 }}>
          <Text style={{ fontSize: 18 * fontSizeMultiplier, fontWeight: "600", color: colors.text, marginBottom: 12 }}>
            {item.q}
          </Text>
          {item.img && <Image source={item.img} style={{ width: 120, height: 120, alignSelf: "center", marginBottom: 16 }} resizeMode="contain" />}
          
          {item.opts.map((option) => (
            <TouchableOpacity 
              key={option} 
              style={{ flexDirection: "row", alignItems: "center", marginBottom: 12, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 12, backgroundColor: selectedOptions[item.idx] === option ? colors.primaryLight : "transparent" }}
              onPress={() => item.handler ? item.handler(option) : handleResponse(item.q.replace(/Q\d+\. /,""), option, item.idx, item.correct)}
            >
              <RadioButton value={option} status={selectedOptions[item.idx] === option ? 'checked' : 'unchecked'} color={colors.primary} />
              <Text style={{ marginLeft: 8, fontSize: 18 * fontSizeMultiplier, fontWeight: selectedOptions[item.idx] === option ? "bold" : "normal", color: selectedOptions[item.idx] === option ? colors.primaryDark : colors.text }}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}

      <View style={{ marginBottom: 32, backgroundColor: colors.card, padding: 20, borderRadius: 16, borderColor: colors.border, borderWidth: 1 }}>
        <Text style={{ fontSize: 18 * fontSizeMultiplier, fontWeight: "600", color: colors.text, marginBottom: 12 }}>Q5. How many squares are in this image?</Text>
        <Image source={require("./../assets/square.png")} style={{ width: 120, height: 120, alignSelf: "center", marginBottom: 16 }} resizeMode="contain" />
        <TextInput
          style={{ borderWidth: 1, borderColor: colors.border, padding: 16, borderRadius: 12, fontSize: 18 * fontSizeMultiplier, color: colors.text, backgroundColor: colors.background }}
          keyboardType="numeric" maxLength={2} value={squareCount} onChangeText={handleSquareCountChange}
          placeholder="Enter a number between 0-10" placeholderTextColor={colors.textMuted}
        />
      </View>

      <View style={{ marginBottom: 32, backgroundColor: colors.card, padding: 20, borderRadius: 16, borderColor: colors.border, borderWidth: 1 }}>
        <Text style={{ fontSize: 18 * fontSizeMultiplier, fontWeight: "600", color: colors.text, marginBottom: 12 }}>Q8. Which day is today?</Text>
        <TextInput
          style={{ borderWidth: 1, borderColor: colors.border, padding: 16, borderRadius: 12, fontSize: 18 * fontSizeMultiplier, color: colors.text, backgroundColor: colors.background }}
          placeholder="Enter the day (e.g., Monday)" placeholderTextColor={colors.textMuted}
          onChangeText={handleDayResponse}
        />
      </View>

      <View style={{ marginBottom: 32, backgroundColor: colors.card, padding: 20, borderRadius: 16, borderColor: colors.border, borderWidth: 1 }}>
        <Text style={{ fontSize: 18 * fontSizeMultiplier, fontWeight: "600", color: colors.text, marginBottom: 12 }}>Q10. Does the image contain a straight line?</Text>
        <Image source={require("./../assets/straightline.png")} style={{ width: 120, height: 120, alignSelf: "center", marginBottom: 16 }} resizeMode="contain" />
        <View style={{ flexDirection: "row", gap: 16 }}>
          {["Yes", "No"].map((option) => {
            const isSelected = selectedOptions[9] === option;
            return (
              <TouchableOpacity
                key={option}
                style={{
                  flex: 1, paddingVertical: 12, borderRadius: 12, borderWidth: 1,
                  borderColor: isSelected ? colors.primary : colors.border,
                  backgroundColor: isSelected ? colors.primary : colors.background,
                  alignItems: 'center'
                }}
                onPress={() => handleStraightLineResponse(option)}
              >
                <Text style={{ fontSize: 18 * fontSizeMultiplier, fontWeight: "600", color: isSelected ? colors.white : colors.text }}>{option}</Text>
              </TouchableOpacity>
            )
          })}
        </View>
      </View>

      <TouchableOpacity style={{ backgroundColor: colors.primary, padding: 16, borderRadius: 12, alignItems: "center", marginBottom: 40 }} onPress={submithandler}>
        <Text style={{ color: colors.white, fontSize: 20 * fontSizeMultiplier, fontWeight: "bold" }}>Submit Assessment</Text>
      </TouchableOpacity>
    </ScrollView>
    </View>
  );
};

export default CognitiveAssessmentScreen;