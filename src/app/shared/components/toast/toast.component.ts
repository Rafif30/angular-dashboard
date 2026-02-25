import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      <div
        *ngFor="let msg of toastService.messages()"
        [class]="'toast ' + msg.type"
        style="display: flex; align-items: center; gap: 10px;"
      >
        <i [class]="getIcon(msg.type)"></i>
        {{ msg.message }}
        <button
          (click)="toastService.remove(msg.id!)"
          style="margin-left: auto; background: none; border: none; color: inherit; cursor: pointer; font-size: 16px;"
        >
          <i class="pi pi-times"></i>
        </button>
      </div>
    </div>
  `
})
export class ToastComponent {
  toastService = inject(ToastService);

  getIcon(type: string): string {
    const icons: Record<string, string> = {
      success: 'pi pi-check-circle',
      error: 'pi pi-times-circle',
      warning: 'pi pi-exclamation-triangle',
      info: 'pi pi-info-circle'
    };
    return icons[type] || 'pi pi-info-circle';
  }
}