import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
  template: `
    <div class="login-page">
      <div class="login-card">
        <div class="login-header">
          <div class="logo">
            <i class="pi pi-shield" style="font-size: 28px;"></i>
          </div>
          <h1>Welcome Back!</h1>
          <p>Sign in to your account to continue</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <!-- Error Alert -->
          <div
            *ngIf="errorMessage()"
            style="padding: 12px 16px; background: #ffebee; border-radius: 8px; margin-bottom: 20px; color: #c62828; font-size: 14px; border-left: 3px solid #f44336; display: flex; align-items: center; gap: 8px;"
          >
            <i class="pi pi-exclamation-triangle"></i>
            {{ errorMessage() }}
          </div>

          <!-- Username -->
          <div class="form-group">
            <label class="form-label">Username</label>
            <div class="input-wrapper">
              <i class="pi pi-user"></i>
              <input
                type="text"
                formControlName="username"
                placeholder="Enter username"
                [class]="'form-control' + (getField('username')?.invalid && getField('username')?.touched ? ' error' : '')"
              />
            </div>
            <div class="error-msg" *ngIf="getField('username')?.invalid && getField('username')?.touched">
              Username is required
            </div>
          </div>

          <!-- Password -->
          <div class="form-group">
            <label class="form-label">Password</label>
            <div class="input-wrapper">
              <i class="pi pi-lock"></i>
              <input
                [type]="showPassword() ? 'text' : 'password'"
                formControlName="password"
                placeholder="Enter password"
                [class]="'form-control' + (getField('password')?.invalid && getField('password')?.touched ? ' error' : '')"
                style="padding-right: 42px;"
              />
              <i
                [class]="'pi ' + (showPassword() ? 'pi-eye-slash' : 'pi-eye')"
                (click)="togglePassword()"
                style="position: absolute; right: 14px; top: 50%; transform: translateY(-50%); cursor: pointer; color: #aaa;"
              ></i>
            </div>
            <div class="error-msg" *ngIf="getField('password')?.invalid && getField('password')?.touched">
              Password is required
            </div>
          </div>

          <!-- Submit -->
          <app-button
            [type]="'submit'"
            variant="primary"
            [label]="loading() ? 'Signing in...' : 'Sign In'"
            [loading]="loading()"
          ></app-button>
        </form>

        <div class="demo-hint">
          <strong>Demo Credentials:</strong><br>
          Username: <strong>emilys</strong> | Password: <strong>emilyspass</strong>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  loading = signal(false);
  errorMessage = signal('');
  showPassword = signal(false);

  getField(name: string) {
    return this.loginForm.get(name);
  }

  // ✅ FIX: Arrow function tidak bisa di template Angular — pindah ke method
  togglePassword(): void {
    this.showPassword.set(!this.showPassword());
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.router.navigate(['/dashboard/home']);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err?.error?.message || 'Invalid username or password. Please try again.');
      }
    });
  }
}