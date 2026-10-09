export type PayrollType = 'CLIENTES' | 'ADMINISTRATIVOS' | 'CARGOS';

export interface Payroll {
  id: number;
  gestion: number;
  month: number;
  type: PayrollType;
  positionId?: number;
  position?: { id: number; name: string } | null;
  clientId?: number;
  client?: { id: number; name: string } | null;
  stateId?: number;
  state?: { id: number; name: string } | null;
}

export interface PayrollItem {
  id: number;
  payrollId: number;
  code?: string;
  employeeContractId: number;
  employeeContractPayId: number;
  clientContractId?: number;
  identityCard?: string;
  employeeName?: string;
  positionName?: string;
  startDate?: string;
  endDate?: string | null;
  payFromDate?: string;
  payToDate?: string;
  daysWorked: number;
  lateDays?: number;
  minutesLate: number;
  permissionDays?: number;
  expectedWorkDays?: number;
  daysNotWorked?: number;
  absences?: number;
  abandons?: number;
  haberBasico?: number;
  bonus?: number;
  employeerContribution: number;
  housingFound: number;
  occupationalRisk: number;
  laboralContribution: number;
  totalContribution: number;
  totalEarned: number;
  totalDiscount: number;
  amountPayable: number;
  employeeContract?: {
    id: number;
    code: string;
    startDate?: string;
    endDate?: string | null;
    employee?: {
      id: number;
      person?: {
        name?: string;
        fatherLastName?: string;
        motherLastName?: string;
        identityCard?: string;
      };
    };
    position?: { id: number; name: string };
  };
  employeeContractPay?: {
    id: number;
    amount: number;
    bonus?: number | null;
    fromDate?: string;
    toDate?: string | null;
  };
  clientContract?: { id: number; code: string } | null;
}

export interface PayrollItemRow {
  employeeContractId: number;
  employeeContractPayId: number | null;
  clientContractId: number | null;
  code?: string;
  identityCard?: string | null;
  employeeName: string;
  positionName: string;
  startDate?: string | null;
  endDate?: string | null;
  payFromDate?: string | null;
  payToDate?: string | null;
  daysWorked: number;
  lateDays: number;
  minutesLate: number;
  permissionDays: number;
  expectedWorkDays: number;
  daysNotWorked: number;
  absences: number;
  abandons: number;
  haberBasico: number;
  bonus: number;
  employeerContribution: number;
  housingFound: number;
  occupationalRisk: number;
  laboralContribution: number;
  totalContribution: number;
  totalEarned: number;
  totalDiscount: number;
  amountPayable: number;
}

export interface PayrollPreview {
  gestion: number;
  month: number;
  type: PayrollType;
  clientId: number | null;
  clientName: string | null;
  positionId: number | null;
  positionName: string | null;
  discounts: {
    lateDiscount: { id: number; name: string; value: number } | null;
    absenceDiscount: { id: number; name: string; value: number } | null;
  };
  items: PayrollItemRow[];
}

export interface PayrollFilters {
  gestion?: number;
  month?: number;
  type?: PayrollType;
  clientId?: number;
  positionId?: number;
}

export interface RegisterPayrollItem {
  code: string;
  employeeContractId: number;
  employeeContractPayId: number;
  clientContractId?: number | null;
  identityCard?: string | null;
  employeeName?: string | null;
  positionName?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  payFromDate: string;
  payToDate: string;
  daysWorked: number;
  lateDays: number;
  minutesLate: number;
  permissionDays: number;
  expectedWorkDays: number;
  absences: number;
  abandons: number;
  daysNotWorked: number;
  haberBasico: number;
  bonus: number;
  employeerContribution: number;
  housingFound: number;
  occupationalRisk: number;
  laboralContribution: number;
  totalContribution: number;
  totalEarned: number;
  totalDiscount: number;
  amountPayable: number;
}

export interface RegisterPayrollPayload {
  gestion: number;
  month: number;
  type: PayrollType;
  positionId?: number;
  clientId?: number;
  items: RegisterPayrollItem[];
}
