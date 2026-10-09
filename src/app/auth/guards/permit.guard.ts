import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// ---------------------------------------------------------------------------
// GUARD DE PERMISOS - PENDIENTE
// ---------------------------------------------------------------------------
// Objetivo: ademas de la ruta (ver route.guard.ts), controlar que el rol tenga
// el PERMIT requerido por la pantalla (create | read | update | delete).
//
// El rol ya trae los permits anidados desde /auth/roles:
//   role.permits  -> Array<{ id, roleId, permitId, permit: { id, name, routeId } }>
//   role.routes   -> Array<{ id, roleId, routeId, route: { id, key, path, ... } }>
//
// El permit.name tiene la forma "<routeKey>.<accion>" (ej: "payroll.read").
//
// IMPORTANTE: la logica de que accion exige cada pantalla NO esta decidida aun,
// se definira con la empresa. Decisiones pendientes:
//   1. Que accion (create/read/update/delete) necesita cada ruta.
//   2. Si una pantalla que solo hace "leer" (ej: dashboard) pide permit o no.
//   3. Si rutas hijas con params (ej: /employee/5/detail) heredan el permit
//      de la ruta base (/employee) o exigen el suyo propio.
//   4. Pagina de destino/reintento cuando no se tiene el permit (dashboard o 403).
//   5. Si la ruta pide un permit pero el rol NI SIQUIERA tiene la ruta en
//      role.routes, el RouteGuard (ya activo) lo bloquea antes de llegar aqui.
//
// Cuando se defina la logica, se enlazaria asi (rrhh.routes.ts):
//   { path: 'payroll', component: Payroll, canActivate: [RouteGuard, PermitGuard],
//     data: { routeKey: 'payroll', permit: 'read' } }
//
// ---------------------------------------------------------------------------

// export const PermitGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
//   const authService = inject(AuthService);
//   const router = inject(Router);
//
//   const role = authService.role();
//   const routeKey = route.data?.['routeKey'];
//   const required = route.data?.['permit'];
//
//   const hasPermit = role?.permits?.some(
//     (rolePermit) =>
//       rolePermit.permit?.name?.toLowerCase() === `${routeKey}.${required}`.toLowerCase(),
//   );
//
//   if (hasPermit) {
//     return true;
//   }
//
//   // TODO: decidir con la empresa el destino al no tener el permiso.
//   void router.navigateByUrl('/');
//   return false;
// };
