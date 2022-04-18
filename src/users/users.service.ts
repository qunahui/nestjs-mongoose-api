import { Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common'
import { FilterQuery, PaginateModel } from 'mongoose'
import { User, UserDocument } from '../schemas/user.schema'
import { InjectModel } from '@nestjs/mongoose'
import { FetchDto } from 'src/pagination/dto/fetch.dto'
import { PaginationService } from 'src/pagination/pagination.service'
import { ROLE } from 'src/constants'
import { UserEntity } from 'src/entities/user.entity'
import { CurrentUserDto } from './dto/current-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
// import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: PaginateModel<UserDocument>,
    private readonly paginationService: PaginationService,
  ) {}

  async paginate(fetchDto: FetchDto, res: Response): Promise<UserEntity[]> {
    try {
      let query = {}
      if (fetchDto?.search) {
        query = {
          $text: { $search: fetchDto.search },
        }
      }

      const result = await this.paginationService.paginate(
        this.userModel,
        { ...query },
        {
          ...fetchDto,
        },
        res,
      )

      return result
    } catch (error) {
      throw new UnprocessableEntityException(error.message)
    }
  }

  async findOne(userId: string): Promise<UserEntity> {
    const user = await this.userModel.findById(userId)

    if (!user) {
      throw new UnauthorizedException('Credentials invalid')
    }

    return user
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    currentUser: CurrentUserDto,
  ): Promise<UserEntity> {
    try {
      let updateId = id

      if (currentUser.role !== ROLE.admin || !id) {
        updateId = currentUser.id
        delete updateUserDto.role // user cant update self role
      }

      const result = await this.userModel.findOneAndUpdate(
        { _id: updateId },
        {
          ...updateUserDto,
        },
        { new: true }, //return updated
      )

      return result
    } catch (error) {
      throw new UnprocessableEntityException(error.message)
    }
  }

  async remove(id: string): Promise<boolean> {
    try {
      const result = await this.userModel.deleteOne({ _id: id })

      return result?.deletedCount > 0
    } catch (error) {
      throw new UnprocessableEntityException(error.message)
    }
  }

  async findAll(
    currentUser: CurrentUserDto,
    extraFilter?: FilterQuery<UserDocument>,
  ): Promise<UserEntity[]> {
    try {
      if (currentUser.role !== ROLE.admin) {
        throw new UnauthorizedException('You dont have permission !')
      }
      const result = await this.userModel.find({ ...extraFilter })
      return result
    } catch (e) {
      throw new UnprocessableEntityException(e.message)
    }
  }
}
