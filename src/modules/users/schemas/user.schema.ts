import * as mongoose from 'mongoose';
import { Role } from 'src/core/enums/roles.enum';

export const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: /.+\@.+\..+/,
  },
  password: {
    type: String,
  },
  displayName: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    required: true,
    default: Role.User
  }
});