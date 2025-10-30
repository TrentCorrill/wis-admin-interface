import axios, { InternalAxiosRequestConfig } from 'axios';
import { PublicClientApplication } from '@azure/msal-browser';
import { loginRequest } from '../authConfig';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to configure the API client with MSAL authentication
export const configureApiClient = (msalInstance: PublicClientApplication) => {
  // Add request interceptor to attach bearer token
  apiClient.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      const accounts = msalInstance.getAllAccounts();

      if (accounts.length > 0) {
        try {
          // Silently acquire token
          const response = await msalInstance.acquireTokenSilent({
            ...loginRequest,
            account: accounts[0],
          });

          // Add token to request headers
          if (config.headers) {
            config.headers.Authorization = `Bearer ${response.accessToken}`;
          }
        } catch (error) {
          console.error('Failed to acquire token silently:', error);
          // Could trigger interactive login here if needed
        }
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};

export interface Customer {
  id: string;
  phone: string;
  email?: string;
  name?: string;
  subscriptionStatus?: string;
  currentSeason?: string;
  createdAt: string;
  lastActivityAt?: string;
  messageCount: number;
}

export interface Message {
  id: string;
  customerId: string;
  conversationId?: string;
  direction: string;
  content: string;
  messageType?: string;
  status?: string;
  timestamp: string;
  from?: string;
  to?: string;
}

export interface Conversation {
  customer: Customer;
  messages: Message[];
  totalMessages: number;
}

export const customerAPI = {
  getAll: async (): Promise<Customer[]> => {
    const response = await apiClient.get('/customers');
    return response.data;
  },

  getById: async (id: string): Promise<Customer> => {
    const response = await apiClient.get(`/customers/${id}`);
    return response.data;
  },

  search: async (query: string): Promise<Customer[]> => {
    const response = await apiClient.get(`/customers/search?query=${encodeURIComponent(query)}`);
    return response.data;
  },

  getByPhone: async (phone: string): Promise<Customer[]> => {
    const response = await apiClient.get(`/customers/by-phone/${phone}`);
    return response.data;
  },
};

export const messageAPI = {
  getCustomerMessages: async (customerId: string): Promise<Conversation> => {
    const response = await apiClient.get(`/messages/customer/${customerId}`);
    return response.data;
  },

  searchMessages: async (query: string): Promise<Message[]> => {
    const response = await apiClient.get(`/messages/search?query=${encodeURIComponent(query)}`);
    return response.data;
  },

  getMessagesByDateRange: async (
    customerId: string,
    startDate: string,
    endDate: string
  ): Promise<Message[]> => {
    const response = await apiClient.get(
      `/messages/customer/${customerId}/range?startDate=${startDate}&endDate=${endDate}`
    );
    return response.data;
  },
};

export default apiClient;
