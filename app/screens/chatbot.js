import { useState, useRef, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Keyboard, TouchableWithoutFeedback, ScrollView, ActivityIndicator } from "react-native";
import axios from "axios";

const ChatbotScreen = () => {
    const [question, setQuestion] = useState("");
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const scrollViewRef = useRef(null);

    useEffect(() => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated: true });
        }
    }, [messages]);

    const handleAskQuestion = async () => {
        Keyboard.dismiss();
        setError("");

        if (!question.trim()) return setError("Please enter a question.");

        const userMessage = { text: question, sender: "user" };
        setMessages((prevMessages) => [...prevMessages, userMessage]);
        setQuestion("");
        setLoading(true);

        try {
            const res = await axios.post("https://life-path-flask.onrender.com/gen_ai", {
                message: question
            });
            
            if (res.status === 200) {
                const botMessage = { text: res.data.message || "No response received.", sender: "bot" };
                setMessages((prevMessages) => [...prevMessages, botMessage]);
            } else {
                setError("Failed to fetch response. Try again.");
            }
        } catch (err) {
            console.log(err);
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className="flex-1 bg-white px-6 py-4 mt-20">
             
                {/* Heading */}
                <Text className="text-4xl font-bold text-gray-800 mb-4 self-center">AI Chatbot</Text>
                
                {/* Chat Window */}
                <View className="flex-1 bg-gray-100 p-4 rounded-2xl mb-4" style={{ maxHeight: "80%" }}>
                    <ScrollView 
                        ref={scrollViewRef} 
                        contentContainerStyle={{ flexGrow: 1 }}
                        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
                    >
                        {messages.map((msg, index) => (
                            <View 
                                key={index} 
                                className={`mb-2 p-3 rounded-xl max-w-[80%] ${msg.sender === 'user' ? 'bg-blue-500 self-end' : 'bg-gray-300 self-start'}`}
                            >
                                <Text className={`${msg.sender === 'user' ? 'text-white' : 'text-black'} text-lg`}>{msg.text}</Text>
                            </View>
                        ))}
                        {loading && (
                            <ActivityIndicator size="large" color="#0000ff" className="self-center mt-2" />
                        )}
                    </ScrollView>
                </View>

                {/* Error Message */}
                {error ? <Text className="text-red-500 mb-3 text-lg">{error}</Text> : null}
                
                {/* Input Area */}
                <View className="flex-row items-center gap-2 bg-gray-100 p-3 rounded-2xl">
                    <TextInput
                        className="flex-1 p-2 bg-white rounded-lg text-lg"
                        placeholder="Enter your question"
                        value={question}
                        onChangeText={setQuestion}
                    />
                    <TouchableOpacity
                        className="bg-black p-3 rounded-lg"
                        onPress={handleAskQuestion}
                        disabled={loading}
                    >
                        <Text className="text-white font-semibold text-lg">{loading ? "Loading..." : "Send"}</Text>
                    </TouchableOpacity>
                </View>
                
            </View>
        </TouchableWithoutFeedback>
    );
};

export default ChatbotScreen;