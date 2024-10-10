import { AdminPermission } from "../enum/AdminPermission.enum";
import { Role } from "../enum/Role.enum";
import { Form } from "../Form/form";

export class User {
  userId: number;
  username: string;
  email: string;
  password: string;
  phoneNumber: string;
  birthDate: Date;
  locked: boolean;
  loginAttempts: number;
  profilePic?: string;
  accessToken?: string;
  refreshToken?: string;
  role: Role;
  permissions: AdminPermission[] = [];
  forms?: Form[];

  // Constructor with default values
  constructor(
    userId: number = 0,
    username: string = '',
    email: string = '',
    password: string = '',
    phoneNumber: string = '',
    birthDate: Date = new Date(),
    locked: boolean = false, // Default value for locked
    loginAttempts: number = 0,
    role: Role = Role.USER, // Default role if needed
    accessToken?: string,
    refreshToken?: string,
    forms?: Form[]
  ) {
    this.userId = userId;
    this.username = username;
    this.email = email;
    this.password = password;
    this.phoneNumber = phoneNumber;
    this.birthDate = birthDate;
    this.locked = locked;
    this.loginAttempts = loginAttempts;
    this.role = role;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.forms = forms || []; // Default to empty array if forms is undefined
  }
}
