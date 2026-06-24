import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { TokenPair } from '../models/backend.model';
import { ProdeApiService } from './prode-api.service';

const ACCESS_KEY = 'prode_access_token';
const REFRESH_KEY = 'prode_refresh_token';

export interface AuthUser {
  id: number;
  username: string;
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  profile_picture_url?: string | null;
  groups?: string[];
}

export interface RegisterResponse {
  detail: string;
}

export interface ActivationResponse extends TokenPair {
  user: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    is_staff: boolean;
    profile_picture_url?: string | null;
    groups?: string[];
  };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly api = inject(ProdeApiService);
  private get baseUrl() { return this.api.baseUrl; }

  private readonly currentUser = signal<AuthUser | null>(this.loadUser());

  readonly user = computed(() => this.currentUser());
  readonly isAuthenticated = computed(() => this.currentUser() !== null);
  readonly userGroups = computed(() => this.currentUser()?.groups ?? []);

  isInGroup(name: string): boolean {
    return this.userGroups().some((g) => g.toUpperCase() === name.toUpperCase());
  }

  isClient(): boolean {
    return this.isInGroup('CLIENT');
  }

  isManager(): boolean {
    return this.isInGroup('MANAGER');
  }

  isCorbister(): boolean {
    return this.isInGroup('CORBISTER');
  }

  /** Users in CLIENT or MANAGER groups can only predict knockout-stage matches. */
  isRestrictedToKnockout(): boolean {
    return this.isClient() || this.isManager();
  }

  async register(first_name: string, email: string, password: string): Promise<RegisterResponse> {
    return await firstValueFrom(
      this.http.post<RegisterResponse>(`${this.baseUrl}/register/`, { first_name, email, password })
    );
  }

  async activate(email: string, code: string): Promise<void> {
    const data = await firstValueFrom(
      this.http.post<ActivationResponse>(`${this.baseUrl}/activate/`, { email, code })
    );

    localStorage.setItem(ACCESS_KEY, data.access);
    localStorage.setItem(REFRESH_KEY, data.refresh);

    const user: AuthUser = {
      id: data.user.id,
      username: data.user.username,
      name: data.user.first_name || data.user.username,
      first_name: data.user.first_name,
      last_name: data.user.last_name,
      email: data.user.email,
      profile_picture_url: data.user.profile_picture_url || null,
      groups: data.user.groups,
    };

    this.currentUser.set(user);
    localStorage.setItem('prode_user_data', JSON.stringify(user));
  }

  async login(email: string, password: string): Promise<void> {
    const tokens = await firstValueFrom(
      this.http.post<TokenPair>(`${this.baseUrl}/token/`, { email, password })
    );

    localStorage.setItem(ACCESS_KEY, tokens.access);
    localStorage.setItem(REFRESH_KEY, tokens.refresh);

    const profile = await this.fetchProfile();
    if (profile) {
      this.currentUser.set(profile);
      localStorage.setItem('prode_user_data', JSON.stringify(profile));
    } else {
      const payload = this.decodeJwt(tokens.access);
      const fallbackUser: AuthUser = {
        id: payload['user_id'] || 0,
        username: payload['username'] || '',
        name: payload['first_name'] || payload['username'] || '',
        first_name: payload['first_name'] || '',
        last_name: payload['last_name'] || '',
        email: payload['email'] || '',
        profile_picture_url: payload['profile_picture_url'] || null,
        groups: payload['groups'],
      };
      this.currentUser.set(fallbackUser);
      localStorage.setItem('prode_user_data', JSON.stringify(fallbackUser));
    }
  }

  async fetchProfile(): Promise<AuthUser | null> {
    const token = this.getAccessToken();
    if (!token) return null;

    try {
      const data = await firstValueFrom(
        this.http.get<{
          id: number;
          username: string;
          email: string;
          first_name: string;
          last_name: string;
          is_staff: boolean;
          profile_picture_url?: string | null;
          groups?: string[];
        }>(`${this.baseUrl}/profile/`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      );

      return {
        id: data.id,
        username: data.username,
        name: data.first_name || data.username,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        profile_picture_url: data.profile_picture_url || null,
        groups: data.groups,
      };
    } catch {
      return null;
    }
  }

  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem('prode_user_data');
    this.router.navigate(['/login']);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_KEY);
  }

  private loadUser(): AuthUser | null {
    try {
      const raw = localStorage.getItem('prode_user_data');
      return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
      return null;
    }
  }

  private decodeJwt(token: string): Record<string, any> {
    try {
      const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      const json = atob(base64);
      return JSON.parse(json) as Record<string, any>;
    } catch {
      return {};
    }
  }
}
