import type {
  ApiResponse,
  User,
  Component,
  ComponentCategory,
  ComponentFilters,
  Build,
  BuildConfiguration,
  BuildFilters,
  CompatibilityCheck,
  BuildGuide,
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getAuthToken();

    const headers = {
      ...this.defaultHeaders,
      ...options.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(email: string, password: string): Promise<ApiResponse<{ token: string; user: User }>> {
    const response = await this.request<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.success && response.data?.token) {
      localStorage.setItem('auth_token', response.data.token);
    }

    return response;
  }

  async register(userData: {
    email: string;
    username: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }): Promise<ApiResponse<{ token: string; user: User }>> {
    const response = await this.request<{ token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.success && response.data?.token) {
      localStorage.setItem('auth_token', response.data.token);
    }

    return response;
  }

  async logout(): Promise<void> {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      localStorage.removeItem('auth_token');
    }
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.request<User>('/auth/me');
  }

  // Component endpoints
  async getComponents(filters: ComponentFilters = {}): Promise<ApiResponse<Component[]>> {
    const searchParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });

    const queryString = searchParams.toString();
    const endpoint = queryString ? `/components?${queryString}` : '/components';
    
    return this.request<Component[]>(endpoint);
  }

  async getComponent(id: string): Promise<ApiResponse<Component>> {
    return this.request<Component>(`/components/${id}`);
  }

  async getComponentsByCategory(
    categoryId: string,
    filters: Omit<ComponentFilters, 'category'> = {}
  ): Promise<ApiResponse<{ category: ComponentCategory; components: Component[] }>> {
    const searchParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });

    const queryString = searchParams.toString();
    const endpoint = queryString 
      ? `/components/category/${categoryId}?${queryString}`
      : `/components/category/${categoryId}`;
    
    return this.request<{ category: ComponentCategory; components: Component[] }>(endpoint);
  }

  async searchComponents(query: string, category?: string, limit = 10): Promise<ApiResponse<Component[]>> {
    const searchParams = new URLSearchParams({ q: query, limit: String(limit) });
    if (category) searchParams.append('category', category);
    
    return this.request<Component[]>(`/components/search?${searchParams.toString()}`);
  }

  // Category endpoints
  async getCategories(): Promise<ApiResponse<ComponentCategory[]>> {
    return this.request<ComponentCategory[]>('/components/categories');
  }

  // Build endpoints
  async getBuilds(filters: BuildFilters = {}): Promise<ApiResponse<Build[]>> {
    const searchParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });

    const queryString = searchParams.toString();
    const endpoint = queryString ? `/builds?${queryString}` : '/builds';
    
    return this.request<Build[]>(endpoint);
  }

  async getBuild(id: string): Promise<ApiResponse<Build>> {
    return this.request<Build>(`/builds/${id}`);
  }

  async createBuild(buildData: BuildConfiguration): Promise<ApiResponse<Build>> {
    return this.request<Build>('/builds', {
      method: 'POST',
      body: JSON.stringify(buildData),
    });
  }

  async updateBuild(id: string, buildData: Partial<BuildConfiguration>): Promise<ApiResponse<Build>> {
    return this.request<Build>(`/builds/${id}`, {
      method: 'PUT',
      body: JSON.stringify(buildData),
    });
  }

  async deleteBuild(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/builds/${id}`, {
      method: 'DELETE',
    });
  }

  async getPublicBuilds(filters: Omit<BuildFilters, 'userId'> = {}): Promise<ApiResponse<Build[]>> {
    const searchParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });

    const queryString = searchParams.toString();
    const endpoint = queryString ? `/builds/public?${queryString}` : '/builds/public';
    
    return this.request<Build[]>(endpoint);
  }

  async getUserBuilds(userId: string, filters: Omit<BuildFilters, 'userId'> = {}): Promise<ApiResponse<Build[]>> {
    const searchParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });

    const queryString = searchParams.toString();
    const endpoint = queryString 
      ? `/builds/user/${userId}?${queryString}`
      : `/builds/user/${userId}`;
    
    return this.request<Build[]>(endpoint);
  }

  // Compatibility endpoints
  async checkCompatibility(components: { componentId: string; quantity: number }[]): Promise<ApiResponse<CompatibilityCheck>> {
    return this.request<CompatibilityCheck>('/compatibility/check', {
      method: 'POST',
      body: JSON.stringify({ components }),
    });
  }

  async getCompatibilityRules(componentId?: string, category?: string): Promise<ApiResponse<any[]>> {
    const searchParams = new URLSearchParams();
    if (componentId) searchParams.append('componentId', componentId);
    if (category) searchParams.append('category', category);
    
    const queryString = searchParams.toString();
    const endpoint = queryString ? `/compatibility/rules?${queryString}` : '/compatibility/rules';
    
    return this.request<any[]>(endpoint);
  }

  async getCompatibilitySuggestions(componentId: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/compatibility/suggestions/${componentId}`);
  }

  // Build Guide endpoints (these would need to be implemented in the backend)
  async getBuildGuides(filters: { difficulty?: string; useCase?: string } = {}): Promise<ApiResponse<BuildGuide[]>> {
    const searchParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });

    const queryString = searchParams.toString();
    const endpoint = queryString ? `/guides?${queryString}` : '/guides';
    
    return this.request<BuildGuide[]>(endpoint);
  }

  async getBuildGuide(id: string): Promise<ApiResponse<BuildGuide>> {
    return this.request<BuildGuide>(`/guides/${id}`);
  }
}

// Create API client instance
const apiClient = new ApiClient(API_BASE_URL);

// Export specific API modules for better organization
export const authAPI = {
  login: apiClient.login.bind(apiClient),
  register: apiClient.register.bind(apiClient),
  logout: apiClient.logout.bind(apiClient),
  getCurrentUser: apiClient.getCurrentUser.bind(apiClient),
};

export const componentsAPI = {
  getAll: apiClient.getComponents.bind(apiClient),
  getById: apiClient.getComponent.bind(apiClient),
  getByCategory: apiClient.getComponentsByCategory.bind(apiClient),
  search: apiClient.searchComponents.bind(apiClient),
};

export const categoriesAPI = {
  getAll: apiClient.getCategories.bind(apiClient),
};

export const buildsAPI = {
  getAll: apiClient.getBuilds.bind(apiClient),
  getById: apiClient.getBuild.bind(apiClient),
  create: apiClient.createBuild.bind(apiClient),
  update: apiClient.updateBuild.bind(apiClient),
  delete: apiClient.deleteBuild.bind(apiClient),
  getPublic: apiClient.getPublicBuilds.bind(apiClient),
  getByUser: apiClient.getUserBuilds.bind(apiClient),
};

export const compatibilityAPI = {
  checkBuild: apiClient.checkCompatibility.bind(apiClient),
  getRules: apiClient.getCompatibilityRules.bind(apiClient),
  getSuggestions: apiClient.getCompatibilitySuggestions.bind(apiClient),
};

export const guidesAPI = {
  getAll: apiClient.getBuildGuides.bind(apiClient),
  getById: apiClient.getBuildGuide.bind(apiClient),
};

export default apiClient;
