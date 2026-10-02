// ── Employee Request (sent to backend POST/PUT) ───────────────────────────
export interface EmployeeRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;      // ISO date string  "YYYY-MM-DD"
  hireDate?: string;
  salary: number;
  position: string;
  departmentId?: number | null;
  status?: string;
}

// ── Employee Response (received from backend GET) ─────────────────────────
export interface EmployeeResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  hireDate?: string;
  salary: number;
  position: string;
  status?: string;
  departmentId?: number;
  departmentName?: string;
}

// ── Department ─────────────────────────────────────────────────────────────
export interface Department {
  id: number;
  name: string;
  description?: string;
}

// ── API Error ─────────────────────────────────────────────────────────────
export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message?: string;
  fieldErrors?: { [field: string]: string };
}

// ── Dashboard Stats ───────────────────────────────────────────────────────
export interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  departments: number;
  newThisMonth: number;
}
