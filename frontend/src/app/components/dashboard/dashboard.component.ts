import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { EmployeeResponse } from '../../models/employee.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard">

      <!-- Page Header -->
      <div class="page-header">
        <div>
          <h1>Dashboard</h1>
          <p class="page-subtitle">Welcome back, Admin! Here's your workforce overview.</p>
        </div>
        <a routerLink="/employees/new" class="btn btn-primary">
          <span class="material-icons" style="font-size:18px;">add</span>
          Add Employee
        </a>
      </div>

      <!-- Stat Cards -->
      <div class="stats-grid">
        <div class="stat-card" *ngFor="let stat of stats">
          <div class="stat-top">
            <div class="stat-icon" [style.background]="stat.gradient">
              <span class="material-icons">{{ stat.icon }}</span>
            </div>
            <div class="stat-trend" [class]="stat.trendClass">
              <span class="material-icons" style="font-size:13px;">{{ stat.trendIcon }}</span>
              {{ stat.trend }}
            </div>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ stat.value }}</span>
            <span class="stat-label">{{ stat.label }}</span>
          </div>
        </div>
      </div>

      <!-- Recent Employees Table -->
      <div class="card" style="margin-top: 28px;">
        <div class="section-header">
          <h3>Recent Employees</h3>
          <a routerLink="/employees" class="btn btn-outline btn-sm">View All</a>
        </div>

        <div *ngIf="loading" class="loading-rows">
          <div class="skeleton" style="height:48px;margin-bottom:8px;" *ngFor="let i of [1,2,3,4,5]"></div>
        </div>

        <div *ngIf="!loading">
          <div *ngIf="employees.length === 0" class="empty-state">
            <span class="material-icons">people_outline</span>
            <p>No employees found. Add your first employee!</p>
          </div>

          <div class="table-wrapper" *ngIf="employees.length > 0">
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Position</th>
                  <th>Department</th>
                  <th>Salary</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let emp of employees.slice(0, 5)">
                  <td>
                    <div style="display:flex;align-items:center;gap:12px;">
                      <div class="avatar">{{ getInitials(emp) }}</div>
                      <div>
                        <div style="font-weight:600;">{{ emp.firstName }} {{ emp.lastName }}</div>
                        <div style="font-size:12px;color:var(--text-muted);">{{ emp.email }}</div>
                      </div>
                    </div>
                  </td>
                  <td>{{ emp.position }}</td>
                  <td>
                    <span *ngIf="emp.departmentName" class="badge badge-primary">{{ emp.departmentName }}</span>
                    <span *ngIf="!emp.departmentName" class="badge badge-info">No Dept.</span>
                  </td>
                  <td>₹{{ emp.salary | number }}</td>
                  <td>
                    <span class="badge" [class]="getStatusClass(emp.status)">
                      {{ emp.status || 'ACTIVE' }}
                    </span>
                  </td>
                  <td>
                    <a [routerLink]="['/employees', emp.id]" class="btn btn-outline btn-sm">
                      <span class="material-icons" style="font-size:15px;">visibility</span>
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard { animation: fadeIn 0.3s ease; }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
    }

    @media (max-width: 900px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 500px) { .stats-grid { grid-template-columns: 1fr; } }

    /* Card */
    .stat-card {
      display: flex;
      flex-direction: column;
      gap: 14px;
      padding: 20px;
      border-radius: 14px;
      border: 1px solid rgba(255,255,255,0.07);
      background: #0d0d0d;
      transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
      cursor: default;
      overflow: hidden;
      position: relative;
    }

    .stat-card:hover {
      transform: translateY(-3px);
      border-color: rgba(255,100,34,0.35);
      box-shadow: 0 0 30px rgba(255,100,34,0.15);
    }

    /* Top row: icon + trend badge side by side */
    .stat-top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 8px;
    }

    /* Icon box — Golden Glass */
    .stat-icon {
      width: 46px;
      height: 46px;
      min-width: 46px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      flex-shrink: 0;
      border: 1px solid rgba(255, 230, 150, 0.4);
    }

    .stat-icon .material-icons {
      color: #000000;
      font-size: 22px;
      font-weight: 800;
      line-height: 1;
      display: block;
    }

    /* Value + label */
    .stat-info { display: flex; flex-direction: column; gap: 3px; }

    .stat-value {
      font-size: 2.1rem;
      font-weight: 800;
      color: #ffffff;
      line-height: 1;
      letter-spacing: -0.03em;
    }

    .stat-label {
      font-size: 13px;
      color: var(--text-muted);
      font-weight: 500;
    }

    /* Trend badge — Golden Glass Outline */
    .stat-trend {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 11.5px;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 100px;
      white-space: nowrap;
      flex-shrink: 0;
      background: rgba(255, 180, 50, 0.05);
      color: var(--accent-light);
      border: 1px solid rgba(255, 180, 50, 0.35);
      backdrop-filter: blur(10px);
    }

    .trend-up, .trend-down, .trend-neutral {
      background: rgba(255, 180, 50, 0.05);
      color: var(--accent-light);
      border: 1px solid rgba(255, 180, 50, 0.35);
    }

    /* Table section */
    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
    }

    .loading-rows { padding: 8px 0; }
  `]
})
export class DashboardComponent implements OnInit {

  employees: EmployeeResponse[] = [];
  loading = true;

  stats = [
    { label: 'Total Employees',  value: 0, icon: 'groups',     gradient: 'linear-gradient(135deg, #ffb703 0%, #ff9f1c 50%, #ff5500 100%)', trend: '+12%',  trendIcon: 'trending_up', trendClass: 'stat-trend trend-up' },
    { label: 'Active Employees', value: 0, icon: 'how_to_reg', gradient: 'linear-gradient(135deg, #ffb703 0%, #ff9f1c 50%, #ff5500 100%)', trend: '+5%',   trendIcon: 'trending_up', trendClass: 'stat-trend trend-up' },
    { label: 'Departments',      value: 0, icon: 'domain',     gradient: 'linear-gradient(135deg, #ffb703 0%, #ff9f1c 50%, #ff5500 100%)', trend: 'Stable', trendIcon: 'remove',      trendClass: 'stat-trend trend-neutral' },
    { label: 'New This Month',   value: 0, icon: 'person_add', gradient: 'linear-gradient(135deg, #ffb703 0%, #ff9f1c 50%, #ff5500 100%)', trend: '+3',    trendIcon: 'trending_up', trendClass: 'stat-trend trend-up' },
  ];

  constructor(private employeeService: EmployeeService) { }

  ngOnInit() {
    this.employeeService.getAllEmployees().subscribe({
      next: (data) => {
        this.employees = data;
        this.updateStats(data);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  updateStats(employees: EmployeeResponse[]) {
    const active = employees.filter(e => e.status === 'ACTIVE' || !e.status).length;
    const depts = new Set(employees.map(e => e.departmentId).filter(Boolean)).size;
    const now = new Date();
    const newThisMonth = employees.filter(e => {
      if (!e.hireDate) return false;
      const d = new Date(e.hireDate);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;

    this.stats[0].value = employees.length;
    this.stats[1].value = active;
    this.stats[2].value = depts;
    this.stats[3].value = newThisMonth;
  }

  getInitials(emp: EmployeeResponse): string {
    return (emp.firstName[0] + emp.lastName[0]).toUpperCase();
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
