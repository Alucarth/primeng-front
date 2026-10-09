import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './auth/shared/interceptors/auth.interceptor';
import { loadingInterceptor } from './auth/shared/interceptors/loading.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        // loggingInterceptor,
        authInterceptor,
        loadingInterceptor,
        // errorInterceptor,
      ]),
    ),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: 'light',
        },
      },
      ripple: false,
      overlayAppendTo: 'body',
      license:
        'eyJpZCI6IjdkMDZhY2Y1LWE0ZTYtNGYxYS04N2Q5LWI2YjUyOTBiMWU2MSIsInByb2R1Y3QiOiJwcmltZXVpIiwidGllciI6ImNvbW11bml0eSIsInR5cGUiOiJkZXYiLCJpYXQiOjE3ODQyMTc5NDAsImV4cCI6MTgxNTc1Mzk0MH0.S0r6P5K8Qf7PSD9F2FMG5NQ6JmK_QwcjGxD7VMBawE4kDdb_9hjzKvf1MnAHJsrCuH4Lq8cK27OuatFKWE1BAg',
    }),
  ],
};
