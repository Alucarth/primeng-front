import { Route, Routes } from '@angular/router';
import { HomePage } from './pages/home-page/home-page';
import { EmployeePage } from './pages/employee-page/employee-page';
import { RrhhLayout } from './layout/rrhh-layout/rrhh-layout';

const children: Route[] = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'employee',
    component: EmployeePage,
  },
];

export const rrhhRoutes: Routes = [
  {
    path: '',
    component: RrhhLayout,
    children,
  },
];
