import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Button, Card, theme } from '@qoncier/shared';
import { authService } from '../services/auth';
import { healthApi } from '@qoncier/shared';

const DashboardScreen: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [healthData, setHealthData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
    loadHealthData();
  }, []);

  const loadUserData = async () => {
    const result = await authService.getCurrentUser();
    if (result.success) {
      setUser(result.user);
    }
  };

  const loadHealthData = async () => {
    try {
      // This would make an actual API call in a real app
      // const result = await healthApi.getHealthData();
      // For demo purposes, using mock data
      setHealthData({
        bmi: 22.5,
        lastCheckup: '2024-01-15',
        medications: 3,
        symptoms: 0,
      });
    } catch (error) {
      console.error('Error loading health data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await authService.signOut();
    // Navigate back to welcome screen
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading your health dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Health Dashboard</Text>
          <Text style={styles.subtitle}>
            Welcome back, {user?.attributes?.email || 'User'}!
          </Text>
        </View>

        <View style={styles.stats}>
          <Card variant="elevated" padding="md" style={styles.statCard}>
            <Text style={styles.statValue}>{healthData?.bmi || '--'}</Text>
            <Text style={styles.statLabel}>BMI</Text>
          </Card>

          <Card variant="elevated" padding="md" style={styles.statCard}>
            <Text style={styles.statValue}>{healthData?.medications || 0}</Text>
            <Text style={styles.statLabel}>Medications</Text>
          </Card>

          <Card variant="elevated" padding="md" style={styles.statCard}>
            <Text style={styles.statValue}>{healthData?.symptoms || 0}</Text>
            <Text style={styles.statLabel}>Active Symptoms</Text>
          </Card>
        </View>

        <Card variant="elevated" padding="lg" style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <Button
            title="Log Symptoms"
            onPress={() => {}}
            variant="primary"
            style={styles.actionButton}
          />
          
          <Button
            title="Update Medications"
            onPress={() => {}}
            variant="secondary"
            style={styles.actionButton}
          />
          
          <Button
            title="Chat with AI Assistant"
            onPress={() => {}}
            variant="outline"
            style={styles.actionButton}
          />
        </Card>

        <Card variant="elevated" padding="lg" style={styles.recentActivity}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <Text style={styles.activityText}>
            Last health checkup: {healthData?.lastCheckup || 'Never'}
          </Text>
          <Text style={styles.activityText}>
            AI Assistant conversations: 12 this week
          </Text>
          <Text style={styles.activityText}>
            Medications logged: 8 times this month
          </Text>
        </Card>

        <Button
          title="Sign Out"
          onPress={handleSignOut}
          variant="ghost"
          style={styles.signOutButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text.secondary,
  },
  header: {
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xl,
    gap: theme.spacing.sm,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    minHeight: 80,
    justifyContent: 'center',
  },
  statValue: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  quickActions: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  actionButton: {
    marginBottom: theme.spacing.sm,
  },
  recentActivity: {
    marginBottom: theme.spacing.lg,
  },
  activityText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  signOutButton: {
    marginTop: theme.spacing.lg,
  },
});

export default DashboardScreen;
