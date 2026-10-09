import { computed, inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';

export const AuthenticatedGuard: CanMatchFn = async (route: Route, segments: UrlSegment[]) => {
  console.log('load test ... ');
  const authService = inject(AuthService);
  const router = inject(Router);
  const isAuthenticated = await firstValueFrom(authService.checkStatus());
  // const expectedRoles = route.data?.['roles'] as Array<string>; //roles de la ruta
  // const role = authService.role(); // rol del usuario
  // console.log(role);
  // const rolename = computed<String | null >( role.role!.name.toUpperCase()!) ;
  console.log('isAuthenticated', isAuthenticated);
  if (!isAuthenticated) {
    router.navigateByUrl('auth/login');
    return false;
  }
  return true;
};
