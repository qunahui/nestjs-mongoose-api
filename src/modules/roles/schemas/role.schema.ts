import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

export type RoleDocument = Role & Document

@Schema({
  timestamps: true,
})
export class Role {
  @Prop({
    required: true,
    unique: true,
  })
  name: string

  @Prop({
    required: true,
    unique: true,
  })
  slug: string

  @Prop({
    default: true,
  })
  isActive: boolean

  @Prop({
    default: null,
  })
  deletedAt: Date
}

export const RoleSchema = SchemaFactory.createForClass(Role)
