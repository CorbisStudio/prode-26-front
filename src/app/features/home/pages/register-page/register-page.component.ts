import { Component, signal, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import {
  LucideUser,
  LucideMail,
  LucideLock,
  LucideEye,
  LucideEyeOff,
  LucideAlertCircle,
  LucideArrowLeft,
  LucideCheckCircle2,
} from '@lucide/angular';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    LucideUser,
    LucideMail,
    LucideLock,
    LucideEye,
    LucideEyeOff,
    LucideAlertCircle,
    LucideArrowLeft,
    LucideCheckCircle2,
  ],
  templateUrl: './register-page.component.html',
})
export class RegisterPageComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly firstName = signal('');
  readonly email = signal('');
  readonly password = signal('');
  readonly showPassword = signal(false);
  readonly error = signal<string | null>(null);
  readonly loading = signal(false);
  readonly successMessage = signal<string | null>(null);
  readonly registeredEmail = signal('');

  togglePasswordVisibility(): void {
    this.showPassword.update((v) => !v);
  }

  async onSubmit(): Promise<void> {
    const firstName = this.firstName().trim();
    const email = this.email().trim();
    const password = this.password();

    if (!firstName || !email || !password) return;

    this.error.set(null);
    this.successMessage.set(null);
    this.loading.set(true);

    try {
      const response = await this.auth.register(firstName, email, password);
      this.registeredEmail.set(email);
      this.successMessage.set(
        response.detail || 'Registro exitoso. Te enviamos un código a tu correo para activar la cuenta.'
      );

      // Auto-navigate to code verification after showing the success message.
      setTimeout(() => {
        this.router.navigate(['/activate'], {
          state: { firstName, email, password },
        });
      }, 2000);
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'error' in err
          ? (err.error as { detail?: string; email?: string[]; password?: string[]; first_name?: string[] })?.detail ??
            (err.error as { email?: string[] })?.email?.[0] ??
            (err.error as { password?: string[] })?.password?.[0] ??
            (err.error as { first_name?: string[] })?.first_name?.[0] ??
            'Error al registrar el usuario'
          : 'Error al registrar el usuario';
      this.error.set(message);
    } finally {
      this.loading.set(false);
    }
  }
}
