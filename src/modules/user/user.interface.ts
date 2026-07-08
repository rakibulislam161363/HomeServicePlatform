import { Role, UserStatus } from "../../../generated/prisma/enums";

export interface IUserPayload {
  name: string;
  email: string;
  password: string;
  status?: UserStatus;
  phone: string;
  role: Role
}