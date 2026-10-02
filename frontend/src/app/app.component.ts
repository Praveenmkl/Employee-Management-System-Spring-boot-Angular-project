import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ToastComponent } from './components/toast/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, ToastComponent],
  template: `
    <div class="app-shell">
      <app-sidebar />
      <main class="main-content">
        <router-outlet />
      </main>
    </div>
    <app-toast />
  `,
  styles: [`
    .app-shell {
      display: flex;
      height: 100vh;
      overflow: hidden;
      background: #040405;
    }
    .main-content {
      flex: 1;
      overflow-y: auto;
      padding: 32px;
      background-color: #040405;
      background-image: 
        radial-gradient(circle at 10% 10%, rgba(255, 160, 30, 0.08) 0%, transparent 40%),
        radial-gradient(circle at 90% 90%, rgba(255, 85, 0, 0.06) 0%, transparent 40%),
        radial-gradient(rgba(255, 180, 50, 0.04) 1px, transparent 1px);
      background-size: 100% 100%, 100% 100%, 28px 28px;
    }
    @media (max-width: 768px) {
      .app-shell { flex-direction: column; }
      .main-content { padding: 18px; }
    }
  `]
})
export class AppComponent {
  title = 'Employee Management System';
}
