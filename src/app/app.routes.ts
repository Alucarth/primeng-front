import { Routes } from '@angular/router';
import { NotAuthenticatedGuard } from './auth/guards/not-authenticated.guard';
import { AuthenticatedGuard } from './auth/guards/authenticated.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes'),
    canMatch: [
      NotAuthenticatedGuard,
      // ()=>{
      //   console.log('hi guard') //en caso de un guard adicional jajaja aqui se podria jugar con los roles jajaja
      // }
    ],
  },
  {
    path: '', // '' siempre al final
    loadChildren: () => import('./rrhh/rrhh.routes').then((m) => m.rrhhRoutes),
    canMatch: [AuthenticatedGuard],
  },
];
