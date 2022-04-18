import { Module } from '@nestjs/common'
import { RolesController } from './roles.controller'
import { RolesService } from './roles.service'
import { MongooseModule } from '@nestjs/mongoose'
import { Role, RoleSchema } from './schemas/role.schema'
import * as mongoosePaginate from 'mongoose-paginate-v2'

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Role.name,
        // schema: RoleSchema,
        useFactory: () => {
          const schema = RoleSchema
          schema.plugin(mongoosePaginate)
          return schema
        },
      },
    ]),
  ],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}
