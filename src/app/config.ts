// API base endpoint, change for different backends
export const API_BASE_URL = 'http://localhost:3000/api';

export const AUTH_CONFIG = {
  issuer: 'http://localhost:8090/realms/nextstop',
  loginUrl: 'http://localhost:8090/realms/nextstop/protocol/openid-connect/auth',
  logoutUrl: 'http://localhost:8090/realms/nextstop/protocol/openid-connect/logout',
  tokenEndpoint: 'http://localhost:8090/realms/nextstop/protocol/openid-connect/token',
  sessionCheckIFrameUrl: 'http://localhost:8090/realms/nextstop/protocol/openid-connect/login-status-iframe.html',
  userinfoEndpoint: 'http://localhost:8090/realms/nextstop/protocol/openid-connect/userinfo',
  clientId: 'nextstop',
  redirectUri: window.location.origin + '/',
  silentRefreshRedirectUri: window.location.origin + '/silent-refresh.html',
  scope: 'openid profile email',
  silentRefreshTimeout: 5000,
  timeoutFactor: 0.25,
  sessionChecksEnabled: true,
  showDebugInformation: true,
  clearHashAfterLogin: true,
  responseType: 'code',
  disableAtHashCheck: true,
};

export const logoutUrl = (redirect_uri: string) => {
  return `http://localhost:8090/realms/nextstop/protocol/openid-connect/logout?client_id=${AUTH_CONFIG['clientId']}&post_logout_redirect_uri=${redirect_uri}`;
};
