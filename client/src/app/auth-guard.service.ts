import { GoogleLoginProvider, SocialAuthService, SocialUser } from "@abacritt/angularx-social-login";
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";
import { Observable, of, switchMap } from "rxjs";
import { Store } from "@ngrx/store";
import * as fromShared from './shared/state';
import { AuthPageActions } from "./shared/state/actions";

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(
    private router: Router,
    private socialAuthService: SocialAuthService,
    private store: Store
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    // Trigger auth initialization on first guard check
    this.store.dispatch(AuthPageActions.initializeAuth());
    
    return this.store.select(fromShared.getIsAuthenticated).pipe(
      switchMap(isAuthenticated => {
        
        if (isAuthenticated) {
          return of(true);
        }

        this.router.navigate(['/login']);
        return of(false);
      })
    );
  }
}