import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleSigninButtonModule, SocialAuthService } from '@abacritt/angularx-social-login';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthApiActions } from '../shared/state/actions';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, GoogleSigninButtonModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  constructor(
    private socialAuthService: SocialAuthService,
    private store: Store,
    private router: Router
  ) {
    // Listen for successful login
    this.socialAuthService.authState.subscribe(user => {
      if (user) {
        this.store.dispatch(AuthApiActions.loginSuccess({ user }));
        this.router.navigate(['/fancyt']);
      }
    });
  }
}
