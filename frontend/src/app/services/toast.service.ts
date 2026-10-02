import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

/**
 * Toast notification service — shows success/error messages app-wide.
 */
@Injectable({ providedIn: 'root' })
export class ToastService {

  private toasts$ = new BehaviorSubject<Toast[]>([]);
  toasts = this.toasts$.asObservable();
  private idCounter = 0;

  show(message: string, type: 'success' | 'error' | 'info' = 'info', duration = 3500) {
    const toast: Toast = { id: ++this.idCounter, message, type };
    this.toasts$.next([...this.toasts$.value, toast]);
    setTimeout(() => this.remove(toast.id), duration);
  }

  success(message: string) { this.show(message, 'success'); }
  error(message: string)   { this.show(message, 'error'); }
  info(message: string)    { this.show(message, 'info'); }

  remove(id: number) {
    this.toasts$.next(this.toasts$.value.filter(t => t.id !== id));
  }
}
