import { BadRequestException, ConflictException, Injectable } from '@nestjs/common'
import { CreateRoleDto } from './dto/create-role.dto'
import { PaginateModel } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { Role, RoleDocument } from './schemas/role.schema'

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role.name) private roleModel: PaginateModel<RoleDocument>) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const role = new this.roleModel(createRoleDto)
    try {
      await role.save()
      return role['_doc']
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException({
          statusCode: 409,
          errorFields: error.keyValue,
          error: 'Conflict',
        })
      }

      if (error?.name === 'ValidationError') {
        const formattedError = {
          statusCode: 400,
          message: error?.message,
          error: 'Bad Request',
          errorFields: {},
        }

        Object.keys(error?.errors).some((i) => {
          formattedError.errorFields[i] = {
            ...error?.errors[i].properties,
          }
        })
        throw new BadRequestException(formattedError)
      }
      throw error
    }
  }

  async paginated(paginationParams: any): Promise<any> {
    const { search, ...rest } = paginationParams
    const items = await this.roleModel.paginate({ name: search }, rest)
    return {
      data: items.docs,
      meta: {
        totalDocs: items.totalDocs,
        totalPages: items.totalPages,
      },
    }
  }
}
