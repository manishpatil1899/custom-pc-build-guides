import { type ClassValue, clsx } from 'clsx';

/**
 * Utility function to merge class names
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Format price to currency string with proper null/undefined handling
 */
export function formatPrice(price?: number | string | null): string {
  if (price === null || price === undefined || price === '') {
    return 'Price not available';
  }

  // Convert to number if it's a string
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  // Check if conversion resulted in NaN
  if (isNaN(numPrice)) {
    return 'Price not available';
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(numPrice);
}

/**
 * Safely calculate total price from components array
 */
export function calculateTotalPrice(components: Array<{ price?: number | string | null }>): number {
  return components.reduce((total, component) => {
    if (!component?.price) return total;
    const price = typeof component.price === 'string' ? parseFloat(component.price) : component.price;
    return total + (isNaN(price) ? 0 : price);
  }, 0);
}

/**
 * Format date to readable string
 */
export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return new Intl.DateTimeFormat('en-US', { ...defaultOptions, ...options }).format(dateObj);
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInMs = now.getTime() - dateObj.getTime();
  const rtf = new Intl.RelativeTimeFormat('en-US', { numeric: 'auto' });

  const intervals = [
    { unit: 'year', ms: 31536000000 },
    { unit: 'month', ms: 2628000000 },
    { unit: 'week', ms: 604800000 },
    { unit: 'day', ms: 86400000 },
    { unit: 'hour', ms: 3600000 },
    { unit: 'minute', ms: 60000 },
    { unit: 'second', ms: 1000 },
  ] as const;

  for (const { unit, ms } of intervals) {
    if (Math.abs(diffInMs) >= ms) {
      const value = Math.round(diffInMs / ms);
      return rtf.format(-value, unit);
    }
  }

  return 'Just now';
}

/**
 * Capitalize first letter of string
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Generate slug from string
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, length: number, suffix = '...'): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + suffix;
}

/**
 * Get component category icon
 */
export function getComponentCategoryIcon(categoryName: string): string {
  const icons: Record<string, string> = {
    CPU: '🧠',
    Processor: '🧠',
    Motherboard: '🔌',
    RAM: '💾',
    Memory: '💾',
    GPU: '🎮',
    'Graphics Card': '🎮',
    Storage: '💿',
    PSU: '⚡',
    'Power Supply': '⚡',
    Case: '📦',
    'PC Case': '📦',
    Cooling: '❄️',
  };
  return icons[categoryName] || '🔧';
}

/**
 * Get use case icon
 */
export function getUseCaseIcon(useCase: string): string {
  const icons: Record<string, string> = {
    Gaming: '🎮',
    Workstation: '💼',
    Budget: '💰',
    Office: '🏢',
    Server: '🖥️',
    HTPC: '📺',
    General: '💻',
    Other: '🔧',
  };
  return icons[useCase] || '💻';
}

/**
 * Get difficulty color class
 */
export function getDifficultyColor(difficulty: string): string {
  const colors: Record<string, string> = {
    Beginner: 'bg-green-100 text-green-800',
    Intermediate: 'bg-yellow-100 text-yellow-800',
    Advanced: 'bg-red-100 text-red-800',
  };
  return colors[difficulty] || 'bg-gray-100 text-gray-800';
}

/**
 * Calculate build statistics
 */
export function calculateBuildStats(components: any[]): {
  totalPrice: number;
  componentCount: number;
  categories: string[];
  missingCategories: string[];
} {
  const requiredCategories = ['CPU', 'Motherboard', 'RAM', 'Storage', 'PSU', 'Case'];
  const presentCategories = components.map(c => c.category?.name || c.categoryName).filter(Boolean);

  return {
    totalPrice: calculateTotalPrice(components),
    componentCount: components.length,
    categories: [...new Set(presentCategories)],
    missingCategories: requiredCategories.filter(cat => !presentCategories.includes(cat)),
  };
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

/**
 * Create a delay/sleep function
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Format bytes to human readable format
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Check if device is mobile
 */
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
}

/**
 * Simple debounce function without cleanup issues
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}
