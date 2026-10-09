export interface AuthResponse {
  access_token: string;
}
export interface ProfileResponse {
  id: number;
  username: string;
  person: Person;
}

export interface Person {
  id: number;
  identityCard: string;
  name: string;
  fatherLastName: string;
  motherLastName: string;
  birthDate: Date;
  imagePath: null;
  email: null;
  phone: null;
  gender: null;
  extension: null;
  civilStatus: null;
  documentTypeId: null;
  log: Log;
  timestamp: Timestamp;
}

export interface Log {
  createdBy: string;
  lastChangedBy: string;
  deletedBy: null;
}

export interface Timestamp {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
}

export interface User {
  id: number;
  username: string;
  person: Person;
}

export interface Person {
  id: number;
  identityCard: string;
  name: string;
  fatherLastName: string;
  motherLastName: string;
  birthDate: Date;
  imagePath: null;
  email: null;
  phone: null;
  gender: null;
  extension: null;
  civilStatus: null;
  documentTypeId: null;
  log: Log;
  timestamp: Timestamp;
}

export interface RolesResponse {
  roles: Role[];
}

export interface AuthRoute {
  id: number;
  key: string;
  label: string;
  path: string;
  icon: string;
  routeId: number | null;
  stateId: number;
}

export interface AuthRoleRoute {
  id: number;
  roleId: number;
  routeId: number;
  route: AuthRoute;
}

export interface AuthPermit {
  id: number;
  name: string;
  routeId: number;
}

export interface AuthRolePermit {
  id: number;
  roleId: number;
  permitId: number;
  permit: AuthPermit;
}

export interface Role {
  id: number;
  name: string;
  description?: string;
  routes?: AuthRoleRoute[];
  permits?: AuthRolePermit[];
}
