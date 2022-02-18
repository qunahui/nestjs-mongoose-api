import {
  CanActivate,
  ConflictException,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { UsersService } from 'src/modules/users/users.service'
import { Observable } from 'rxjs'

@Injectable()
export class DoesUserExistGuard implements CanActivate {
  constructor(private readonly userService: UsersService) {}

  canActivate(context: ExecutionContext): Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest()
    return this.validateRequest(request)
  }

  async validateRequest(request: any) {
    const { id } = request.params
    let userExist = null

    try {
      userExist = await this.userService.findByEmailOrPhoneNumber(request.body.email)
    } catch (error) {
      if (error instanceof NotFoundException) {
      } else {
        throw error
      }
    }
    if ((!id && userExist) || (id && userExist && userExist.id != id)) {
      throw new ConflictException('User already exist')
    }
    return true
  }
}
