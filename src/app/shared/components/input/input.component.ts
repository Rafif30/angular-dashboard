import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant = 'primary' | 'info' | 'success' | 'warning' | 'danger' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [class]="getClasses()"
      [disabled]="disabled || loading"
      (click)="onClick.emit($event)"
      [type]="type"
    >
      <span class="spinner" *ngIf="loading" style="width:14px;height:14px;border:2px solid rgba(255,255,255,0.4);border-top-color:white;border-radius:50%;animation:spin 0.8s linear infinite;display:inline-block;"></span>
      <i [class]="icon" *ngIf="icon && !loading"></i>
      <span *ngIf="label">{{ label }}</span>
      <ng-content></ng-content>
    </button>
  `,
  styles: [`
    @keyframes spin { to { transform: rotate(360deg); } }
    button { display: inline-flex; align-items: center; gap: 6px; }
  `]
})
export class ButtonComponent {
  @Input() label?: string;
  @Input() icon?: string;
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() fullWidth = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';

  @Output() onClick = new EventEmitter<MouseEvent>();

  getClasses(): string {
    return [
      'btn',
      `btn-${this.variant}`,
      this.size === 'sm' ? 'btn-sm' : this.size === 'lg' ? 'btn-lg' : '',
      this.fullWidth ? 'w-full' : ''
    ].filter(Boolean).join(' ');
  }
}