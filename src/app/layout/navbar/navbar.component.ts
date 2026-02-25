import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../core/models';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="navbar">
      <div class="navbar-left">
        <button class="toggle-btn" (click)="toggleSidebar.emit()">
          <i class="pi pi-bars"></i>
        </button>
        <span class="page-title">{{ pageTitle }}</span>
      </div>

      <div class="navbar-right">
        <div class="user-menu" *ngIf="user">
          <div class="avatar">{{ getInitials(user) }}</div>
          <span class="user-name">{{ user.firstName }} {{ user.lastName }}</span>
        </div>
      </div>
    </header>
  `
})
export class NavbarComponent {
  @Input() pageTitle = 'Dashboard';
  @Input() user: User | null = null;

  @Output() toggleSidebar = new EventEmitter<void>();

  getInitials(user: User): string {
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  }
}