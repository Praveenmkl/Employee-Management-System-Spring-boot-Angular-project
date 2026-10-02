import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'employees',
    loadComponent: () =>
      import('./components/employee-list/employee-list.component').then(m => m.EmployeeListComponent)
  },
  {
    path: 'employees/new',
    loadComponent: () =>
      import('./components/employee-form/employee-form.component').then(m => m.EmployeeFormComponent)
  },
  {
    path: 'employees/edit/:id',
    loadComponent: () =>
      import('./components/employee-form/employee-form.component').then(m => m.EmployeeFormComponent)
  },
  {
    path: 'employees/:id',
    loadComponent: () =>
      import('./components/employee-detail/employee-detail.component').then(m => m.EmployeeDetailComponent)
  },
  {
    path: 'departments',
    loadComponent: () =>
      import('./components/department-list/department-list.component').then(m => m.DepartmentListComponent)
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
