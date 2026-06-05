import { describe, it, expect, beforeEach } from 'vitest';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    localStorage.clear();
    service = new AuthService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should not be authenticated initially', () => {
    expect(service.isAuthenticated()).toBe(false);
    expect(service.user()).toBeNull();
  });

  it('should authenticate after login', () => {
    service.login('Juan', 'juan@test.com');
    expect(service.isAuthenticated()).toBe(true);
    expect(service.user()?.name).toBe('Juan');
  });

  it('should clear auth on logout', () => {
    service.login('Juan', 'juan@test.com');
    service.logout();
    expect(service.isAuthenticated()).toBe(false);
    expect(service.user()).toBeNull();
  });
});
