import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ProductService } from '../../core/services/product.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div>
      <!-- Welcome -->
      <div class="welcome-section">
        <h1>Hello, {{ user()?.firstName }} {{ user()?.lastName }}! 👋</h1>
        <p>Welcome back to your admin dashboard. Here's what's happening today.</p>
      </div>

      <!-- Stats -->
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px; margin-bottom: 24px;">
        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #1e3a5f, #4a9eff);">
            <i class="pi pi-box"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ totalProducts() }}</div>
            <div class="stat-label">Total Products</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #43a047, #66bb6a);">
            <i class="pi pi-check-circle"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">Active</div>
            <div class="stat-label">System Status</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #e65100, #ff9800);">
            <i class="pi pi-user"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ user()?.username }}</div>
            <div class="stat-label">Logged in as</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #7b1fa2, #ce93d8);">
            <i class="pi pi-star"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">Admin</div>
            <div class="stat-label">Role</div>
          </div>
        </div>
      </div>

      <!-- User Info Card -->
      <div class="card">
        <h3 style="font-size: 16px; font-weight: 600; color: #1e3a5f; margin-bottom: 16px;">
          <i class="pi pi-user" style="margin-right: 8px;"></i>
          Your Profile
        </h3>
        <div *ngIf="user()">
          <div class="info-row">
            <span class="info-label">Full Name</span>
            <span class="info-value">{{ user()?.firstName }} {{ user()?.lastName }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Username</span>
            <span class="info-value">{{ user()?.username }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Email</span>
            <span class="info-value">{{ user()?.email }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Gender</span>
            <span class="info-value" style="text-transform: capitalize;">{{ user()?.gender }}</span>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="card">
        <h3 style="font-size: 16px; font-weight: 600; color: #1e3a5f; margin-bottom: 16px;">
          <i class="pi pi-bolt" style="margin-right: 8px;"></i>
          Quick Actions
        </h3>
        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
          <a routerLink="/dashboard/products" class="btn btn-primary">
            <i class="pi pi-list"></i>
            View All Products
          </a>
          <a routerLink="/dashboard/products/add" class="btn btn-success">
            <i class="pi pi-plus"></i>
            Add New Product
          </a>
        </div>
      </div>
    </div>
  `
})
export class HomeComponent implements OnInit {
  private authService = inject(AuthService);
  private productService = inject(ProductService);

  user = this.authService.currentUser;
  totalProducts = signal(0);

  ngOnInit(): void {
    this.productService.getProducts(1, 0).subscribe({
      next: (res) => this.totalProducts.set(res.total)
    });
  }
}