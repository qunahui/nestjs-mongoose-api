import { Role } from 'src/modules/roles/schemas/role.schema'
import { User } from 'src/modules/users/schemas/user.schema'
import { PaginationMetaParams } from './paginationMeta.dto'

export class PaginatedResultDto {
  data: Role[] | User[]
  meta: PaginationMetaParams
}
