import { useState, useRef, useEffect } from "react";
import { 
    View, Text, TextInput, TouchableOpacity, Keyboard, 
    TouchableWithoutFeedback, ScrollView, ActivityIndicator, Platform, KeyboardAvoidingView 
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Send, Bot, User, ChevronLeft } from "lucide-react-native";
import { API_BASE_URL } from "../config/api";
import { useTheme } from "../context/ThemeContext";

const ChatbotScreen = ({ navigation }) => {
    const { colors, fontSizeMultiplier } = useTheme();
    const [question, setQuestion] = useState("");
    const [messages, setMessages] = useState([
        { text: "Hi! How can I help you today?", sender: "bot", id: Date.now() }
    ]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const scrollViewRef = useRef(null);

    useEffect(() => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated: true });
        }
    }, [messages]);

    const handleAskQuestion = async () => {
        if (!question.trim()) return;

        Keyboard.dismiss();
        setError("");

        const userMsgText = question.trim();
        const userMessage = { text: userMsgText, sender: "user", id: Date.now() };
        setMessages((prevMessages) => [...prevMessages, userMessage]);
        setQuestion("");
        setLoading(true);

        try {
            const token = await AsyncStorage.getItem("access_token");
            const res = await axios.post(
                `${API_BASE_URL}/gen_ai`,
                { message: userMsgText },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (res.status === 200) {
                const botMessage = { text: res.data.message || "No response received.", sender: "bot", id: Date.now() + 1 };
                setMessages((prevMessages) => [...prevMessages, botMessage]);
            } else {
                setMessages((prevMessages) => [...prevMessages, { text: "Failed to fetch response.", sender: "bot", id: Date.now() + 1, isError: true }]);
            }
        } catch (err) {
            console.log(err);
            setMessages((prevMessages) => [...prevMessages, { text: "Something went wrong. Please check your connection.", sender: "bot", id: Date.now() + 1, isError: true }]);
        } finally {
            setLoading(false);
            if (scrollViewRef.current) setTimeout(() => scrollViewRef.current.scrollToEnd({ animated: true }), 100);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                
                {/* Header */}
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingBottom: 16, borderBottomWidth: 1, borderColor: colors.border, paddingTop: 40 }}>
                    <TouchableOpacity 
                        style={{ padding: 8, backgroundColor: colors.card, borderRadius: 20, borderWidth: 1, borderColor: colors.border, marginRight: 16 }} 
                        onPress={() => navigation.goBack()}
                    >
                        <ChevronLeft size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 24 * fontSizeMultiplier, fontWeight: 'bold', color: colors.text, flex: 1 }}>
                        Care Taker Assistant
                    </Text>
                </View>
                
                {/* Chat Window */}
                <ScrollView 
                    ref={scrollViewRef} 
                    contentContainerStyle={{ flexGrow: 1, padding: 16 }}
                    onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
                >
                    {messages.map((msg, index) => {
                        const isBot = msg.sender === 'bot';
                        return (
                            <View key={msg.id} style={{ 
                                flexDirection: isBot ? 'row' : 'row-reverse',
                                alignItems: 'flex-end',
                                marginBottom: 16 
                            }}>
                                {/* Avatar */}
                                <View style={{ 
                                    width: 32, height: 32, borderRadius: 16, 
                                    backgroundColor: isBot ? colors.primaryLight : colors.card,
                                    marginRight: isBot ? 8 : 0,
                                    marginLeft: isBot ? 0 : 8,
                                    justifyContent: 'center', alignItems: 'center',
                                    borderWidth: 1, borderColor: colors.border
                                }}>
                                    {isBot ? <Bot size={18} color={colors.primaryDark} /> : <User size={18} color={colors.textMuted} />}
                                </View>

                                {/* Message Bubble */}
                                <View style={{
                                    maxWidth: '75%',
                                    backgroundColor: isBot ? colors.card : colors.primary,
                                    paddingVertical: 12, paddingHorizontal: 16,
                                    borderRadius: 20,
                                    borderBottomLeftRadius: isBot ? 4 : 20,
                                    borderBottomRightRadius: isBot ? 20 : 4,
                                    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2,
                                    borderWidth: isBot ? 1 : 0, borderColor: colors.border
                                }}>
                                    <Text style={{ 
                                        color: isBot ? (msg.isError ? colors.danger : colors.text) : colors.white, 
                                        fontSize: 16 * fontSizeMultiplier,
                                        lineHeight: 24 * fontSizeMultiplier
                                    }}>
                                        {msg.text}
                                    </Text>
                                </View>
                            </View>
                        );
                    })}

                    {loading && (
                        <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginBottom: 16 }}>
                            <View style={{ 
                                width: 32, height: 32, borderRadius: 16, backgroundColor: colors.primaryLight,
                                marginRight: 8, justifyContent: 'center', alignItems: 'center',
                                borderWidth: 1, borderColor: colors.border
                            }}>
                                <Bot size={18} color={colors.primaryDark} />
                            </View>
                            <View style={{
                                backgroundColor: colors.card, paddingVertical: 14, paddingHorizontal: 16,
                                borderRadius: 20, borderBottomLeftRadius: 4, borderWidth: 1, borderColor: colors.border
                            }}>
                                <ActivityIndicator size="small" color={colors.primary} />
                            </View>
                        </View>
                    )}
                </ScrollView>

                {/* Input Area */}
                <View style={{ 
                    flexDirection: 'row', alignItems: 'center', padding: 12, paddingBottom: Platform.OS === 'ios' ? 24 : 12,
                    backgroundColor: colors.card, borderTopWidth: 1, borderColor: colors.border
                }}>
                    <TextInput
                        style={{
                            flex: 1, minHeight: 48, maxHeight: 120,
                            backgroundColor: colors.background, color: colors.text, 
                            borderRadius: 24, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 14,
                            fontSize: 16 * fontSizeMultiplier, borderWidth: 1, borderColor: colors.border
                        }}
                        placeholder="Type a message..."
                        placeholderTextColor={colors.textMuted}
                        value={question}
                        onChangeText={setQuestion}
                        multiline
                    />
                    <TouchableOpacity
                        style={{ 
                            width: 48, height: 48, borderRadius: 24, backgroundColor: colors.primary, 
                            justifyContent: 'center', alignItems: 'center', marginLeft: 8,
                            opacity: question.trim() ? 1 : 0.6
                        }}
                        onPress={handleAskQuestion}
                        disabled={loading || !question.trim()}
                    >
                        <Send size={20} color={colors.white} style={{ marginLeft: 2 }} />
                    </TouchableOpacity>
                </View>

                </View>

            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default ChatbotScreen;