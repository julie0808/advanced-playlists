import { ApplicationConfig, importProvidersFrom, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { SocialLoginModule, SocialAuthServiceConfig, GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { primeThemeAuraPreset } from './theme/prime-theme-aura.preset';

import { routes } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { CacheInterceptor } from './shared/cache.interceptor';
import { sharedReducer } from './shared/state/shared.reducer';
import { SharedEffects } from './shared/state/shared.effect';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),

    providePrimeNG({
      theme: { preset: primeThemeAuraPreset }
    }),

    provideRouter(routes),

    provideHttpClient(withInterceptorsFromDi()),

    {
      provide: HTTP_INTERCEPTORS,
      useClass: CacheInterceptor,
      multi: true
    },

    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '218803000758-6pdba5ettd4i0ii4ovl0k89fgo3l6oq5.apps.googleusercontent.com'
            )
          }
        ],
        onError: (err: any) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig
    },

    importProvidersFrom(
      StoreModule.forRoot({}, {}),
      EffectsModule.forRoot([]),
      StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
      StoreModule.forFeature('shared', sharedReducer),
      EffectsModule.forFeature([SharedEffects]),
      SocialLoginModule,
      SharedModule
    )
  ]
};