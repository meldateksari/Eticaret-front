import {ApplicationConfig, LOCALE_ID, provideZoneChangeDetection} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptors, withInterceptorsFromDi} from '@angular/common/http';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {providePrimeNG} from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import {MessageService} from 'primeng/api';
// import {CaseInterceptor} from "./interceptors/case.interceptor";
import { registerLocaleData } from '@angular/common';
import localeTr from '@angular/common/locales/tr';
import {JwtInterceptor} from './interceptors/jwt.interceptor';

registerLocaleData(localeTr);

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptorsFromDi()
    ),
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },

    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),

    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura
      }
    }),
    MessageService,
    // { provide: HTTP_INTERCEPTORS, useClass: CaseInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: 'tr' }
  ]
};
