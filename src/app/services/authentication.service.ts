import {Injectable} from '@angular/core';
import {OAuthService} from 'angular-oauth2-oidc';
import {AUTH_CONFIG, logoutUrl} from '../config';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private readonly oAuthService: OAuthService) {
  }

  async configureAuth(): Promise<void> {
    this.oAuthService.configure(AUTH_CONFIG);
    try {
      await this.oAuthService
        .loadDiscoveryDocumentAndTryLogin();
      console.debug('Successfully configured OAuth client');
    } catch (e) {
      console.error('Error configuring OAuth client: ', e);
    }
  }

  login(): void {
    console.log()
    try {
      this.oAuthService.initCodeFlow();
    } catch (e) {
      console.error('Error signing in', e);
    }
  }

  isAuthenticated(): boolean {
    return this.oAuthService.hasValidAccessToken() && this.oAuthService.hasValidIdToken();
  }

  logout(): void {
    this.oAuthService.logOut();
    window.location.href = logoutUrl(encodeURIComponent(window.location.origin));
  }

  getToken(): string | null {
    return this.oAuthService.getAccessToken();
  }

  getUserEmail(): string {
    const idToken = this.oAuthService.getIdToken();
    if (!idToken) return '';
    const claims = this.oAuthService.getIdentityClaims() as Record<string, unknown>;
    if (!claims || !(claims['email'] instanceof String)) return '';
    console.log("email", claims['email'])
    return claims['email'] as string;
  }
}
