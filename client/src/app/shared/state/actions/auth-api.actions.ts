import { createAction, props } from "@ngrx/store";
import { SocialUser } from "@abacritt/angularx-social-login";

export const loginSuccess = createAction(
  '[Auth API] Login Success',
  props<{ user: SocialUser }>()
);

export const loginFailure = createAction(
  '[Auth API] Login Failure',
  props<{ error: string }>()
);

export const logoutSuccess = createAction(
  '[Auth API] Logout Success'
);
