import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

export type UserDocument = User & Document

@Schema({
  timestamps: true,
})
export class User {
  @Prop({
    required: true,
    unique: true,
    match: /.+\@.+\..+/,
  })
  email: string

  @Prop()
  password: string

  @Prop()
  displayName: string

  @Prop({
    required: true,
    unique: true,
  })
  phone: string

  @Prop()
  role: string

  @Prop({
    default: true,
  })
  isActive: boolean
}

export const UserSchema = SchemaFactory.createForClass(User)
