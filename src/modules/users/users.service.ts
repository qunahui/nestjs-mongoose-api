import * as bcrypt from 'bcrypt';
import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthCredentialsDto } from '../auth/dto/auth-credentials.dto';

export type User = any;

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private userModel: Model<User>
  ) {}

  private async hashPassword(password) {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<User> {
    authCredentialsDto.password = await this.hashPassword(authCredentialsDto.password);
    const user = new this.userModel(authCredentialsDto);

    try {
      await user.save();
      delete user.password;
      
      return user
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException({
          statusCode: 409,
          errorFields: error.keyValue,
          error: "Conflict"
        });
      }
      
      if(error?.name === "ValidationError") {
        const formattedError = {
          statusCode: 400,
          message: error?.message,
          error: "Bad Request",
          errorFields: {}
        }

        Object.keys(error?.errors).some(i => {
          formattedError.errorFields[i] = {
            ...error?.errors[i].properties,
          }
        })
        throw new BadRequestException(formattedError)
      }
      throw error;
    }
  }
  
  async findByEmailOrPhoneNumber(userCredential: string): Promise<User> {
    const user = await this.userModel.findOne({
      $or: [
        { email: userCredential },
        { phone: userCredential },
      ]
    })
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
