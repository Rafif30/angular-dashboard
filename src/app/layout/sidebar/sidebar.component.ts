import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models';

export interface MenuItem {
  label: string;
  icon: string;
  route?: string;
  action?: string;
  children?: MenuItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside [class]="'sidebar' + (collapsed ? ' collapsed' : '')">
      <!-- Header -->
      <div class="sidebar-header">
        <div class="brand-logo">A</div>
        <span class="brand-name">AdminPanel</span>
      </div>

      <!-- Menu -->
      <nav class="sidebar-menu">
        <div class="menu-section">
          <div class="menu-label">Main Menu</div>

          <!-- Home -->
          <a
            class="menu-item"
            routerLink="/dashboard/home"
            routerLinkActive="active"
          >
            <i class="pi pi-home"></i>
            <span>Home</span>
          </a>

          <!-- Products with submenu -->
          <div
            class="menu-item"
            [class.active]="productsExpanded"
            (click)="toggleProducts()"
            style="cursor: pointer; justify-content: space-between;"
          >
            <div style="display: flex; align-items: center; gap: 12px;">
              <i class="pi pi-box"></i>
              <span>Products</span>
            </div>
            <i
              class="pi menu-arrow"
              [class.pi-chevron-down]="productsExpanded"
              [class.pi-chevron-right]="!productsExpanded"
              style="font-size: 12px;"
            ></i>
          </div>

          <!-- Product Submenu -->
          <div class="submenu" *ngIf="productsExpanded && !collapsed">
            <a
              class="menu-item"
              routerLink="/dashboard/products"
              [routerLinkActiveOptions]="{exact: true}"
              routerLinkActive="active"
            >
              <i class="pi pi-list"></i>
              <span>List Products</span>
            </a>
            <a
              class="menu-item"
              routerLink="/dashboard/products/add"
              routerLinkActive="active"
            >
              <i class="pi pi-plus"></i>
              <span>Add Product</span>
            </a>
          </div>
        </div>
      </nav>

      <!-- Footer -->
      <div class="sidebar-footer">
        <div class="user-info" *ngIf="user">
          <div class="user-avatar">
            {{ getInitials(user) }}
          </div>
          <div class="user-details" *ngIf="!collapsed">
            <div class="user-name">{{ user.firstName }} {{ user.lastName }}</div>
            <div class="user-role">@{{ user.username }}</div>
          </div>
        </div>

        <!-- Logout -->
        <div
          class="menu-item logout-item"
          style="margin-top: 32px; padding-left: 10px;"
          (click)="onLogout()"
        >
          <i class="pi pi-sign-out"></i>
          <span *ngIf="!collapsed">Logout</span>
        </div>
      </div>
    </aside>
  `
})
export class SidebarComponent {
  @Input() collapsed = false;
  @Input() user: User | null = null;

  @Output() collapseToggle = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  productsExpanded = true;

  toggleProducts(): void {
    this.productsExpanded = !this.productsExpanded;
  }

  getInitials(user: User): string {
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  }

  onLogout(): void {
    this.logout.emit();
  }
}