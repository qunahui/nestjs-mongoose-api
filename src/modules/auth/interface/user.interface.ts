import { Document } from 'mongoose';

export interface User extends Document {
  readonly email: string;
  password: string;
  phone: string;
  displayName: string;
  roles: string[];
}