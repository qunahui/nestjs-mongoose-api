import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

export type UserDocument = User & Document

@Schema({
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = doc._id.toString()
      delete ret._id
      delete ret.__v
      delete ret.createdAt
      delete ret.updatedAt
      delete ret.isActive
    },
  },
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
