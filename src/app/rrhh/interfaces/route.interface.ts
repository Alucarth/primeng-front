export interface Route {
  id: number;
  key: string;
  label: string;
  path: string;
  icon: string;
  routeId?: number | null;
  stateId: number;
}

export interface RouteCreate {
  key: string;
  label: string;
  path: string;
  icon: string;
  routeId?: number | null;
  stateId: number;
}
