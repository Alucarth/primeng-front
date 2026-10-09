import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { AuthService } from '@/auth/services/auth.service';
import { firstValueFrom } from 'rxjs';

export const NotAuthenticatedGuard: CanMatchFn = async (route: Route, segments: UrlSegment[]) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const isAuthenticated = await firstValueFrom(authService.checkStatus());
  // const role = authService.role(); // rol del usuario
  console.log({ isAuthenticated });
  if (isAuthenticated) {
    router.navigateByUrl('/');
    return false;
  }

  // if(isAuthenticated)
  // {
  //   // router.navigateByUrl('/')
  //   console.log('ya esta autenticado el usuario')
  //   // if (role?.role!.name.toUpperCase()! === 'ADMIN') {
  //   //   router.navigateByUrl('/creator');
  //   // } else {
  //   //   router.navigateByUrl('/view/procedure-view');
  //   // }
  //   return false
  // }
  console.log(isAuthenticated);
  return true;
};
