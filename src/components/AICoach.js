import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useStore } from '../../store';
import { spacing, colors, radius, fontSize, fontWeight } from '../../utils/theme';
import { calcVolume, fmtDate } from '../../utils';

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
          system: `You are a professional fitness coach helping a user with their workout tracking app. Here is the user's current data:

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
        content: `Sorry, I encountered an error. This feature requires an API key to be configured. In production, this would be handled securely on a backend server.

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
          placeholderTextColor={colors.textDisabled}
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
    backgroundColor: colors.background,
  },
  messages: {
    flex: 1,
  },
  messagesContent: {
    padding: spacing.lg,
  },
  message: {
    maxWidth: '80%',
    marginBottom: spacing.lg,
    padding: spacing.lg,
    borderRadius: radius.md,
  },
  messageUser: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
  },
  messageAssistant: {
    alignSelf: 'flex-start',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  messageText: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  loadingMessage: {
    alignSelf: 'flex-start',
    backgroundColor: colors.card,
    padding: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  loadingText: {
    fontSize: fontSize.md,
    color: colors.textTertiary,
    fontStyle: 'italic',
  },
  quickQuestions: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  quickQuestionsLabel: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
    marginBottom: spacing.sm,
    fontWeight: fontWeight.medium,
  },
  quickQuestionsButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  quickButton: {
    backgroundColor: colors.card,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickButtonText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
    gap: spacing.md,
  },
  input: {
    flex: 1,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.lg,
    fontSize: fontSize.md,
    color: colors.textPrimary,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderRadius: radius.md,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.background,
  },
});
