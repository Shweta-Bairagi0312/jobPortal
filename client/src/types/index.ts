export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'job_seeker' | 'employer' | 'admin';
  profileImage?: string;
  phone?: string;
  location?: string;
  bio?: string;
  skills?: string[];
  education?: Education[];
  experience?: Experience[];
  resume?: string;
  company?: Company;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  startYear: number;
  endYear?: number;
  description?: string;
}

export interface Experience {
  company: string;
  position: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
}

export interface Company {
  _id: string;
  companyName: string;
  logo?: string;
  description: string;
  website?: string;
  location: string;
  industry?: string;
  companySize?: string;
  foundedYear?: number;
  owner: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Job {
  _id: string;
  title: string;
  description: string;
  requirements?: string[];
  salary?: {
    min?: number;
    max?: number;
    currency?: string;
  };
  location: string;
  category: string;
  experience?: string;
  jobType: string;
  skills?: string[];
  company: Company;
  createdBy: User;
  applicants?: Application[];
  isActive: boolean;
  deadline?: string;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface Application {
  _id: string;
  applicant: User;
  job: Job;
  resume?: string;
  coverLetter?: string;
  status: 'pending' | 'reviewing' | 'shortlisted' | 'rejected' | 'accepted';
  employerNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SavedJob {
  _id: string;
  user: User;
  job: Job;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}
