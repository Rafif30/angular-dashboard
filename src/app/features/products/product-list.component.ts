import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';
import { ProductService } from '../../core/services/product.service';
import { ToastService } from '../../core/services/toast.service';
import { Product } from '../../core/models';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, PaginationComponent, ModalComponent],
  template: `
    <div>
      <!-- Header -->
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px;">
        <div>
          <h2 style="font-size: 20px; font-weight: 700; color: #1e3a5f;">Product Management</h2>
          <p style="font-size: 13px; color: #888; margin-top: 4px;">Manage all your products in one place</p>
        </div>
        <a routerLink="/dashboard/products/add" class="btn btn-primary">
          <i class="pi pi-plus"></i>
          Add Product
        </a>
      </div>

      <!-- Search & Filter Card -->
      <div class="card" style="margin-bottom: 20px; padding: 16px;">
        <div class="search-bar" style="max-width: 400px;">
          <i class="pi pi-search" style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:#aaa;z-index:1;"></i>
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (ngModelChange)="onSearch($event)"
            placeholder="Search products..."
            class="form-control"
            style="padding-left: 36px;"
          />
        </div>
      </div>

      <!-- Table Card -->
      <div class="card" style="padding: 0; overflow: hidden;">
        <!-- Loading -->
        <div class="spinner-wrapper" *ngIf="loading()">
          <div class="spinner"></div>
        </div>

        <!-- Table -->
        <div style="overflow-x: auto;" *ngIf="!loading()">
          <table class="data-table">
            <thead>
              <tr>
                <th style="width: 60px;">#</th>
                <th style="width: 80px;">Image</th>
                <th>Title</th>
                <th>Brand</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Rating</th>
                <th style="width: 150px;">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let product of products(); let i = index">
                <td style="color: #888; font-size: 13px;">{{ (currentPage() - 1) * pageSize + i + 1 }}</td>
                <td>
                  <img
                    [src]="product.thumbnail"
                    [alt]="product.title"
                    style="width: 48px; height: 48px; object-fit: cover; border-radius: 8px; background: #f5f5f5;"
                    onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2248%22 height=%2248%22><rect width=%2248%22 height=%2248%22 fill=%22%23f5f5f5%22/><text x=%2224%22 y=%2228%22 font-size=%2216%22 text-anchor=%22middle%22 fill=%22%23ccc%22>📦</text></svg>'"
                  />
                </td>
                <td>
                  <div style="font-weight: 600; font-size: 14px; color: #1e3a5f; max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                    {{ product.title }}
                  </div>
                </td>
                <td style="font-size: 13px; color: #555;">{{ product.brand }}</td>
                <td>
                  <span class="badge-category">{{ product.category }}</span>
                </td>
                <td>
                  <span style="font-weight: 700; color: #1e3a5f;">\${{ product.price | number:'1.2-2' }}</span>
                </td>
                <td>
                  <span [class]="getStockClass(product.stock)">
                    {{ product.stock }}
                  </span>
                </td>
                <td>
                  <div class="rating-stars">
                    <i class="pi pi-star-fill" style="font-size: 12px;"></i>
                    <span style="font-size: 13px; color: #555;">{{ product.rating | number:'1.1-1' }}</span>
                  </div>
                </td>
                <td>
                  <div class="actions">
                    <a
                      [routerLink]="['/dashboard/products/detail', product.id]"
                      class="btn btn-info btn-sm"
                      title="View Detail"
                    >
                      <i class="pi pi-eye"></i>
                    </a>
                    <a
                      [routerLink]="['/dashboard/products/edit', product.id]"
                      class="btn btn-warning btn-sm"
                      title="Edit"
                    >
                      <i class="pi pi-pencil"></i>
                    </a>
                    <button
                      class="btn btn-danger btn-sm"
                      title="Delete"
                      (click)="openDeleteModal(product)"
                    >
                      <i class="pi pi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Empty state -->
          <div class="empty-state" *ngIf="products().length === 0 && !loading()">
            <i class="pi pi-inbox"></i>
            <h3>No products found</h3>
            <p>{{ searchQuery ? 'Try a different search term' : 'Start by adding a new product' }}</p>
          </div>
        </div>

        <!-- Pagination -->
        <div style="padding: 16px;" *ngIf="!loading() && total() > 0">
          <app-pagination
            [currentPage]="currentPage()"
            [pageSize]="pageSize"
            [total]="total()"
            (pageChange)="onPageChange($event)"
          ></app-pagination>
        </div>
      </div>

      <!-- Delete Modal -->
      <app-modal
        [isOpen]="deleteModalOpen()"
        title="Delete Product"
        confirmLabel="Delete"
        confirmVariant="danger"
        [confirmLoading]="deleteLoading()"
        (close)="deleteModalOpen.set(false)"
        (cancel)="deleteModalOpen.set(false)"
        (confirm)="confirmDelete()"
      >
        <div style="text-align: center; padding: 20px 0;">
          <i class="pi pi-exclamation-triangle" style="font-size: 48px; color: #f44336; margin-bottom: 16px; display: block;"></i>
          <p style="font-size: 15px; color: #555;">
            Are you sure you want to delete<br>
            <strong style="color: #1e3a5f;">{{ productToDelete()?.title }}</strong>?
          </p>
          <p style="font-size: 13px; color: #aaa; margin-top: 8px;">This action cannot be undone.</p>
        </div>
      </app-modal>
    </div>
  `
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);
  private toastService = inject(ToastService);

  products = signal<Product[]>([]);
  total = signal(0);
  loading = signal(false);
  currentPage = signal(1);
  pageSize = 10;

  searchQuery = '';
  deleteModalOpen = signal(false);
  deleteLoading = signal(false);
  productToDelete = signal<Product | null>(null);

  private searchSubject = new Subject<string>();

  ngOnInit(): void {
    this.loadProducts();

    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(query => {
        this.loading.set(true);
        if (query) {
          return this.productService.searchProducts(query, this.pageSize, 0);
        }
        return this.productService.getProducts(this.pageSize, 0);
      })
    ).subscribe({
      next: (res) => {
        this.products.set(res.products);
        this.total.set(res.total);
        this.currentPage.set(1);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.toastService.error('Failed to search products');
      }
    });
  }

  loadProducts(): void {
    this.loading.set(true);
    const skip = (this.currentPage() - 1) * this.pageSize;
    this.productService.getProducts(this.pageSize, skip).subscribe({
      next: (res) => {
        this.products.set(res.products);
        this.total.set(res.total);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.toastService.error('Failed to load products');
      }
    });
  }

  onSearch(query: string): void {
    this.searchSubject.next(query);
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    this.loadProducts();
  }

  getStockClass(stock: number): string {
    if (stock === 0) return 'stock-badge out-stock';
    if (stock < 10) return 'stock-badge low-stock';
    return 'stock-badge in-stock';
  }

  openDeleteModal(product: Product): void {
    this.productToDelete.set(product);
    this.deleteModalOpen.set(true);
  }

  confirmDelete(): void {
    const product = this.productToDelete();
    if (!product) return;

    this.deleteLoading.set(true);
    this.productService.deleteProduct(product.id).subscribe({
      next: () => {
        this.toastService.success(`"${product.title}" deleted successfully`);
        this.deleteModalOpen.set(false);
        this.deleteLoading.set(false);
        // Remove from local list
        this.products.update(list => list.filter(p => p.id !== product.id));
        this.total.update(t => t - 1);
      },
      error: () => {
        this.deleteLoading.set(false);
        this.toastService.error('Failed to delete product');
      }
    });
  }
}