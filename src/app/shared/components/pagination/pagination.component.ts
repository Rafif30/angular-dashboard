import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="d-flex align-items-center justify-content-between mt-3">
      <div style="font-size: 13px; color: #888;">
        Showing {{ from }}-{{ to }} of {{ total }} items
      </div>
      <div class="pagination">
        <button
          [disabled]="currentPage === 1"
          (click)="pageChange.emit(currentPage - 1)"
        >
          <i class="pi pi-chevron-left" style="font-size:11px;"></i>
        </button>

        <ng-container *ngFor="let page of pages">
          <button
            *ngIf="page !== -1"
            [class.active]="page === currentPage"
            (click)="pageChange.emit(page)"
          >
            {{ page }}
          </button>
          <span *ngIf="page === -1" style="padding: 0 4px; display:flex;align-items:center;">...</span>
        </ng-container>

        <button
          [disabled]="currentPage === totalPages"
          (click)="pageChange.emit(currentPage + 1)"
        >
          <i class="pi pi-chevron-right" style="font-size:11px;"></i>
        </button>
      </div>
    </div>
  `
})
export class PaginationComponent implements OnChanges {
  @Input() currentPage = 1;
  @Input() pageSize = 10;
  @Input() total = 0;

  @Output() pageChange = new EventEmitter<number>();

  pages: number[] = [];
  totalPages = 1;
  from = 0;
  to = 0;

  ngOnChanges(): void {
    this.totalPages = Math.ceil(this.total / this.pageSize) || 1;
    this.from = (this.currentPage - 1) * this.pageSize + 1;
    this.to = Math.min(this.currentPage * this.pageSize, this.total);
    this.buildPages();
  }

  buildPages(): void {
    const pages: number[] = [];
    const total = this.totalPages;
    const current = this.currentPage;

    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      if (current > 3) pages.push(-1);
      for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
        pages.push(i);
      }
      if (current < total - 2) pages.push(-1);
      pages.push(total);
    }

    this.pages = pages;
  }
}