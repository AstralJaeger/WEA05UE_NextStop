import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {provideHttpClient} from '@angular/common/http';
import {provideNativeDateAdapter} from '@angular/material/core';
import {
  createInterceptorCondition,
  IncludeBearerTokenCondition
} from 'keycloak-angular';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

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
    provideCharts(withDefaultRegisterables()),
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
