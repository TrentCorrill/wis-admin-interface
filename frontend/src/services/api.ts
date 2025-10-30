import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
