import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Button } from '../components';

const WelcomeScreen = ({ navigation }) => {
  const features = [
    'Log sets, reps & weight',
    'Swap exercises on the fly',
    'Track PRs & progress',
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>K</Text>
          </View>
          <View>
            <Text style={styles.title}>KEYSTONE</Text>
            <Text style={styles.subtitle}>FITNESS</Text>
          </View>
        </View>

        {/* Headline */}
        <Text style={styles.headline}>
          Track your lifts.{'\n'}
          <Text style={styles.headlineFaded}>See your progress.</Text>
        </Text>
        <Text style={styles.description}>
          Simple workout tracking with smart suggestions.
        </Text>

        {/* Features */}
        <View style={styles.features}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureRow}>
              <View style={styles.dot} />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <Button onPress={() => navigation.navigate('Name')}>
          Get Started
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
    paddingTop: 60,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 48,
  },
  logo: {
    width: 48,
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: '#000',
    fontSize: 20,
    fontWeight: '900',
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 1,
  },
  subtitle: {
    color: '#71717a',
    fontSize: 10,
    letterSpacing: 4,
  },
  headline: {
    fontSize: 36,
    fontWeight: '700',
    color: '#fff',
    lineHeight: 44,
    marginBottom: 16,
  },
  headlineFaded: {
    color: '#71717a',
  },
  description: {
    fontSize: 18,
    color: '#71717a',
    marginBottom: 48,
  },
  features: {
    gap: 16,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
  },
  featureText: {
    color: '#fff',
    fontSize: 16,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
});

export default WelcomeScreen;
