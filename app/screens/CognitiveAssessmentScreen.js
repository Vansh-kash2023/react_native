import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";

const CognitiveAssessmentScreen = () => {
  return (
    <ScrollView className="flex-1 bg-white p-6">
        <View className="mt-20">
      {/* Header Section */}
      <View className="mb-6">
        <Text className="text-3xl font-bold text-gray-900 mb-2">
          Cognitive Assessment
        </Text>
        <Text className="text-base text-gray-700">
          Follow the prompts and answer the questions as best as you can.
        </Text>
      </View>

      {/* Divider */}
      <View className="h-[1px] bg-gray-300 my-4" />

      {/* Question 1 */}
      <View className="mb-6">
        <Text className="text-lg font-medium text-gray-800 mb-2">
          Question 1:
        </Text>
        <TextInput
          placeholder="Enter your answer"
          className="w-full p-3 bg-gray-100 rounded-2xl mb-3"
        />
      </View>

      {/* Question 2 */}
      <View className="mb-6">
        <Text className="text-lg font-medium text-gray-800 mb-2">
          Question 2:
        </Text>
        <TextInput
          placeholder="Enter your answer"
          className="w-full p-3 bg-gray-100 rounded-2xl mb-3"
          multiline
        />
      </View>

      {/* Question 3 */}
      <View className="mb-6">
        <Text className="text-lg font-medium text-gray-800 mb-2">
          Question 3:
        </Text>
        <TextInput
          placeholder="Enter your answer"
          className="w-full p-3 bg-gray-100 rounded-2xl mb-3"
        />
      </View>

      {/* Next Question Button */}
      <TouchableOpacity className="bg-black py-3 rounded-lg items-center">
        <Text className="text-white text-base">Next Question</Text>
      </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default CognitiveAssessmentScreen;
