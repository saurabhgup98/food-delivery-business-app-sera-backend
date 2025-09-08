import { Document } from 'mongoose';

// User Types
export interface IUser extends Document {
  _id: string;
  email: string;
  name: string;
  role: 'admin' | 'restaurant_owner' | 'customer';
  appRegistered: 'customer-app' | 'business-app';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Restaurant Types
export interface IRestaurant extends Document {
  _id: string;
  name: string;
  description: string;
  cuisine: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  contact: {
    phone: string;
    email: string;
  };
  owner: string; // User ID
  status: 'pending' | 'active' | 'suspended' | 'inactive';
  rating: number;
  deliveryTime: string;
  deliveryFee: number;
  minimumOrder: number;
  isOpen: boolean;
  operatingHours: {
    [key: string]: {
      open: string;
      close: string;
      isOpen: boolean;
    };
  };
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Menu Item Types
export interface IMenuItem extends Document {
  _id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isAvailable: boolean;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  allergens: string[];
  images: string[];
  preparationTime: number; // in minutes
  createdAt: Date;
  updatedAt: Date;
}

// Order Types
export interface IOrder extends Document {
  _id: string;
  customerId: string;
  restaurantId: string;
  items: {
    menuItemId: string;
    name: string;
    price: number;
    quantity: number;
    specialInstructions?: string;
  }[];
  totalAmount: number;
  deliveryFee: number;
  tax: number;
  finalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: 'cash' | 'card' | 'upi' | 'wallet';
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  estimatedDeliveryTime: Date;
  actualDeliveryTime?: Date;
  specialInstructions?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Activity Types
export interface IActivity extends Document {
  _id: string;
  type: 'customer' | 'restaurant' | 'order' | 'payment' | 'system';
  action: string;
  title: string;
  description: string;
  userId?: string;
  restaurantId?: string;
  orderId?: string;
  metadata?: Record<string, any>;
  status: 'success' | 'warning' | 'error' | 'info';
  createdAt: Date;
}

// Dashboard Types
export interface IDashboardStats {
  totalUsers: number;
  totalRestaurants: number;
  totalOrders: number;
  totalRevenue: number;
  activeRestaurants: number;
  pendingRestaurants: number;
  todayOrders: number;
  todayRevenue: number;
  recentActivities: IActivity[];
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Request Types
export interface AuthenticatedRequest extends Request {
  user?: IUser;
}

// Filter Types
export interface RestaurantFilters {
  status?: string;
  cuisine?: string;
  city?: string;
  isOpen?: boolean;
  search?: string;
}

export interface UserFilters {
  role?: string;
  isActive?: boolean;
  search?: string;
}

export interface OrderFilters {
  status?: string;
  paymentStatus?: string;
  restaurantId?: string;
  customerId?: string;
  dateFrom?: Date;
  dateTo?: Date;
}
