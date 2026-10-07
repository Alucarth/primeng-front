import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '', // '' siempre al final
    loadChildren: () => import('./rrhh/rrhh.routes').then((m) => m.rrhhRoutes),
    // canMatch: [AuthenticatedGuard],
  },
];
