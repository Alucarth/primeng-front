export interface Account {
  id: number;
  name: string;
  socialReason?: string | null;
  nit?: number | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  pathLogo?: string | null;
  pathAndroid?: string | null;
}

export interface AccountCreate {
  name: string;
  socialReason?: string | null;
  nit?: number | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  pathLogo?: string | null;
  pathAndroid?: string | null;
}
