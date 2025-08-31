export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ComponentCategory {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  icon?: string;
  sortOrder: number;
}

export interface Component {
  id: string;
  name: string;
  model: string;
  brand: string;
  description?: string;
  image?: string;
  price?: number;
  inStock: boolean;
  specifications?: Record<string, any>;
  categoryId: string;
  category?: ComponentCategory;
  createdAt: string;
  updatedAt: string;
}

export interface Build {
  id: string;
  name: string;
  description?: string;
  isPublic: boolean;
  useCase?: string;
  totalPrice?: number;
  userId: string;
  user?: User;
  components: BuildComponent[];
  createdAt: string;
  updatedAt: string;
}

export interface BuildComponent {
  id: string;
  quantity: number;
  buildId: string;
  componentId: string;
  component: Component;
}

export interface CompatibilityRule {
  id: string;
  description: string;
  ruleType: string;
  rules: Record<string, any>;
  componentId: string;
  component?: Component;
  createdAt: string;
  updatedAt: string;
}

export interface CompatibilityCheck {
  isCompatible: boolean;
  errors: string[];
  warnings: string[];
  recommendations: string[];
  componentCount: number;
  checkedAt: string;
}

export interface BuildGuide {
  id: string;
  title: string;
  description: string;
  content: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  useCase: string;
  thumbnail?: string;
  isPublished: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface BuildConfiguration {
  name: string;
  description?: string;
  useCase?: string;
  isPublic: boolean;
  components: {
    componentId: string;
    quantity: number;
  }[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ComponentFilters {
  category?: string;
  brand?: string;
  search?: string;
  priceMin?: number;
  priceMax?: number;
  inStock?: boolean;
  sortBy?: 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';
  page?: number;
  limit?: number;
}

export interface BuildFilters {
  userId?: string;
  useCase?: string;
  isPublic?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'created-desc' | 'created-asc' | 'price-desc' | 'price-asc' | 'name-asc';
}
