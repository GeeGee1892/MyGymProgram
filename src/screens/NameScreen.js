import React from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView } from 'react-native';
import { Button, ProgressBar } from '../components';
import { useStore } from '../hooks/useStore';

const NameScreen = ({ navigation }) => {
  const { userData, setUserData } = useStore();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <ProgressBar current={1} total={5} />
        </View>

        <Text style={styles.title}>What's your name?</Text>
        <Text style={styles.subtitle}>
          We'll use this to personalize your experience.
        </Text>

        <TextInput
          style={styles.input}
          value={userData.name}
          onChangeText={(text) => setUserData({ name: text })}
          placeholder="Enter your name"
          placeholderTextColor="#52525b"
          autoFocus
          autoCapitalize="words"
        />
      </View>

      <View style={styles.footer}>
        <Button
          onPress={() => navigation.navigate('Stats')}
          disabled={!userData.name.trim()}
        >
          Continue
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#71717a',
    marginBottom: 32,
  },
  input: {
    backgroundColor: '#18181b',
    borderWidth: 1,
    borderColor: '#27272a',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 18,
    color: '#fff',
    fontWeight: '500',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
});

export default NameScreen;
