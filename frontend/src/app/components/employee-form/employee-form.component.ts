import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { DepartmentService } from '../../services/department.service';
import { ToastService } from '../../services/toast.service';
import { Department } from '../../models/employee.model';

/**
 * EmployeeFormComponent — Step 16: Reactive Forms
 * Handles both CREATE (POST) and UPDATE (PUT) based on route param.
 */
@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div style="max-width:760px;margin:0 auto;animation:fadeIn 0.3s ease;">

      <!-- Header -->
      <div class="page-header">
        <div>
          <h1>{{ isEditMode ? 'Edit Employee' : 'Add New Employee' }}</h1>
          <p class="page-subtitle">{{ isEditMode ? 'Update employee information' : 'Fill in the details to add a new team member' }}</p>
        </div>
        <a routerLink="/employees" class="btn btn-outline">
          <span class="material-icons" style="font-size:18px;">arrow_back</span>
          Back to List
        </a>
      </div>

      <!-- Form Card -->
      <div class="card" *ngIf="!pageLoading">
        <form [formGroup]="employeeForm" (ngSubmit)="onSubmit()" id="employee-form">

          <!-- Section: Personal Info -->
          <div class="form-section">
            <div class="section-title">
              <span class="material-icons section-icon">person</span>
              Personal Information
            </div>
            <div class="form-grid">
              <div class="form-group">
                <label for="firstName">First Name *</label>
                <input
                  id="firstName"
                  class="form-control"
                  [class.is-invalid]="isInvalid('firstName')"
                  formControlName="firstName"
                  placeholder="e.g. Arjun"
                />
                <span class="invalid-feedback" *ngIf="isInvalid('firstName')">
                  {{ getError('firstName') }}
                </span>
              </div>

              <div class="form-group">
                <label for="lastName">Last Name *</label>
                <input
                  id="lastName"
                  class="form-control"
                  [class.is-invalid]="isInvalid('lastName')"
                  formControlName="lastName"
                  placeholder="e.g. Kumar"
                />
                <span class="invalid-feedback" *ngIf="isInvalid('lastName')">
                  {{ getError('lastName') }}
                </span>
              </div>

              <div class="form-group">
                <label for="email">Email Address *</label>
                <input
                  id="email"
                  type="email"
                  class="form-control"
                  [class.is-invalid]="isInvalid('email')"
                  formControlName="email"
                  placeholder="arjun@example.com"
                />
                <span class="invalid-feedback" *ngIf="isInvalid('email')">
                  {{ getError('email') }}
                </span>
              </div>

              <div class="form-group">
                <label for="phone">Phone Number</label>
                <input
                  id="phone"
                  class="form-control"
                  formControlName="phone"
                  placeholder="9876543210"
                />
              </div>

              <div class="form-group form-full">
                <label for="address">Address</label>
                <input
                  id="address"
                  class="form-control"
                  formControlName="address"
                  placeholder="12, Anna Nagar, Chennai"
                />
              </div>

              <div class="form-group">
                <label for="dateOfBirth">Date of Birth</label>
                <input
                  id="dateOfBirth"
                  type="date"
                  class="form-control"
                  formControlName="dateOfBirth"
                />
              </div>
            </div>
          </div>

          <!-- Section: Job Info -->
          <div class="form-section">
            <div class="section-title">
              <span class="material-icons section-icon">work</span>
              Job Information
            </div>
            <div class="form-grid">
              <div class="form-group">
                <label for="position">Position *</label>
                <input
                  id="position"
                  class="form-control"
                  [class.is-invalid]="isInvalid('position')"
                  formControlName="position"
                  placeholder="Software Engineer"
                />
                <span class="invalid-feedback" *ngIf="isInvalid('position')">
                  {{ getError('position') }}
                </span>
              </div>

              <div class="form-group">
                <label for="departmentId">Department</label>
                <select id="departmentId" class="form-control" formControlName="departmentId">
                  <option [value]="null">— No Department —</option>
                  <option *ngFor="let dept of departments" [value]="dept.id">{{ dept.name }}</option>
                </select>
              </div>

              <div class="form-group">
                <label for="salary">Salary (₹) *</label>
                <input
                  id="salary"
                  type="number"
                  class="form-control"
                  [class.is-invalid]="isInvalid('salary')"
                  formControlName="salary"
                  placeholder="75000"
                  min="0"
                />
                <span class="invalid-feedback" *ngIf="isInvalid('salary')">
                  {{ getError('salary') }}
                </span>
              </div>

              <div class="form-group">
                <label for="hireDate">Hire Date</label>
                <input
                  id="hireDate"
                  type="date"
                  class="form-control"
                  formControlName="hireDate"
                />
              </div>

              <div class="form-group">
                <label for="status">Employment Status</label>
                <select id="status" class="form-control" formControlName="status">
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="ON_LEAVE">On Leave</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="form-actions">
            <a routerLink="/employees" class="btn btn-outline">Cancel</a>
            <button
              type="submit"
              class="btn btn-primary"
              id="submit-btn"
              [disabled]="submitting"
            >
              <span class="material-icons" style="font-size:18px;" *ngIf="!submitting">
                {{ isEditMode ? 'save' : 'person_add' }}
              </span>
              <span *ngIf="submitting" style="font-size:18px;">⏳</span>
              {{ submitting ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Add Employee') }}
            </button>
          </div>

        </form>
      </div>

      <!-- Page loading skeleton -->
      <div *ngIf="pageLoading" class="card">
        <div class="skeleton" style="height:32px;width:200px;margin-bottom:24px;"></div>
        <div class="form-grid">
          <div class="skeleton" style="height:48px;" *ngFor="let i of [1,2,3,4,5,6]"></div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .form-section {
      margin-bottom: 28px;
      padding-bottom: 24px;
      border-bottom: 1px solid var(--border-color);
    }
    .form-section:last-of-type { border-bottom: none; margin-bottom: 0; }

    .section-title {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 15px;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 18px;
    }

    .section-icon {
      color: var(--accent-primary);
      font-size: 20px;
    }
  `]
})
export class EmployeeFormComponent implements OnInit {

  employeeForm!: FormGroup;
  departments: Department[] = [];
  isEditMode = false;
  employeeId!: number;
  submitting = false;
  pageLoading = false;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.buildForm();
    this.loadDepartments();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.employeeId = +id;
      this.loadEmployee(this.employeeId);
    }
  }

  buildForm() {
    this.employeeForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      address: [''],
      dateOfBirth: [''],
      hireDate: [''],
      salary: [null, [Validators.required, Validators.min(1)]],
      position: ['', Validators.required],
      departmentId: [null],
      status: ['ACTIVE']
    });
  }

  loadDepartments() {
    this.departmentService.getAllDepartments().subscribe({
      next: (data) => this.departments = data,
      error: () => { }  // optional — departments dropdown stays empty
    });
  }

  loadEmployee(id: number) {
    this.pageLoading = true;
    this.employeeService.getEmployeeById(id).subscribe({
      next: (emp) => {
        this.employeeForm.patchValue({
          firstName: emp.firstName,
          lastName: emp.lastName,
          email: emp.email,
          phone: emp.phone,
          address: emp.address,
          dateOfBirth: emp.dateOfBirth,
          hireDate: emp.hireDate,
          salary: emp.salary,
          position: emp.position,
          departmentId: emp.departmentId ?? null,
          status: emp.status || 'ACTIVE'
        });
        this.pageLoading = false;
      },
      error: () => {
        this.toastService.error('Employee not found');
        this.router.navigate(['/employees']);
      }
    });
  }

  onSubmit() {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    const rawValue = this.employeeForm.value;
    const request = {
      ...rawValue,
      departmentId: rawValue.departmentId ? +rawValue.departmentId : null,
      salary: +rawValue.salary
    };

    this.submitting = true;

    if (this.isEditMode) {
      this.employeeService.updateEmployee(this.employeeId, request).subscribe({
        next: () => {
          this.toastService.success('Employee updated successfully!');
          this.router.navigate(['/employees', this.employeeId]);
        },
        error: (err) => {
          const msg = err.error?.message || 'Failed to update employee';
          this.toastService.error(msg);
          this.submitting = false;
        }
      });
    } else {
      this.employeeService.createEmployee(request).subscribe({
        next: (created) => {
          this.toastService.success('Employee added successfully!');
          this.router.navigate(['/employees', created.id]);
        },
        error: (err) => {
          const msg = err.error?.message || 'Failed to create employee';
          this.toastService.error(msg);
          this.submitting = false;
        }
      });
    }
  }

  // ── Form helpers ─────────────────────────────────────────────────────
  isInvalid(field: string): boolean {
    const ctrl = this.employeeForm.get(field);
    return !!(ctrl && ctrl.invalid && ctrl.touched);
  }

  getError(field: string): string {
    const ctrl = this.employeeForm.get(field);
    if (!ctrl || !ctrl.errors) return '';
    if (ctrl.errors['required']) return `${field} is required`;
    if (ctrl.errors['email']) return 'Enter a valid email address';
    if (ctrl.errors['minlength']) return `Minimum ${ctrl.errors['minlength'].requiredLength} characters`;
    if (ctrl.errors['min']) return 'Must be a positive number';
    return 'Invalid value';
  }
}
