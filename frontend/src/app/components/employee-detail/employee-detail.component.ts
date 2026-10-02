import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { ToastService } from '../../services/toast.service';
import { EmployeeResponse } from '../../models/employee.model';

@Component({
  selector: 'app-employee-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div style="max-width:800px;margin:0 auto;animation:fadeIn 0.3s ease;">

      <!-- Back button -->
      <div style="margin-bottom:20px;">
        <a routerLink="/employees" class="btn btn-outline">
          <span class="material-icons" style="font-size:18px;">arrow_back</span>
          Back to Employees
        </a>
      </div>

      <!-- Skeleton loading -->
      <div *ngIf="loading">
        <div class="card" style="display:flex;gap:20px;align-items:center;">
          <div class="skeleton" style="width:80px;height:80px;border-radius:50%;"></div>
          <div style="flex:1;">
            <div class="skeleton" style="height:28px;width:200px;margin-bottom:8px;"></div>
            <div class="skeleton" style="height:16px;width:150px;"></div>
          </div>
        </div>
      </div>

      <!-- Profile card -->
      <div *ngIf="!loading && employee">

        <!-- Hero -->
        <div class="profile-hero card" style="margin-bottom:20px;">
          <div class="profile-avatar">{{ getInitials() }}</div>
          <div class="profile-info">
            <h1 style="font-size:1.75rem;">{{ employee.firstName }} {{ employee.lastName }}</h1>
            <p style="color:var(--text-accent);font-weight:500;margin-top:4px;">{{ employee.position }}</p>
            <div style="display:flex;gap:12px;margin-top:12px;flex-wrap:wrap;">
              <span class="badge" [class]="getStatusClass(employee.status)">{{ employee.status || 'ACTIVE' }}</span>
              <span *ngIf="employee.departmentName" class="badge badge-primary">{{ employee.departmentName }}</span>
            </div>
          </div>
          <div class="profile-actions">
            <a [routerLink]="['/employees/edit', employee.id]" class="btn btn-primary" id="edit-btn">
              <span class="material-icons" style="font-size:18px;">edit</span>
              Edit
            </a>
            <button class="btn btn-danger" (click)="confirmDelete()" id="delete-btn">
              <span class="material-icons" style="font-size:18px;">delete</span>
              Delete
            </button>
          </div>
        </div>

        <!-- Detail Grid -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">

          <div class="card detail-section">
            <h3 class="detail-section-title">
              <span class="material-icons">contact_mail</span>
              Contact
            </h3>
            <div class="detail-row">
              <span class="detail-label">Email</span>
              <span class="detail-value">{{ employee.email }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Phone</span>
              <span class="detail-value">{{ employee.phone || '—' }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Address</span>
              <span class="detail-value">{{ employee.address || '—' }}</span>
            </div>
          </div>

          <div class="card detail-section">
            <h3 class="detail-section-title">
              <span class="material-icons">work</span>
              Employment
            </h3>
            <div class="detail-row">
              <span class="detail-label">Hire Date</span>
              <span class="detail-value">{{ employee.hireDate | date:'dd MMM yyyy' }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Salary</span>
              <span class="detail-value" style="color:var(--accent-success);font-weight:700;">₹{{ employee.salary | number }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Department</span>
              <span class="detail-value">{{ employee.departmentName || '—' }}</span>
            </div>
          </div>

          <div class="card detail-section">
            <h3 class="detail-section-title">
              <span class="material-icons">person</span>
              Personal
            </h3>
            <div class="detail-row">
              <span class="detail-label">Date of Birth</span>
              <span class="detail-value">{{ employee.dateOfBirth | date:'dd MMM yyyy' }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Employee ID</span>
              <span class="detail-value">#{{ employee.id }}</span>
            </div>
          </div>

        </div>
      </div>

      <!-- Not found -->
      <div *ngIf="!loading && !employee" class="empty-state card">
        <span class="material-icons">person_off</span>
        <h3>Employee Not Found</h3>
        <a routerLink="/employees" class="btn btn-primary" style="margin-top:8px;">Back to List</a>
      </div>

      <!-- Delete modal -->
      <div class="modal-backdrop" *ngIf="showDeleteModal" (click)="showDeleteModal = false">
        <div class="modal" style="max-width:420px;" (click)="$event.stopPropagation()">
          <div style="text-align:center;padding:16px 0;">
            <div style="width:60px;height:60px;background:rgba(255,100,34,0.14);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;border:1px solid rgba(255,100,34,0.3);">
              <span class="material-icons" style="color:var(--accent-primary);font-size:30px;">warning</span>
            </div>
            <h3>Delete Employee?</h3>
            <p style="margin-top:8px;">This action cannot be undone.</p>
            <div style="display:flex;gap:12px;justify-content:center;margin-top:24px;">
              <button class="btn btn-outline" (click)="showDeleteModal = false">Cancel</button>
              <button class="btn btn-danger" (click)="deleteEmployee()" id="confirm-delete">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .profile-hero {
      display: flex;
      align-items: center;
      gap: 24px;
      flex-wrap: wrap;
    }

    .profile-avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: var(--gradient-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      font-weight: 700;
      color: #fff;
      flex-shrink: 0;
      box-shadow: 0 8px 25px rgba(99,102,241,0.3);
    }

    .profile-info { flex: 1; }

    .profile-actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    .detail-section-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      font-weight: 600;
      margin-bottom: 16px;
    }

    .detail-section-title .material-icons {
      font-size: 18px;
      color: var(--accent-primary);
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
      border-bottom: 1px solid var(--border-color);
    }

    .detail-row:last-child { border-bottom: none; }

    .detail-label {
      font-size: 13px;
      color: var(--text-muted);
    }

    .detail-value {
      font-size: 14px;
      color: var(--text-primary);
      font-weight: 500;
      text-align: right;
    }

    @media (max-width: 640px) {
      div[style*="grid-template-columns:1fr 1fr"] {
        grid-template-columns: 1fr !important;
      }
    }
  `]
})
export class EmployeeDetailComponent implements OnInit {

  employee: EmployeeResponse | null = null;
  loading = true;
  showDeleteModal = false;

  constructor(
    private employeeService: EmployeeService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    const id = +(this.route.snapshot.paramMap.get('id') ?? 0);
    this.employeeService.getEmployeeById(id).subscribe({
      next: (emp) => { this.employee = emp; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  getInitials(): string {
    if (!this.employee) return '';
    return (this.employee.firstName[0] + this.employee.lastName[0]).toUpperCase();
  }

  getStatusClass(status?: string): string {
    switch (status?.toUpperCase()) {
      case 'ACTIVE': return 'badge badge-success';
      case 'INACTIVE': return 'badge badge-danger';
      case 'ON_LEAVE': return 'badge badge-warning';
      default: return 'badge badge-success';
    }
  }

  confirmDelete() { this.showDeleteModal = true; }

  deleteEmployee() {
    if (!this.employee) return;
    this.employeeService.deleteEmployee(this.employee.id).subscribe({
      next: () => {
        this.toastService.success('Employee deleted successfully');
        this.router.navigate(['/employees']);
      },
      error: () => this.toastService.error('Failed to delete employee')
    });
  }
}
