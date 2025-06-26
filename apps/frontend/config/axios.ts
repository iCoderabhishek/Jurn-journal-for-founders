import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
const API_VERSION = '/api/v1';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}${API_VERSION}`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// // Response interceptor for error handling
// apiClient.interceptors.response.use(
//   (response: AxiosResponse) => {
//     return response;
//   },
//   (error) => {
//     if (error.response?.status === 401) {
//       // Handle unauthorized access
//       localStorage.removeItem('authToken');
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  theme: string;
  timezone: string;
  reminderEnabled: boolean;
  reminderTime?: string;
  totalEntries: number;
  currentStreak: number;
  longestStreak: number;
  joinedDate: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    entries: number;
    goals: number;
    tags: number;
  };
}

// Entry Types
export interface Entry {
  id: string;
  title: string;
  content: string;
  mood?: string;
  wordCount: number;
  readingTime?: number;
  isPrivate: boolean;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
  entryTags: EntryTag[];
}

export interface EntryTag {
  id: string;
  entryId: string;
  tagId: string;
  tag: Tag;
}

export interface Tag {
  id: string;
  name: string;
  color?: string;
  createdAt: string;
  userId: string;
  _count?: {
    entryTags: number;
  };
}

// Goal Types
export interface Goal {
  id: string;
  title: string;
  description?: string;
  category: string;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  targetDate?: string;
  progress: number;
  targetValue?: number;
  currentValue: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

// Milestone Types
export interface Milestone {
  id: string;
  title: string;
  description?: string;
  type: 'streak' | 'entries' | 'words' | 'custom';
  achieved: boolean;
  achievedAt?: string;
  targetValue?: number;
  currentValue: number;
  createdAt: string;
  userId: string;
}

// Mood Entry Types
export interface MoodEntry {
  id: string;
  mood: string;
  intensity: number;
  notes?: string;
  triggers: string[];
  activities: string[];
  createdAt: string;
  userId: string;
}

// Insight Types
export interface Insight {
  id: string;
  type: 'pattern' | 'emotional' | 'growth' | 'recommendation';
  title: string;
  content: string;
  confidence: number;
  timeframe?: string;
  category?: string;
  createdAt: string;
  userId: string;
}

// AI Query Types
export interface AIQuery {
  id: string;
  question: string;
  response?: string;
  status: 'pending' | 'completed' | 'failed';
  category?: string;
  confidence?: number;
  createdAt: string;
  userId: string;
}

// Quote Types
export interface Quote {
  id: string;
  text: string;
  author: string;
  category?: string;
  dayOfWeek?: number;
  isActive: boolean;
  createdAt: string;
}

// Analytics Types
export interface Analytics {
  entries: {
    total: number;
    recent: number;
  };
  words: {
    total: number;
  };
  moods: Array<{
    mood: string;
    _count: number;
  }>;
  goals: Array<{
    status: string;
    _count: number;
  }>;
  timeframe: string;
}

// Request parameter types
export interface GetEntriesParams {
  page?: number;
  limit?: number;
  search?: string;
  mood?: string;
  isFavorite?: boolean;
}

export interface CreateEntryData {
  title: string;
  content: string;
  mood?: string;
  isPrivate?: boolean;
  isFavorite?: boolean;
  tagIds?: string[];
}

export interface CreateTagData {
  name: string;
  color?: string;
}

export interface CreateGoalData {
  title: string;
  description?: string;
  category: string;
  priority?: string;
  targetDate?: string;
  targetValue?: number;
}

export interface CreateMilestoneData {
  title: string;
  description?: string;
  type: string;
  targetValue?: number;
}

export interface CreateMoodData {
  mood: string;
  intensity?: number;
  notes?: string;
  triggers?: string[];
  activities?: string[];
}

export interface CreateAIQueryData {
  question: string;
  category?: string;
}

export interface GetMoodsParams {
  startDate?: string;
  endDate?: string;
  limit?: number;
}

export interface GetGoalsParams {
  status?: string;
  category?: string;
}

export interface GetMilestonesParams {
  achieved?: boolean;
}

export interface GetInsightsParams {
  type?: string;
  category?: string;
  timeframe?: string;
}

export interface GetAIQueriesParams {
  status?: string;
  category?: string;
}

export interface GetAnalyticsParams {
  timeframe?: 'week' | 'month' | 'year';
}

// =============================================================================
// USER API CALLS
// =============================================================================

export const userAPI = {
  // Get current user profile
  getProfile: async (): Promise<ApiResponse<User>> => {
    const response = await apiClient.get('/user/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (data: Partial<User>): Promise<ApiResponse<User>> => {
    const response = await apiClient.put('/user/profile', data);
    return response.data;
  },
};

// =============================================================================
// ENTRY API CALLS
// =============================================================================

export const entryAPI = {
  // Get all entries
  getEntries: async (params?: GetEntriesParams): Promise<ApiResponse<Entry[]>> => {
    const response = await apiClient.get('/entries', { params });
    return response.data;
  },

  // Get single entry
  getEntry: async (id: string): Promise<ApiResponse<Entry>> => {
    const response = await apiClient.get(`/entries/${id}`);
    return response.data;
  },

  // Create new entry
  createEntry: async (data: CreateEntryData): Promise<ApiResponse<Entry>> => {
    const response = await apiClient.post('/entries', data);
    return response.data;
  },

  // Update entry
  updateEntry: async (id: string, data: Partial<Entry>): Promise<ApiResponse<Entry>> => {
    const response = await apiClient.put(`/entries/${id}`, data);
    return response.data;
  },

  // Delete entry
  deleteEntry: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`/entries/${id}`);
    return response.data;
  },
};

// =============================================================================
// TAG API CALLS
// =============================================================================

export const tagAPI = {
  // Get all tags
  getTags: async (): Promise<ApiResponse<Tag[]>> => {
    const response = await apiClient.get('/tags');
    return response.data;
  },

  // Create new tag
  createTag: async (data: CreateTagData): Promise<ApiResponse<Tag>> => {
    const response = await apiClient.post('/tags', data);
    return response.data;
  },

  // Update tag
  updateTag: async (id: string, data: Partial<Tag>): Promise<ApiResponse<Tag>> => {
    const response = await apiClient.put(`/tags/${id}`, data);
    return response.data;
  },

  // Delete tag
  deleteTag: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`/tags/${id}`);
    return response.data;
  },
};

// =============================================================================
// GOAL API CALLS
// =============================================================================

export const goalAPI = {
  // Get all goals
  getGoals: async (params?: GetGoalsParams): Promise<ApiResponse<Goal[]>> => {
    const response = await apiClient.get('/goals', { params });
    return response.data;
  },

  // Create new goal
  createGoal: async (data: CreateGoalData): Promise<ApiResponse<Goal>> => {
    const response = await apiClient.post('/goals', data);
    return response.data;
  },

  // Update goal
  updateGoal: async (id: string, data: Partial<Goal>): Promise<ApiResponse<Goal>> => {
    const response = await apiClient.put(`/goals/${id}`, data);
    return response.data;
  },

  // Delete goal
  deleteGoal: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`/goals/${id}`);
    return response.data;
  },
};

// =============================================================================
// MILESTONE API CALLS
// =============================================================================

export const milestoneAPI = {
  // Get all milestones
  getMilestones: async (params?: GetMilestonesParams): Promise<ApiResponse<Milestone[]>> => {
    const response = await apiClient.get('/milestones', { params });
    return response.data;
  },

  // Create new milestone
  createMilestone: async (data: CreateMilestoneData): Promise<ApiResponse<Milestone>> => {
    const response = await apiClient.post('/milestones', data);
    return response.data;
  },

  // Update milestone
  updateMilestone: async (id: string, data: Partial<Milestone>): Promise<ApiResponse<Milestone>> => {
    const response = await apiClient.put(`/milestones/${id}`, data);
    return response.data;
  },
};

// =============================================================================
// MOOD API CALLS
// =============================================================================

export const moodAPI = {
  // Get mood entries
  getMoods: async (params?: GetMoodsParams): Promise<ApiResponse<MoodEntry[]>> => {
    const response = await apiClient.get('/moods', { params });
    return response.data;
  },

  // Create mood entry
  createMood: async (data: CreateMoodData): Promise<ApiResponse<MoodEntry>> => {
    const response = await apiClient.post('/moods', data);
    return response.data;
  },
};

// =============================================================================
// INSIGHT API CALLS
// =============================================================================

export const insightAPI = {
  // Get insights
  getInsights: async (params?: GetInsightsParams): Promise<ApiResponse<Insight[]>> => {
    const response = await apiClient.get('/insights', { params });
    return response.data;
  },
};

// =============================================================================
// AI QUERY API CALLS
// =============================================================================

export const aiAPI = {
  // Get AI queries
  getQueries: async (params?: GetAIQueriesParams): Promise<ApiResponse<AIQuery[]>> => {
    const response = await apiClient.get('/ai-queries', { params });
    return response.data;
  },

  // Create AI query
  createQuery: async (data: CreateAIQueryData): Promise<ApiResponse<AIQuery>> => {
    const response = await apiClient.post('/ai-queries', data);
    return response.data;
  },
};

// =============================================================================
// QUOTE API CALLS
// =============================================================================

export const quoteAPI = {
  // Get daily quote
  getDailyQuote: async (): Promise<ApiResponse<Quote>> => {
    const response = await apiClient.get('/quotes/daily');
    return response.data;
  },
};

// =============================================================================
// ANALYTICS API CALLS
// =============================================================================

export const analyticsAPI = {
  // Get user analytics
  getAnalytics: async (params?: GetAnalyticsParams): Promise<ApiResponse<Analytics>> => {
    const response = await apiClient.get('/analytics', { params });
    return response.data;
  },
};

// =============================================================================
// HEALTH CHECK
// =============================================================================

export const healthAPI = {
  // Health check
  check: async (): Promise<ApiResponse<{ message: string; timestamp: string }>> => {
    const response = await apiClient.get('/health');
    return response.data;
  },
};

export default apiClient;