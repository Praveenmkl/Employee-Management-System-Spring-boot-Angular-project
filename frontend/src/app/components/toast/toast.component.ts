import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../services/toast.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      <div
        *ngFor="let toast of (toasts$ | async)"
        class="toast"
        [class]="'toast-' + toast.type"
      >
        <span class="material-icons" style="font-size:18px;">
          {{ toast.type === 'success' ? 'check_circle' : toast.type === 'error' ? 'error' : 'info' }}
        </span>
        {{ toast.message }}
        <button
          (click)="dismiss(toast.id)"
          style="background:none;border:none;color:inherit;cursor:pointer;margin-left:auto;opacity:0.8;font-size:18px;line-height:1;display:flex;"
        >✕</button>
      </div>
    </div>
  `
})
export class ToastComponent {
  toasts$: Observable<Toast[]>;

  constructor(private toastService: ToastService) {
    this.toasts$ = this.toastService.toasts;
  }

  dismiss(id: number) {
    this.toastService.remove(id);
  }
}
