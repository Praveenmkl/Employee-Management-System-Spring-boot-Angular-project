import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DepartmentService } from '../../services/department.service';
import { ToastService } from '../../services/toast.service';
import { Department } from '../../models/employee.model';

@Component({
  selector: 'app-department-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="department-page" style="animation: fadeIn 0.35s ease;">

      <!-- Header -->
      <div class="page-header">
        <div>
          <h1>Departments</h1>
          <p class="page-subtitle">Manage company organizational departments and teams</p>
        </div>
        <button class="btn btn-primary" (click)="openAddModal()" id="add-dept-btn">
          <span class="material-icons" style="font-size:18px;">add</span>
          Add Department
        </button>
      </div>

      <!-- Loading skeleton -->
      <div *ngIf="loading" class="dept-grid">
        <div class="card skeleton" style="height:140px;" *ngFor="let i of [1,2,3,4,5,6]"></div>
      </div>

      <!-- Empty State -->
      <div *ngIf="!loading && departments.length === 0" class="empty-state card">
        <span class="material-icons">domain_disabled</span>
        <h3>No Departments Found</h3>
        <p>Click "Add Department" above to create your first team department.</p>
        <button class="btn btn-primary" (click)="openAddModal()" style="margin-top:12px;">
          Add Department
        </button>
      </div>

      <!-- Department Cards Grid -->
      <div *ngIf="!loading && departments.length > 0" class="dept-grid">
        <div class="dept-card card" *ngFor="let dept of departments">
          <div class="dept-header">
            <div class="dept-icon">
              <span class="material-icons">domain</span>
            </div>
            <div class="dept-actions">
              <button class="btn btn-icon btn-outline" (click)="openEditModal(dept)" title="Edit">
                <span class="material-icons" style="font-size:16px;">edit</span>
              </button>
              <button class="btn btn-icon btn-outline" (click)="confirmDelete(dept)" title="Delete">
                <span class="material-icons" style="font-size:16px;">delete</span>
              </button>
            </div>
          </div>

          <div class="dept-body">
            <h3 class="dept-title">{{ dept.name }}</h3>
            <p class="dept-desc">{{ dept.description || 'No description provided.' }}</p>
          </div>

          <div class="dept-footer">
            <span class="badge badge-primary">
              <span class="material-icons" style="font-size:13px;">groups</span>
              {{ dept.employeeCount || 0 }} Employees
            </span>
          </div>
        </div>
      </div>

      <!-- Add / Edit Modal -->
      <div class="modal-backdrop" *ngIf="showModal" (click)="closeModal()">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3 style="display:flex;align-items:center;gap:8px;">
              <span class="material-icons" style="color:var(--accent-primary);">domain</span>
              {{ isEditMode ? 'Edit Department' : 'Add Department' }}
            </h3>
            <button class="modal-close" (click)="closeModal()">
              <span class="material-icons">close</span>
            </button>
          </div>

          <form (ngSubmit)="saveDepartment()" id="dept-form">
            <div class="form-group" style="margin-bottom:16px;">
              <label for="dept-name">Department Name *</label>
              <input
                id="dept-name"
                class="form-control"
                type="text"
                [(ngModel)]="activeDept.name"
                name="name"
                placeholder="e.g. Engineering, HR, Sales"
                required
              />
            </div>

            <div class="form-group" style="margin-bottom:24px;">
              <label for="dept-desc">Description</label>
              <textarea
                id="dept-desc"
                class="form-control"
                rows="3"
                [(ngModel)]="activeDept.description"
                name="description"
                placeholder="Brief summary of department responsibilities..."
              ></textarea>
            </div>

            <div class="form-actions">
              <button type="button" class="btn btn-outline" (click)="closeModal()">Cancel</button>
              <button type="submit" class="btn btn-primary" [disabled]="submitting" id="save-dept-btn">
                <span class="material-icons" style="font-size:16px;" *ngIf="!submitting">save</span>
                {{ submitting ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Create Department') }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Delete Modal -->
      <div class="modal-backdrop" *ngIf="deptToDelete" (click)="deptToDelete = null">
        <div class="modal" style="max-width:420px;" (click)="$event.stopPropagation()">
          <div style="text-align:center;padding:16px 0;">
            <div style="width:60px;height:60px;background:rgba(255,100,34,0.14);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;border:1px solid rgba(255,100,34,0.3);">
              <span class="material-icons" style="color:var(--accent-primary);font-size:30px;">warning</span>
            </div>
            <h3>Delete Department?</h3>
            <p style="margin-top:8px;">Are you sure you want to delete <strong style="color:#fff;">{{ deptToDelete?.name }}</strong>?</p>
            <div style="display:flex;gap:12px;justify-content:center;margin-top:24px;">
              <button class="btn btn-outline" (click)="deptToDelete = null">Cancel</button>
              <button class="btn btn-danger" (click)="deleteDepartment()" id="confirm-dept-delete">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .dept-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 20px;
    }

    .dept-card {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 16px;
      padding: 22px;
    }

    .dept-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .dept-icon {
      width: 44px;
      height: 44px;
      border-radius: var(--radius-md);
      background: var(--gradient-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      box-shadow: 0 4px 18px rgba(255, 100, 34, 0.35);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    .dept-icon .material-icons { font-size: 22px; }

    .dept-actions {
      display: flex;
      gap: 6px;
    }

    .dept-title {
      font-size: 1.15rem;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 6px;
    }

    .dept-desc {
      font-size: 13px;
      color: var(--text-muted);
      line-height: 1.5;
    }

    .dept-footer {
      padding-top: 14px;
      border-top: 1px solid var(--border-subtle);
      display: flex;
      align-items: center;
    }
  `]
})
export class DepartmentListComponent implements OnInit {

  departments: Department[] = [];
  loading = true;
  submitting = false;

  showModal = false;
  isEditMode = false;
  activeDept: Partial<Department> = { name: '', description: '' };
  deptToDelete: Department | null = null;

  constructor(
    private departmentService: DepartmentService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.loadDepartments();
  }

  loadDepartments() {
    this.loading = true;
    this.departmentService.getAllDepartments().subscribe({
      next: (data) => {
        this.departments = data;
        this.loading = false;
      },
      error: () => {
        this.toastService.error('Failed to load departments');
        this.loading = false;
      }
    });
  }

  openAddModal() {
    this.isEditMode = false;
    this.activeDept = { name: '', description: '' };
    this.showModal = true;
  }

  openEditModal(dept: Department) {
    this.isEditMode = true;
    this.activeDept = { ...dept };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.activeDept = { name: '', description: '' };
  }

  saveDepartment() {
    if (!this.activeDept.name?.trim()) {
      this.toastService.error('Department name is required');
      return;
    }

    this.submitting = true;

    if (this.isEditMode && this.activeDept.id) {
      this.departmentService.updateDepartment(this.activeDept.id, this.activeDept).subscribe({
        next: () => {
          this.toastService.success('Department updated successfully');
          this.submitting = false;
          this.closeModal();
          this.loadDepartments();
        },
        error: () => {
          this.toastService.error('Failed to update department');
          this.submitting = false;
        }
      });
    } else {
      this.departmentService.createDepartment(this.activeDept).subscribe({
        next: () => {
          this.toastService.success('Department created successfully');
          this.submitting = false;
          this.closeModal();
          this.loadDepartments();
        },
        error: () => {
          this.toastService.error('Failed to create department');
          this.submitting = false;
        }
      });
    }
  }

  confirmDelete(dept: Department) {
    this.deptToDelete = dept;
  }

  deleteDepartment() {
    if (!this.deptToDelete) return;

    this.departmentService.deleteDepartment(this.deptToDelete.id).subscribe({
      next: () => {
        this.toastService.success(`${this.deptToDelete!.name} department deleted`);
        this.deptToDelete = null;
        this.loadDepartments();
      },
      error: () => {
        this.toastService.error('Failed to delete department');
        this.deptToDelete = null;
      }
    });
  }
}
