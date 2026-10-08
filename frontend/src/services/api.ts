import axios from 'axios';
import {
  Invoice, PurchaseOrder, Vendor, Policy, AuditLog, Notification, AnalyticsResponse
} from '../types';

const API_BASE = (import.meta as any).env?.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const apiService = {
  // Auth
  login: async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    return res.data;
  },
  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },

  // Invoices
  getInvoices: async (params?: { status?: string; risk_level?: string; search?: string }): Promise<Invoice[]> => {
    const res = await api.get('/invoices', { params });
    return res.data;
  },
  getInvoice: async (id: number): Promise<Invoice> => {
    const res = await api.get(`/invoices/${id}`);
    return res.data;
  },
  uploadInvoice: async (formData: FormData): Promise<Invoice> => {
    const res = await api.post('/invoices/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
  processInvoice: async (id: number): Promise<Invoice> => {
    const res = await api.post(`/invoices/${id}/process`);
    return res.data;
  },

  // Reviews (HITL)
  getPendingReviews: async (): Promise<Invoice[]> => {
    const res = await api.get('/reviews');
    return res.data;
  },
  approveInvoice: async (id: number, comments: string): Promise<Invoice> => {
    const res = await api.post(`/reviews/${id}/approve`, { comments });
    return res.data;
  },
  rejectInvoice: async (id: number, comments: string): Promise<Invoice> => {
    const res = await api.post(`/reviews/${id}/reject`, { comments });
    return res.data;
  },
  requestCorrection: async (id: number, comments: string): Promise<Invoice> => {
    const res = await api.post(`/reviews/${id}/correction`, { comments });
    return res.data;
  },

  // Purchase Orders
  getPurchaseOrders: async (): Promise<PurchaseOrder[]> => {
    const res = await api.get('/purchase-orders');
    return res.data;
  },
  createPurchaseOrder: async (data: any): Promise<PurchaseOrder> => {
    const res = await api.post('/purchase-orders', data);
    return res.data;
  },

  // Vendors
  getVendors: async (): Promise<Vendor[]> => {
    const res = await api.get('/vendors');
    return res.data;
  },

  // Policies
  getPolicies: async (): Promise<Policy[]> => {
    const res = await api.get('/policies');
    return res.data;
  },
  createPolicy: async (data: any): Promise<Policy> => {
    const res = await api.post('/policies', data);
    return res.data;
  },
  updatePolicy: async (id: number, data: any): Promise<Policy> => {
    const res = await api.put(`/policies/${id}`, data);
    return res.data;
  },

  // Analytics
  getAnalytics: async (): Promise<AnalyticsResponse> => {
    const res = await api.get('/analytics');
    return res.data;
  },

  // Audit Logs
  getAuditLogs: async (params?: { actor?: string; search?: string }): Promise<AuditLog[]> => {
    const res = await api.get('/audit-logs', { params });
    return res.data;
  },

  // Notifications
  getNotifications: async (): Promise<Notification[]> => {
    const res = await api.get('/notifications');
    return res.data;
  },
  markNotificationRead: async (id: number): Promise<Notification> => {
    const res = await api.post(`/notifications/${id}/read`);
    return res.data;
  },

  // Interactive Demo Mode
  triggerDemoProcess: async (scenario: string = 'amount_mismatch'): Promise<Invoice> => {
    const res = await api.post('/demo/process', { scenario });
    return res.data;
  },
};
