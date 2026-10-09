export interface DashboardCountByKey {
  key: string;
  count: number;
}

export interface DashboardCountByDepartment {
  departmentId: number;
  departmentName: string;
  count: number;
}

export interface DashboardCountByPosition {
  positionId: number;
  positionName: string;
  count: number;
}

export interface RrhhDashboard {
  generatedAt: string;
  month: string;
  workforce: {
    totalEmployees: number;
    employeesByState: DashboardCountByKey[];
    employeesByGender: DashboardCountByKey[];
    employeesByDepartment: DashboardCountByDepartment[];
  };
  contracts: {
    totalContracts: number;
    activeContracts: number;
    contractsByType: DashboardCountByKey[];
    expiringSoon: { id: number; label: string; endDate: string }[];
  };
  staffing: {
    totalPositions: number;
    employeesByPosition: DashboardCountByPosition[];
  };
  attendance: {
    month: string;
    employeesEvaluated: number;
    employeesWithDelay: number;
    employeesWithAbsences: number;
    daysWorked: number;
    lateDays: number;
    minutesLate: number;
    permissionDays: number;
    absences: number;
    abandons: number;
    expectedWorkDays: number;
  };
  hiring: {
    newContractsThisMonth: number;
  };
  permissions: {
    pendingCount: number;
    recentPending: unknown[];
  };
}

export interface GeneralDashboard {
  userId: number;
  employee: {
    id: number;
    name: string;
    position: string;
    department: string;
  } | null;
  contract: {
    id: number;
    type: string;
    endDate: string;
  } | null;
  attendance: {
    month: string;
    daysWorked: number;
    absences: number;
    minutesLate: number;
    pendingPermissions: number;
  } | null;
  nextPays: unknown[];
  recentPermissions: unknown[];
  pendingPermissionsCount: number;
}

export interface AdminDashboard {
  generatedAt: string;
  users: {
    total: number;
    active: number;
    inactive: number;
    byRole: DashboardCountByKey[];
  };
  roles: {
    total: number;
  };
  employees: {
    total: number;
    active: number;
  };
  clients: {
    total: number;
  };
  contracts: {
    total: number;
    active: number;
  };
  positions: {
    total: number;
  };
  routes: {
    total: number;
  };
  permits: {
    total: number;
  };
  payrolls: {
    total: number;
    byState: DashboardCountByKey[];
    byType: DashboardCountByKey[];
    last: unknown;
  };
}

export type DashboardPayload = AdminDashboard | GeneralDashboard | RrhhDashboard;