import { Amplify } from 'aws-amplify';
import { Auth } from 'aws-amplify';

export interface ApiConfig {
  region: string;
  userPoolId: string;
  userPoolWebClientId: string;
  apiGatewayUrl: string;
}

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

class ApiClient {
  private baseUrl: string;
  private isConfigured = false;

  constructor() {
    this.baseUrl = process.env.API_GATEWAY_URL || 'https://api.qoncier.com';
  }

  configure(config: ApiConfig) {
    Amplify.configure({
      Auth: {
        region: config.region,
        userPoolId: config.userPoolId,
        userPoolWebClientId: config.userPoolWebClientId,
      },
    });
    
    this.baseUrl = config.apiGatewayUrl;
    this.isConfigured = true;
  }

  private async getAuthToken(): Promise<string> {
    if (!this.isConfigured) {
      throw new Error('API client not configured. Call configure() first.');
    }

    try {
      const session = await Auth.currentSession();
      return session.getIdToken().getJwtToken();
    } catch (error) {
      throw new Error('Unable to get authentication token');
    }
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const token = await this.getAuthToken();
      
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw {
          message: data.message || 'Request failed',
          status: response.status,
          code: data.code,
        } as ApiError;
      }

      return {
        data,
        status: response.status,
        message: data.message,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw {
          message: error.message,
          status: 500,
        } as ApiError;
      }
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'DELETE' });
  }

  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

export const apiClient = new ApiClient();

// Health API endpoints
export const healthApi = {
  // User profile
  getProfile: () => apiClient.get('/health/profile'),
  updateProfile: (data: any) => apiClient.put('/health/profile', data),
  
  // Health data
  getHealthData: () => apiClient.get('/health/data'),
  updateHealthData: (data: any) => apiClient.put('/health/data', data),
  
  // Medications
  getMedications: () => apiClient.get('/health/medications'),
  addMedication: (data: any) => apiClient.post('/health/medications', data),
  updateMedication: (id: string, data: any) => apiClient.put(`/health/medications/${id}`, data),
  deleteMedication: (id: string) => apiClient.delete(`/health/medications/${id}`),
  
  // Symptoms tracking
  getSymptoms: () => apiClient.get('/health/symptoms'),
  logSymptom: (data: any) => apiClient.post('/health/symptoms', data),
  
  // AI Assistant
  chatWithAssistant: (message: string) => apiClient.post('/ai/chat', { message }),
  getChatHistory: () => apiClient.get('/ai/chat/history'),
};

export default apiClient;
