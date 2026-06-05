import { Component, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { LucideMail, LucideLock, LucideAlertCircle } from '@lucide/angular';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [FormsModule, LucideMail, LucideLock, LucideAlertCircle],
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly email = signal('');
  readonly password = signal('');
  readonly error = signal<string | null>(null);
  readonly loading = signal(false);

  async onSubmit(): Promise<void> {
    if (!this.email().trim() || !this.password().trim()) return;

    this.error.set(null);
    this.loading.set(true);

    try {
      await this.auth.login(this.email().trim(), this.password().trim());
      this.router.navigate(['/']);
    } catch (err: unknown) {
      const message = err && typeof err === 'object' && 'error' in err
        ? (err.error as { detail?: string; email?: string[] })?.detail ?? (err.error as { email?: string[] })?.email?.[0] ?? 'Usuario o contraseña incorrectos'
        : 'Error al iniciar sesión';
      this.error.set(message);
    } finally {
      this.loading.set(false);
    }
  }
}
