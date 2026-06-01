import { createAction } from "@ngrx/store";

export const initializeAuth = createAction(
  '[App Init] Initialize Auth'
);

export const logout = createAction(
  '[Auth Page] Logout'
);
