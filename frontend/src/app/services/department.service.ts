import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Department } from '../models/employee.model';

@Injectable({ providedIn: 'root' })
export class DepartmentService {

  private readonly API_URL = 'http://localhost:8080/api/departments';

  constructor(private http: HttpClient) {}

  getAllDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(this.API_URL);
  }

  getDepartmentById(id: number): Observable<Department> {
    return this.http.get<Department>(`${this.API_URL}/${id}`);
  }

  createDepartment(dept: Partial<Department>): Observable<Department> {
    return this.http.post<Department>(this.API_URL, dept);
  }

  updateDepartment(id: number, dept: Partial<Department>): Observable<Department> {
    return this.http.put<Department>(`${this.API_URL}/${id}`, dept);
  }

  deleteDepartment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
