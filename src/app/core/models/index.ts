// Auth Models
export interface LoginRequest {
  username: string;
  password: string;
  expiresInMins?: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  token: string;
  refreshToken: string;
}

// Product Models
export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface ProductRequest {
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating?: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail?: string;
}

// Generic API Response
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
}

// Table column model
export interface TableColumn {
  field: string;
  header: string;
  sortable?: boolean;
  width?: string;
}

// Pagination model
export interface PaginationConfig {
  currentPage: number;
  pageSize: number;
  total: number;
}

// Toast model
export interface ToastMessage {
  id?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

// Confirm modal model
export interface ConfirmConfig {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  type?: 'danger' | 'warning' | 'info';
}