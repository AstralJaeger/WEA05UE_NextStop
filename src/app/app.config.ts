import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {AUTHORITY, REALM_ID, CLIENT_ID} from './config'
import {routes} from './app.routes';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {provideHttpClient} from '@angular/common/http';
import {provideNativeDateAdapter} from '@angular/material/core';
import {
  createInterceptorCondition,
  INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
  IncludeBearerTokenCondition,
  provideKeycloak
} from 'keycloak-angular';

const urlCondition = createInterceptorCondition<IncludeBearerTokenCondition>({
  urlPattern: /^(http:\/\/localhost:7084)(\/.*)?$/i,
  bearerPrefix: 'Bearer'
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(),
    provideNativeDateAdapter(),
    // provideKeycloak({
    //   config: {
    //     url: AUTHORITY,
    //     realm: REALM_ID,
    //     clientId: CLIENT_ID,
    //   },
    //   initOptions: {
    //     onLoad: "login-required",
    //     checkLoginIframe: false,
    //   }
    // }),
    // {
    //   provide: INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
    //   useValue: [urlCondition]
    // }
  ],
};
