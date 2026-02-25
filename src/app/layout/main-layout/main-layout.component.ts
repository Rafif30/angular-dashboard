import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { ToastComponent } from '../../shared/components/toast/toast.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, NavbarComponent, ToastComponent],
  template: `
    <div class="app-container">
      <!-- Sidebar -->
      <app-sidebar
        [collapsed]="sidebarCollapsed()"
        [user]="authService.currentUser()"
        (collapseToggle)="toggleSidebar()"
        (logout)="handleLogout()"
      ></app-sidebar>

      <!-- Main Wrapper -->
      <div class="main-wrapper">
        <!-- Navbar -->
        <app-navbar
          [pageTitle]="pageTitle()"
          [user]="authService.currentUser()"
          (toggleSidebar)="toggleSidebar()"
        ></app-navbar>

        <!-- Content -->
        <main class="content-area">
          <router-outlet></router-outlet>
        </main>
      </div>

      <!-- Toast -->
      <app-toast></app-toast>
    </div>
  `
})
export class MainLayoutComponent {
  authService = inject(AuthService);
  private router = inject(Router);

  sidebarCollapsed = signal(false);
  pageTitle = signal('Dashboard');

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.updatePageTitle(event.url);
    });
  }

  toggleSidebar(): void {
    this.sidebarCollapsed.update(v => !v);
  }

  handleLogout(): void {
    this.authService.logout();
  }

  private updatePageTitle(url: string): void {
    const titles: Record<string, string> = {
      '/dashboard/home': 'Home',
      '/dashboard/products': 'Products',
      '/dashboard/products/add': 'Add Product',
    };

    if (url.includes('/dashboard/products/edit')) {
      this.pageTitle.set('Edit Product');
    } else if (url.includes('/dashboard/products/detail')) {
      this.pageTitle.set('Product Detail');
    } else {
      this.pageTitle.set(titles[url] || 'Dashboard');
    }
  }
}