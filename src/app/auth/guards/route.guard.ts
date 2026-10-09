import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

const requestedPath = (route: ActivatedRouteSnapshot): string =>
  '/' +
  route.pathFromRoot
    .map((segment) => segment.url.map((part) => part.path).join('/'))
    .filter(Boolean)
    .join('/');

const stripTrailingSlash = (path: string): string =>
  path.endsWith('/') ? path.slice(0, -1) : path;

const BRANCH_ROUTES: Record<string, string[]> = {
  employee: ['employee'],
  client: ['client'],
  payroll: ['payroll'],
  department: ['department', 'province', 'city'],
  role: ['role', 'role-route'],
};

const isAllowedRequest = (requested: string, allowed: string[]): boolean => {
  const firstSegment = requested.split('/').filter(Boolean)[0] ?? '';

  return allowed.some((path) => {
    const base = stripTrailingSlash(path);

    if (requested === base || requested.startsWith(`${base}/`)) {
      return true;
    }

    const branchKey = base === '/' ? '' : base.slice(1);
    return (BRANCH_ROUTES[branchKey] ?? []).includes(firstSegment);
  });
};

export const RouteGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const role = authService.role();
  const allowed = (role?.routes ?? [])
    .map((roleRoute) => roleRoute.route?.path ?? '')
    .filter(Boolean);

  if (allowed.length === 0) {
    return true;
  }

  const requested = requestedPath(route);

  if (requested === '/') {
    return true;
  }

  if (isAllowedRequest(requested, allowed)) {
    return true;
  }

  void router.navigateByUrl('/');
  return false;
};
