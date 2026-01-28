import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Button, ProgressBar } from '../components';
import { useStore } from '../hooks/useStore';

const StatsScreen = ({ navigation }) => {
  const { userData, setUserData } = useStore();
  
  const isValid = userData.sex && userData.age && userData.height && userData.weight && userData.targetWeight;

  const fields = [
    { key: 'age', label: 'Age', unit: 'years', placeholder: '25' },
    { key: 'height', label: 'Height', unit: 'cm', placeholder: '175' },
    { key: 'weight', label: 'Current weight', unit: 'kg', placeholder: '85' },
    { key: 'targetWeight', label: 'Target weight', unit: 'kg', placeholder: '82' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <ProgressBar current={2} total={5} />
        </View>

        <Text style={styles.title}>Your stats</Text>
        <Text style={styles.subtitle}>Used to calculate your targets.</Text>

        {/* Sex Selection */}
        <Text style={styles.label}>Sex</Text>
        <View style={styles.sexContainer}>
          {['male', 'female'].map((sex) => (
            <TouchableOpacity
              key={sex}
              style={[styles.sexButton, userData.sex === sex && styles.sexButtonActive]}
              onPress={() => setUserData({ sex })}
            >
              <Text style={[styles.sexText, userData.sex === sex && styles.sexTextActive]}>
                {sex.charAt(0).toUpperCase() + sex.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Number Fields */}
        {fields.map((field) => (
          <View key={field.key} style={styles.fieldContainer}>
            <Text style={styles.label}>{field.label}</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={userData[field.key]}
                onChangeText={(text) => setUserData({ [field.key]: text })}
                placeholder={field.placeholder}
                placeholderTextColor="#52525b"
                keyboardType="numeric"
              />
              <Text style={styles.unit}>{field.unit}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <Button onPress={() => navigation.navigate('Goal')} disabled={!isValid}>
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
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: '#71717a',
    marginBottom: 8,
  },
  sexContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  sexButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#27272a',
    alignItems: 'center',
  },
  sexButtonActive: {
    backgroundColor: '#fff',
    borderColor: '#fff',
  },
  sexText: {
    color: '#a1a1aa',
    fontWeight: '500',
    fontSize: 16,
  },
  sexTextActive: {
    color: '#000',
  },
  fieldContainer: {
    marginBottom: 20,
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    backgroundColor: '#18181b',
    borderWidth: 1,
    borderColor: '#27272a',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 18,
    color: '#fff',
    fontWeight: '500',
  },
  unit: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -8 }],
    color: '#52525b',
    fontSize: 14,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 16,
  },
});

export default StatsScreen;
