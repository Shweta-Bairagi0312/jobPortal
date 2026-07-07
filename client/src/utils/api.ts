import axios from 'axios';
import { Job } from '../types';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data: { name: string; email: string; password: string; role?: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data: FormData) =>
    api.put('/auth/profile', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put('/auth/password', data)
};

export const userAPI = {
  getAll: (params?: { role?: string; search?: string; page?: number; limit?: number }) =>
    api.get('/users', { params }),
  getById: (id: string) => api.get(`/users/${id}`),
  updateStatus: (id: string, isActive: boolean) =>
    api.put(`/users/${id}/status`, { isActive }),
  delete: (id: string) => api.delete(`/users/${id}`),
  getStats: () => api.get('/users/stats')
};

export const jobAPI = {
  getAll: (params?: {
    search?: string;
    category?: string;
    location?: string;
    jobType?: string;
    experience?: string;
    minSalary?: number;
    maxSalary?: number;
    page?: number;
    limit?: number;
    sort?: string;
  }) => api.get('/jobs', { params }),
  getById: (id: string) => api.get(`/jobs/${id}`),
  getFeatured: () => api.get('/jobs/featured'),
  getStats: () => api.get('/jobs/stats'),
  getEmployerJobs: () => api.get('/jobs/employer'),
  create: (data: Partial<Job>) => api.post('/jobs', data),
  update: (id: string, data: Partial<Job>) => api.put(`/jobs/${id}`, data),
  delete: (id: string) => api.delete(`/jobs/${id}`)
};

export const companyAPI = {
  getAll: (params?: { search?: string; page?: number; limit?: number }) =>
    api.get('/companies', { params }),
  getById: (id: string) => api.get(`/companies/${id}`),
  getMy: () => api.get('/companies/my'),
  getMyStats: () => api.get('/companies/my/stats'),
  getJobs: (id: string) => api.get(`/companies/${id}/jobs`),
  create: (data: FormData) =>
    api.post('/companies', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  update: (data: FormData) =>
    api.put('/companies', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
};

export const applicationAPI = {
  apply: (jobId: string, data: { coverLetter?: string }, resume?: File) => {
    const formData = new FormData();
    if (data.coverLetter) formData.append('coverLetter', data.coverLetter);
    if (resume) formData.append('resume', resume);
    return api.post(`/applications/job/${jobId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  getMy: () => api.get('/applications/my'),
  getEmployer: () => api.get('/applications/employer'),
  getByJob: (jobId: string) => api.get(`/applications/job/${jobId}`),
  updateStatus: (id: string, data: { status: string; employerNotes?: string }) =>
    api.put(`/applications/${id}/status`, data),
  withdraw: (id: string) => api.delete(`/applications/${id}`)
};

export const savedJobAPI = {
  save: (jobId: string) => api.post(`/saved-jobs/${jobId}`),
  unsave: (jobId: string) => api.delete(`/saved-jobs/${jobId}`),
  getMy: () => api.get('/saved-jobs'),
  checkIfSaved: (jobId: string) => api.get(`/saved-jobs/check/${jobId}`)
};

export default api;
