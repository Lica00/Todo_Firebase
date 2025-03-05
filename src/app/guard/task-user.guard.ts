import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { map } from 'rxjs';


// Permette accesso rotta solo se utente loggato ( istanza user valida )
export const taskUserGuard: CanActivateFn = (route, state) => {

  const auth : AuthService = inject(AuthService);

  return auth.userBehavior.pipe( map( ( user ) => {
    return user ? true :  false 
  }))

};
