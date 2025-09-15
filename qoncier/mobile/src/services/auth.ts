import { Amplify } from 'aws-amplify';
import { Auth } from 'aws-amplify';
import Constants from 'expo-constants';

export interface AuthConfig {
  region: string;
  userPoolId: string;
  userPoolWebClientId: string;
}

export const configureAuth = () => {
  const config: AuthConfig = {
    region: Constants.expoConfig?.extra?.awsRegion || 'us-east-1',
    userPoolId: Constants.expoConfig?.extra?.userPoolId || 'us-east-1_placeholder',
    userPoolWebClientId: Constants.expoConfig?.extra?.userPoolWebClientId || 'placeholder',
  };

  Amplify.configure({
    Auth: {
      region: config.region,
      userPoolId: config.userPoolId,
      userPoolWebClientId: config.userPoolWebClientId,
    },
  });

  return config;
};

export const authService = {
  async signIn(email: string, password: string) {
    try {
      const user = await Auth.signIn(email, password);
      return { success: true, user };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  async signUp(email: string, password: string, attributes: Record<string, string> = {}) {
    try {
      const result = await Auth.signUp({
        username: email,
        password,
        attributes,
      });
      return { success: true, result };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  async signOut() {
    try {
      await Auth.signOut();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  async getCurrentUser() {
    try {
      const user = await Auth.currentAuthenticatedUser();
      return { success: true, user };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  async confirmSignUp(email: string, code: string) {
    try {
      await Auth.confirmSignUp(email, code);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },
};
