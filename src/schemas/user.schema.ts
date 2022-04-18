import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import * as bcrypt from 'bcrypt'
import * as mongoosePaginate from 'mongoose-paginate-v2'
import { ROLE } from 'src/constants'

export type UserDocument = User & Document

@Schema({
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = doc._id.toString()
      delete ret._id
      delete ret.__v
    },
  },
})
export class User {
  @Prop({
    required: true,
    unique: true,
    index: true,
  })
  email: string

  @Prop()
  password: string

  @Prop()
  displayName: string

  @Prop({
    required: true,
    unique: true,
    index: true,
  })
  phone: string

  @Prop({ type: String })
  role: ROLE

  @Prop({
    default: true,
  })
  isActive: boolean
}

export const UserSchema = SchemaFactory.createForClass(User)

UserSchema.index({ email: 'text', phone: 'text' })

UserSchema.pre<UserDocument>('save', async function (next) {
  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    return next()
  } catch (err) {
    return next(err)
  }
})

UserSchema.methods.validatePassword = function (password: string): Promise<boolean> {
  const user = <UserDocument>this
  return bcrypt.compare(password, user.password)
}

UserSchema.post('save', function (error, doc, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(new Error('Email must be unique'))
  } else {
    next(error)
  }
})

UserSchema.plugin(mongoosePaginate)
