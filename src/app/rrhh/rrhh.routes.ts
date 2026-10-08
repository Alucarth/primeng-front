import { Route, Routes } from '@angular/router';
import { HomePage } from './pages/home-page/home-page';
import { EmployeePage } from './pages/employee-page/employee-page';
import { StatusPage } from './pages/status-page/status-page';
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
  {
    path: 'status',
    component: StatusPage,
  },
];

export const rrhhRoutes: Routes = [
  {
    path: '',
    component: RrhhLayout,
    children,
  },
];
