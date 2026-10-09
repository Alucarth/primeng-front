import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, provideRouter, UrlSegment } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { RouteGuard } from './route.guard';

const routeFor = (paths: string[]): ActivatedRouteSnapshot => {
  const leaf = { url: paths.map((path) => new UrlSegment(path, {})) } as ActivatedRouteSnapshot;
  return { pathFromRoot: [{ url: [] }, leaf] } as unknown as ActivatedRouteSnapshot;
};

const roleWithRoutes = (paths: string[]) => ({
  id: 1,
  name: 'admin',
  routes: paths.map((path, i) => ({
    id: i,
    roleId: 1,
    routeId: i,
    route: {
      id: i,
      key: path.replaceAll('/', ''),
      label: path,
      path,
      icon: 'lucideRoute',
      routeId: null,
      stateId: 1,
    },
  })),
});

describe('RouteGuard', () => {
  const runGuard = (roleRoutes: string[], requested: string[]): boolean => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: { role: () => roleWithRoutes(roleRoutes) },
        },
      ],
    });

    return TestBed.runInInjectionContext(() =>
      RouteGuard(routeFor(requested), {} as never),
    ) as boolean;
  };

  it('permite la ruta asignada', () => {
    expect(runGuard(['/role'], ['role'])).toBe(true);
  });

  it('permite una pagina hija por prefijo', () => {
    expect(runGuard(['/employee'], ['employee', '5', 'detail'])).toBe(true);
  });

  it('permite role-route cuando el rol tiene la ruta role', () => {
    expect(runGuard(['/role'], ['role-route', '3'])).toBe(true);
  });

  it('permite city cuando el rol tiene department', () => {
    expect(runGuard(['/department'], ['province', '5', 'cities'])).toBe(true);
  });

  it('bloquea rutas no asignadas', () => {
    expect(runGuard(['/role'], ['employee'])).toBe(false);
  });

  it('siempre permite el landing', () => {
    expect(runGuard(['/role'], [])).toBe(true);
  });

  it('permite todo cuando el rol no tiene rutas', () => {
    expect(runGuard([], ['employee'])).toBe(true);
  });
});
