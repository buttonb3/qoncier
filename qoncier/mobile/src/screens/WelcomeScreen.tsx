import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, Card, theme } from '@qoncier/shared';

const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation();

  const handleGetStarted = () => {
    navigation.navigate('Login' as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Card variant="elevated" padding="lg" style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>Welcome to Qoncier</Text>
            <Text style={styles.phonetic}>(KON-see-air)</Text>
            <Text style={styles.subtitle}>
              Your AI-powered personal health assistant
            </Text>
          </View>

          <View style={styles.features}>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>🤖</Text>
              <Text style={styles.featureTitle}>AI Health Assistant</Text>
              <Text style={styles.featureDescription}>
                Get personalized health guidance 24/7
              </Text>
            </View>

            <View style={styles.feature}>
              <Text style={styles.featureIcon}>📊</Text>
              <Text style={styles.featureTitle}>Comprehensive Tracking</Text>
              <Text style={styles.featureDescription}>
                Monitor symptoms, medications, and nutrition
              </Text>
            </View>

            <View style={styles.feature}>
              <Text style={styles.featureIcon}>🏆</Text>
              <Text style={styles.featureTitle}>Gamified Wellness</Text>
              <Text style={styles.featureDescription}>
                Achieve health goals with rewards and insights
              </Text>
            </View>
          </View>

          <View style={styles.quote}>
            <Text style={styles.quoteText}>
              "People don't care how much you know until they know how much you care." — Author unknown
            </Text>
            <Text style={styles.qoncierText}>
              At Qoncier, your story is the foundation, science is the support.
            </Text>
          </View>
        </Card>
      </View>

      <View style={styles.footer}>
        <Text style={styles.setupText}>⏱️ Setup takes about 5 minutes</Text>
        <Button
          title="Get Started"
          onPress={handleGetStarted}
          variant="primary"
          size="lg"
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
    justifyContent: 'center',
  },
  card: {
    marginBottom: theme.spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  phonetic: {
    fontSize: theme.typography.fontSize.sm,
    fontStyle: 'italic',
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  features: {
    marginBottom: theme.spacing.xl,
  },
  feature: {
    backgroundColor: theme.colors.background.tertiary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: theme.typography.fontSize['2xl'],
    marginBottom: theme.spacing.sm,
  },
  featureTitle: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  featureDescription: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  quote: {
    marginTop: theme.spacing.lg,
    alignItems: 'center',
  },
  quoteText: {
    fontSize: theme.typography.fontSize.sm,
    fontStyle: 'italic',
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  qoncierText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  footer: {
    padding: theme.spacing.lg,
  },
  setupText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  button: {
    width: '100%',
  },
});

export default WelcomeScreen;
