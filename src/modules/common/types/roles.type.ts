export enum EAppRoles {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN'
}
export interface IJWTPayload {
  id?: string;
  email?: string;
  password?: string;
  role?: string;
  birthday?: Date;
}
