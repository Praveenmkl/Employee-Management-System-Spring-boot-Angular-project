import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EmployeeRequest, EmployeeResponse } from '../models/employee.model';

/**
 * EmployeeService — Step 15: Services + HttpClient
 * Connects Angular frontend to Spring Boot REST API.
 * All methods return Observables (async streams).
 */
@Injectable({
  providedIn: 'root'   // Singleton — available throughout the whole app
})
export class EmployeeService {

  // ── Base URL pointing to Spring Boot backend ──────────────────────────
  private readonly API_URL = 'http://localhost:8080/api/employees';

  constructor(private http: HttpClient) {}

  // ── GET /api/employees ────────────────────────────────────────────────
  getAllEmployees(): Observable<EmployeeResponse[]> {
    return this.http.get<EmployeeResponse[]>(this.API_URL);
  }

  // ── GET /api/employees/:id ────────────────────────────────────────────
  getEmployeeById(id: number): Observable<EmployeeResponse> {
    return this.http.get<EmployeeResponse>(`${this.API_URL}/${id}`);
  }

  // ── POST /api/employees ───────────────────────────────────────────────
  createEmployee(request: EmployeeRequest): Observable<EmployeeResponse> {
    return this.http.post<EmployeeResponse>(this.API_URL, request);
  }

  // ── PUT /api/employees/:id ────────────────────────────────────────────
  updateEmployee(id: number, request: EmployeeRequest): Observable<EmployeeResponse> {
    return this.http.put<EmployeeResponse>(`${this.API_URL}/${id}`, request);
  }

  // ── DELETE /api/employees/:id ─────────────────────────────────────────
  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
