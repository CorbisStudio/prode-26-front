import { Component, signal, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import {
  LucideMail,
  LucideAlertCircle,
  LucideCheckCircle2,
  LucideRefreshCw,
  LucideArrowLeft,
} from '@lucide/angular';

interface ActivateState {
  firstName: string;
  email: string;
  password: string;
}

@Component({
  selector: 'app-activate-page',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    LucideMail,
    LucideAlertCircle,
    LucideCheckCircle2,
    LucideRefreshCw,
    LucideArrowLeft,
  ],
  templateUrl: './activate-page.component.html',
})
export class ActivatePageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);

  readonly code = signal('');
  readonly error = signal<string | null>(null);
  readonly loading = signal(false);
  readonly resending = signal(false);
  readonly resentMessage = signal<string | null>(null);
  readonly success = signal(false);
  readonly email = signal('');
  readonly canResend = signal(false);

  private registrationState: ActivateState | null = null;

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state as ActivateState | undefined;
    const queryEmail = this.route.snapshot.queryParamMap.get('email')?.trim() || '';

    if (state?.email && state?.password) {
      this.registrationState = state;
      this.canResend.set(true);
      this.email.set(state.email);
    } else if (queryEmail) {
      this.email.set(queryEmail);
    }
  }

  async onSubmit(): Promise<void> {
    const code = this.code().trim();
    const email = this.email().trim();

    if (!email) {
      this.error.set('Ingresá tu correo.');
      return;
    }

    if (!code || code.length !== 6 || !/^\d{6}$/.test(code)) {
      this.error.set('Ingresá el código de 6 dígitos que recibiste por correo.');
      return;
    }

    this.error.set(null);
    this.loading.set(true);

    try {
      await this.auth.activate(email, code);
      this.success.set(true);
      setTimeout(() => this.router.navigate(['/']), 1200);
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'error' in err
          ? (err.error as { detail?: string; code?: string[] })?.detail ??
            (err.error as { code?: string[] })?.code?.[0] ??
            'No se pudo activar la cuenta. Intentá de nuevo.'
          : 'No se pudo activar la cuenta. Intentá de nuevo.';
      this.error.set(message);
    } finally {
      this.loading.set(false);
    }
  }

  async resendCode(): Promise<void> {
    if (!this.registrationState) return;

    this.error.set(null);
    this.resentMessage.set(null);
    this.resending.set(true);

    try {
      const response = await this.auth.register(
        this.registrationState.firstName,
        this.registrationState.email,
        this.registrationState.password
      );
      this.resentMessage.set(response.detail);
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'error' in err
          ? (err.error as { detail?: string })?.detail ?? 'No se pudo reenviar el código.'
          : 'No se pudo reenviar el código.';
      this.error.set(message);
    } finally {
      this.resending.set(false);
    }
  }
}
