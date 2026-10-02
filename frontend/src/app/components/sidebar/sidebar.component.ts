import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
    <aside class="sidebar">

      <!-- Logo -->
      <div class="sidebar-logo">
        <div class="logo-icon">
          <span class="material-icons">business_center</span>
        </div>
        <div class="logo-text">
          <span class="logo-title">EMS</span>
          <span class="logo-sub">Management System</span>
        </div>
      </div>

      <!-- Nav -->
      <nav class="sidebar-nav">
        <span class="nav-section-label">Main Menu</span>
        <a
          *ngFor="let item of navItems"
          [routerLink]="item.route"
          routerLinkActive="active"
          class="nav-item"
        >
          <span class="material-icons nav-icon">{{ item.icon }}</span>
          <span class="nav-label">{{ item.label }}</span>
          <span class="nav-indicator"></span>
        </a>
      </nav>

      <!-- Footer -->
      <div class="sidebar-footer">
        <div class="user-card">
          <div class="user-avatar">AD</div>
          <div class="user-meta">
            <span class="user-name">Admin</span>
            <span class="user-role">System Administrator</span>
          </div>
          <span class="material-icons" style="color:var(--text-muted);font-size:18px;margin-left:auto;">more_vert</span>
        </div>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: var(--sidebar-width);
      min-width: var(--sidebar-width);
      height: 100vh;
      background: rgba(8, 7, 10, 0.9);
      border-right: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      backdrop-filter: blur(24px);
    }

    /* Logo */
    .sidebar-logo {
      display: flex;
      align-items: center;
      gap: 13px;
      padding: 24px 20px;
      border-bottom: 1px solid var(--border-color);
    }

    .logo-icon {
      width: 42px;
      height: 42px;
      border-radius: var(--radius-md);
      background: var(--gradient-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid rgba(255, 230, 150, 0.4);
      flex-shrink: 0;
    }
    .logo-icon .material-icons { color: #000000; font-size: 22px; font-weight: 800; }

    .logo-title {
      display: block;
      font-size: 16px;
      font-weight: 800;
      letter-spacing: 0.06em;
      background: var(--gradient-gold-text);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .logo-sub {
      display: block;
      font-size: 10.5px;
      color: var(--text-muted);
      letter-spacing: 0.04em;
      font-weight: 500;
      margin-top: 1px;
    }

    /* Nav */
    .sidebar-nav {
      flex: 1;
      padding: 20px 12px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      overflow-y: auto;
    }

    .nav-section-label {
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.14em;
      color: var(--text-muted);
      padding: 0 10px;
      margin-bottom: 8px;
      margin-top: 6px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 11px 14px;
      border-radius: var(--radius-md);
      color: var(--text-secondary);
      text-decoration: none;
      font-size: 13.5px;
      font-weight: 600;
      transition: all var(--t-normal);
      position: relative;
    }

    .nav-item:hover {
      background: rgba(255, 180, 50, 0.06);
      color: #ffffff;
    }

    .nav-item.active {
      background: rgba(255, 180, 50, 0.12);
      color: #ffffff;
      border: 1px solid rgba(255, 180, 50, 0.35);
    }

    .nav-item.active .nav-icon {
      color: var(--accent-gold);
    }

    .nav-indicator {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 4px;
      height: 0;
      background: var(--gradient-primary);
      border-radius: 4px 0 0 4px;
      transition: height var(--t-normal);
    }

    .nav-item.active .nav-indicator { height: 65%; }

    .nav-icon { font-size: 20px; color: inherit; transition: color var(--t-fast); }
    .nav-label { flex: 1; }

    /* Footer */
    .sidebar-footer {
      padding: 16px;
      border-top: 1px solid var(--border-color);
      background: rgba(0, 0, 0, 0.3);
    }

    .user-card {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 12px;
      border-radius: var(--radius-md);
      cursor: pointer;
      border: 1px solid transparent;
      transition: all var(--t-fast);
    }
    .user-card:hover {
      background: rgba(255, 180, 50, 0.06);
      border-color: rgba(255, 180, 50, 0.25);
    }

    .user-avatar {
      width: 36px;
      height: 36px;
      border-radius: var(--radius-sm);
      background: var(--gradient-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 800;
      color: #000000;
      flex-shrink: 0;
      border: 1px solid rgba(255, 230, 150, 0.4);
    }

    .user-name {
      display: block;
      font-size: 13.5px;
      font-weight: 700;
      color: var(--text-primary);
      line-height: 1.2;
    }
    .user-role {
      display: block;
      font-size: 11px;
      color: var(--text-muted);
      font-weight: 500;
    }

    @media (max-width: 768px) {
      .sidebar {
        width: 100%;
        height: auto;
        flex-direction: row;
        border-right: none;
        border-bottom: 1px solid var(--border-color);
      }
      .sidebar-nav { flex-direction: row; padding: 8px 12px; overflow-x: auto; }
      .sidebar-logo { padding: 12px 16px; border-bottom: none; }
      .sidebar-footer, .logo-text { display: none; }
      .nav-label, .nav-section-label { display: none; }
      .nav-indicator { display: none; }
      .nav-item { padding: 8px 12px; }
    }
  `]
})
export class SidebarComponent {
  navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { label: 'Employees', icon: 'people', route: '/employees' },
    { label: 'Departments', icon: 'domain', route: '/departments' },
  ];
}
