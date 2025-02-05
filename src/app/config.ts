// API base endpoint, change for different backends
export const API_BASE_URL = 'https://localhost:7084/api';

export const AUTHORITY = 'http://localhost:8080';
export const REALM_ID = 'nextstop'
export const CLIENT_ID = 'ns_client'

export const AUTH_CONFIG = {
  issuer: `${AUTHORITY}/realms/${REALM_ID}`,
  loginUrl: `${AUTHORITY}/realms/realms/${REALM_ID}/protocol/openid-connect/auth`,
  logoutUrl: `${AUTHORITY}/realms/${REALM_ID}/protocol/openid-connect/logout`,
  tokenEndpoint: `${AUTHORITY}/realms/${REALM_ID}/protocol/openid-connect/token`,
  sessionCheckIFrameUrl: `${AUTHORITY}/realms/${REALM_ID}/protocol/openid-connect/login-status-iframe.html`,
  userinfoEndpoint: `${AUTHORITY}/realms/${REALM_ID}/protocol/openid-connect/userinfo`,
  clientId: CLIENT_ID,
  redirectUri: window.location.origin + '/',
  silentRefreshRedirectUri: window.location.origin + '/silent-refresh.html',
  scope: 'openid profile email',
  silentRefreshTimeout: 5000,
  timeoutFactor: 0.25,
  sessionChecksEnabled: true,
  showDebugInformation: false,
  clearHashAfterLogin: true,
  responseType: 'code',
  disableAtHashCheck: true,
};

export const logoutUrl = (redirect_uri: string) => {
  return `http://localhost:8080/realms/${REALM_ID}/protocol/openid-connect/logout?client_id=${CLIENT_ID}&post_logout_redirect_uri=${redirect_uri}`;
};
