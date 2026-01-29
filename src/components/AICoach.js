import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useStore } from '../store';
import { spacing, colors, radius, fontSize, fontWeight } from '../utils/theme';
import { calcVolume, fmtDate } from '../utils';

export const AICoach = () => {
  const { userData, workoutHistory, dailyCheckIns, weeklyReviews } = useStore();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  // Initial greeting
  useEffect(() => {
    const greeting = {
      role: 'assistant',
      content: `Hey ${userData.name || 'there'}! 👋 I'm your AI coach. I can help you with:

• Analyzing your workout trends
• Suggesting when to deload
• Nutrition advice for your ${userData.goal} goal
• Form tips and injury prevention
• Program modifications

What would you like to know?`,
    };
    setMessages([greeting]);
  }, []);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  // Build context about user for AI
  const buildUserContext = () => {
    // Recent workouts
    const recentWorkouts = workoutHistory.slice(-5);
    const workoutSummary = recentWorkouts.map(w => ({
      type: w.type,
      date: fmtDate(w.date),
      volume: w.volume,
      sets: w.sets.length,
    }));

    // Weight trend (last 7 days)
    const recentWeight = dailyCheckIns
      .slice(-7)
      .map(c => ({ date: fmtDate(c.date), weight: c.weight }));

    // Weekly review
    const lastReview = weeklyReviews[weeklyReviews.length - 1];

    return {
      profile: {
        name: userData.name,
        age: userData.age,
        weight: userData.weight,
        height: userData.height,
        goal: userData.goal, // cut, bulk, maintain
        calories: userData.calories,
        protein: userData.protein,
      },
      recent_workouts: workoutSummary,
      weight_trend: recentWeight,
      last_weekly_review: lastReview,
    };
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const context = buildUserContext();

      // Call Claude API
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01',
          // NOTE: In production, API key should be in backend, not client
          // 'x-api-key': 'YOUR_API_KEY_HERE', // User needs to add their own
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: `You are a professional fitness coach helping a user with their workout tracking app.

Here is the user's current data:
${JSON.stringify(context, null, 2)}

Provide personalized, actionable advice based on their data. Be encouraging but honest. Focus on:
- Progressive overload and when to increase weight
- Recovery and deload weeks
- Nutrition for their goal (${userData.goal})
- Injury prevention
- Program balance

Keep responses concise (2-3 paragraphs max). Use emojis sparingly.`,
          messages: [
            ...messages.filter(m => m.role !== 'system'),
            userMessage,
          ],
        }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      const assistantMessage = {
        role: 'assistant',
        content: data.content[0].text,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('AI Coach error:', error);
      const errorMessage = {
        role: 'assistant',
        content: `Sorry, I encountered an error. This feature requires an API key to be configured.

In production, this would be handled securely on a backend server.

For now, I can help you with general fitness advice without the AI analysis. What would you like to know?`,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // Quick suggestion buttons
  const quickQuestions = [
    "Should I deload soon?",
    "Is my volume too high?",
    "Am I eating enough protein?",
    "How's my progress?",
  ];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      {/* Messages */}
      <ScrollView
        ref={scrollRef}
        style={styles.messages}
        contentContainerStyle={styles.messagesContent}
      >
        {messages.map((msg, i) => (
          <View
            key={i}
            style={[
              styles.message,
              msg.role === 'user' ? styles.messageUser : styles.messageAssistant,
            ]}
          >
            <Text style={styles.messageText}>{msg.content}</Text>
          </View>
        ))}

        {loading && (
          <View style={styles.loadingMessage}>
            <Text style={styles.loadingText}>Thinking...</Text>
          </View>
        )}
      </ScrollView>

      {/* Quick Questions */}
      {messages.length <= 1 && (
        <View style={styles.quickQuestions}>
          <Text style={styles.quickQuestionsLabel}>Quick questions:</Text>
          <View style={styles.quickQuestionsButtons}>
            {quickQuestions.map((q, i) => (
              <TouchableOpacity
                key={i}
                style={styles.quickButton}
                onPress={() => {
                  setInput(q);
                  // Auto-send after a brief delay
                  setTimeout(() => {
                    if (input === q) sendMessage();
                  }, 100);
                }}
              >
                <Text style={styles.quickButtonText}>{q}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Ask your coach anything..."
          placeholderTextColor="#52525b"
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendButton, (!input.trim() || loading) && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={!input.trim() || loading}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  messages: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  message: {
    maxWidth: '80%',
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
  },
  messageUser: {
    alignSelf: 'flex-end',
    backgroundColor: '#10b981',
  },
  messageAssistant: {
    alignSelf: 'flex-start',
    backgroundColor: '#18181b',
    borderWidth: 1,
    borderColor: '#27272a',
  },
  messageText: {
    fontSize: 16,
    color: '#fff',
    lineHeight: 22,
  },
  loadingMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#18181b',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  loadingText: {
    fontSize: 16,
    color: '#a1a1aa',
    fontStyle: 'italic',
  },
  quickQuestions: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#27272a',
  },
  quickQuestionsLabel: {
    fontSize: 12,
    color: '#a1a1aa',
    marginBottom: 8,
    fontWeight: '500',
  },
  quickQuestionsButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickButton: {
    backgroundColor: '#18181b',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  quickButtonText: {
    fontSize: 12,
    color: '#d4d4d8',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#27272a',
    backgroundColor: '#000',
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: '#18181b',
    borderWidth: 1,
    borderColor: '#27272a',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#fff',
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
});
