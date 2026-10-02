import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { ToastService } from '../../services/toast.service';
import { EmployeeResponse } from '../../models/employee.model';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="employee-list" style="animation: fadeIn 0.3s ease;">

      <!-- Page Header -->
      <div class="page-header">
        <div>
          <h1>Employees</h1>
          <p class="page-subtitle">{{ filteredEmployees.length }} employees found</p>
        </div>
        <a routerLink="/employees/new" class="btn btn-primary" id="add-employee-btn">
          <span class="material-icons" style="font-size:18px;">add</span>
          Add Employee
        </a>
      </div>

      <!-- Toolbar: Search + Filter -->
      <div class="toolbar card" style="margin-bottom:20px;">
        <div class="search-bar">
          <span class="material-icons">search</span>
          <input
            id="search-input"
            class="form-control"
            type="text"
            placeholder="Search by name, email or position..."
            [(ngModel)]="searchTerm"
            (ngModelChange)="onSearch()"
          />
        </div>

        <div class="filters">
          <select class="form-control" [(ngModel)]="statusFilter" (change)="onSearch()" id="status-filter" style="width:auto;">
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="ON_LEAVE">On Leave</option>
          </select>

          <select class="form-control" [(ngModel)]="pageSize" (change)="onPageSizeChange()" id="page-size" style="width:auto;">
            <option [value]="5">5 per page</option>
            <option [value]="10">10 per page</option>
            <option [value]="25">25 per page</option>
          </select>
        </div>
      </div>

      <!-- Table -->
      <div class="card" style="padding:0;">

        <div *ngIf="loading" style="padding:32px;">
          <div class="skeleton" style="height:48px;margin-bottom:8px;" *ngFor="let i of [1,2,3,4,5]"></div>
        </div>

        <div *ngIf="!loading && pagedEmployees.length === 0" class="empty-state">
          <span class="material-icons">search_off</span>
          <h3>No employees found</h3>
          <p>Try adjusting your search or filters</p>
        </div>

        <div class="table-wrapper" *ngIf="!loading && pagedEmployees.length > 0">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Employee</th>
                <th>Position</th>
                <th>Department</th>
                <th>Hire Date</th>
                <th>Salary</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let emp of pagedEmployees; let i = index" style="animation: fadeIn 0.2s ease;">
                <td style="color:var(--text-muted);font-size:12px;">#{{ emp.id }}</td>
                <td>
                  <div style="display:flex;align-items:center;gap:12px;">
                    <div class="avatar" [style.background]="getAvatarColor(i)">{{ getInitials(emp) }}</div>
                    <div>
                      <div style="font-weight:600;">{{ emp.firstName }} {{ emp.lastName }}</div>
                      <div style="font-size:12px;color:var(--text-muted);">{{ emp.email }}</div>
                    </div>
                  </div>
                </td>
                <td>{{ emp.position }}</td>
                <td>
                  <span *ngIf="emp.departmentName" class="badge badge-primary">{{ emp.departmentName }}</span>
                  <span *ngIf="!emp.departmentName" style="color:var(--text-muted);font-size:12px;">—</span>
                </td>
                <td style="color:var(--text-secondary);">{{ emp.hireDate | date:'dd MMM yyyy' }}</td>
                <td style="font-weight:600;">₹{{ emp.salary | number }}</td>
                <td>
                  <span class="badge" [class]="getStatusClass(emp.status)">
                    {{ emp.status || 'ACTIVE' }}
                  </span>
                </td>
                <td>
                  <div style="display:flex;gap:8px;">
                    <a [routerLink]="['/employees', emp.id]" class="btn btn-icon btn-outline" title="View">
                      <span class="material-icons" style="font-size:16px;">visibility</span>
                    </a>
                    <a [routerLink]="['/employees/edit', emp.id]" class="btn btn-icon btn-outline" title="Edit">
                      <span class="material-icons" style="font-size:16px;">edit</span>
                    </a>
                    <button class="btn btn-icon btn-danger" title="Delete" (click)="confirmDelete(emp)" id="delete-{{ emp.id }}">
                      <span class="material-icons" style="font-size:16px;">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div *ngIf="totalPages > 1" class="pagination">
          <button (click)="goToPage(1)" [disabled]="currentPage === 1">
            <span class="material-icons" style="font-size:16px;">first_page</span>
          </button>
          <button (click)="goToPage(currentPage - 1)" [disabled]="currentPage === 1">
            <span class="material-icons" style="font-size:16px;">chevron_left</span>
          </button>

          <button
            *ngFor="let p of pageNumbers"
            (click)="goToPage(p)"
            [class.active]="p === currentPage"
          >{{ p }}</button>

          <button (click)="goToPage(currentPage + 1)" [disabled]="currentPage === totalPages">
            <span class="material-icons" style="font-size:16px;">chevron_right</span>
          </button>
          <button (click)="goToPage(totalPages)" [disabled]="currentPage === totalPages">
            <span class="material-icons" style="font-size:16px;">last_page</span>
          </button>
        </div>
      </div>

      <!-- Delete Confirm Modal -->
      <div class="modal-backdrop" *ngIf="employeeToDelete" (click)="cancelDelete()">
        <div class="modal" style="max-width:420px;" (click)="$event.stopPropagation()">
          <div style="text-align:center;padding:16px 0;">
            <div style="width:60px;height:60px;background:rgba(255,100,34,0.14);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;border:1px solid rgba(255,100,34,0.3);">
              <span class="material-icons" style="color:var(--accent-primary);font-size:30px;">warning</span>
            </div>
            <h3>Delete Employee?</h3>
            <p style="margin-top:8px;">Are you sure you want to delete <strong style="color:var(--text-primary);">{{ employeeToDelete?.firstName }} {{ employeeToDelete?.lastName }}</strong>? This action cannot be undone.</p>
            <div style="display:flex;gap:12px;justify-content:center;margin-top:24px;">
              <button class="btn btn-outline" (click)="cancelDelete()" id="cancel-delete-btn">Cancel</button>
              <button class="btn btn-danger" (click)="deleteEmployee()" id="confirm-delete-btn">
                <span class="material-icons" style="font-size:16px;">delete</span>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .toolbar {
      display: flex;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
      padding: 16px 20px;
    }

    .search-bar { flex: 1; min-width: 250px; }

    .filters {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }
  `]
})
export class EmployeeListComponent implements OnInit {

  allEmployees: EmployeeResponse[] = [];
  filteredEmployees: EmployeeResponse[] = [];
  pagedEmployees: EmployeeResponse[] = [];

  loading = true;
  searchTerm = '';
  statusFilter = '';

  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  pageNumbers: number[] = [];

  employeeToDelete: EmployeeResponse | null = null;

  private avatarColors = [
    'linear-gradient(135deg, #ffb703 0%, #ff5500 100%)',
    'linear-gradient(135deg, #ff9f1c 0%, #ff5500 100%)',
    'linear-gradient(135deg, #ffb703 0%, #ff8c00 100%)',
    'linear-gradient(135deg, #ffa526 0%, #ff661a 100%)',
    'linear-gradient(135deg, #ffc568 0%, #ff5500 100%)',
  ];

  constructor(
    private employeeService: EmployeeService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees() {
    this.loading = true;
    this.employeeService.getAllEmployees().subscribe({
      next: (data) => {
        this.allEmployees = data;
        this.filteredEmployees = data;
        this.updatePagination();
        this.loading = false;
      },
      error: () => {
        this.toastService.error('Failed to load employees. Is the backend running?');
        this.loading = false;
      }
    });
  }

  // ── Step 19: Search ────────────────────────────────────────────────────
  onSearch() {
    const term = this.searchTerm.toLowerCase();
    this.filteredEmployees = this.allEmployees.filter(emp => {
      const matchesSearch =
        emp.firstName.toLowerCase().includes(term) ||
        emp.lastName.toLowerCase().includes(term) ||
        emp.email.toLowerCase().includes(term) ||
        emp.position.toLowerCase().includes(term);
      const matchesStatus = !this.statusFilter || emp.status === this.statusFilter;
      return matchesSearch && matchesStatus;
    });
    this.currentPage = 1;
    this.updatePagination();
  }

  // ── Step 19: Pagination ───────────────────────────────────────────────
  updatePagination() {
    this.totalPages = Math.max(1, Math.ceil(this.filteredEmployees.length / this.pageSize));
    this.pageNumbers = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.applyPage();
  }

  applyPage() {
    const start = (this.currentPage - 1) * this.pageSize;
    this.pagedEmployees = this.filteredEmployees.slice(start, start + this.pageSize);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.applyPage();
  }

  onPageSizeChange() {
    this.currentPage = 1;
    this.updatePagination();
  }

  confirmDelete(emp: EmployeeResponse) {
    this.employeeToDelete = emp;
  }

  cancelDelete() {
    this.employeeToDelete = null;
  }

  deleteEmployee() {
    if (!this.employeeToDelete) return;
    this.employeeService.deleteEmployee(this.employeeToDelete.id).subscribe({
      next: () => {
        this.toastService.success(`${this.employeeToDelete!.firstName} ${this.employeeToDelete!.lastName} deleted successfully`);
        this.employeeToDelete = null;
        this.loadEmployees();
      },
      error: () => {
        this.toastService.error('Failed to delete employee');
        this.employeeToDelete = null;
      }
    });
  }

  getInitials(emp: EmployeeResponse): string {
    return (emp.firstName[0] + emp.lastName[0]).toUpperCase();
  }

  getAvatarColor(i: number): string {
    return this.avatarColors[i % this.avatarColors.length];
  }

  getStatusClass(status?: string): string {
    switch (status?.toUpperCase()) {
      case 'ACTIVE': return 'badge badge-success';
      case 'INACTIVE': return 'badge badge-danger';
      case 'ON_LEAVE': return 'badge badge-warning';
      default: return 'badge badge-success';
    }
  }
}
