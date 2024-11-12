import {
  Injectable,
  InternalServerErrorException,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateLogDto } from '../logsgame/dto/log.dto';
import { LogsgameService } from '../logsgame/logsgame.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { ChangePasswordDto } from '../auth/dto/ChangePassword.dto';
import { CreateUserDto, UpdateUserDto, UserRole, Status } from './dto/user.dto';
import { UserProfile } from './interface/user.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private logservice: LogsgameService,
  ) {}

  async create(
    createUserDto: CreateUserDto,
  ): Promise<{ data: UserProfile; status: number; message: string }> {
    try {
      const existingUser = await this.prisma.users.findUnique({
        where: { email: createUserDto.email },
      });
      if (existingUser) {
        throw new ConflictException({
          message: 'Email already registered',
          status: 400,
        });
      }
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const newUser = await this.prisma.users.create({
        data: {
          username: createUserDto.username,
          name: createUserDto.name,
          email: createUserDto.email,
          password: hashedPassword,
          role: createUserDto.role as UserRole,
          avatar: createUserDto.avatar,
          status: createUserDto.status as Status,
        },
      });
      const dataresp = {
        username: newUser.username,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role as UserRole,
        avatar: newUser.avatar,
        status: newUser.status as Status,
      };
      return {
        data: dataresp,
        status: 200,
        message: 'User create successfully',
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException({
        data: null,
        status: 500,
        message: 'Internal server error',
      });
    }
  }

  async findAll(page: number, limit: number) {
    try {
      const skip = (page - 1) * limit;
      const data = await this.prisma.users.findMany({
        skip: skip,
        take: limit,
      });
      const totalEntries = await this.prisma.users.count();
      return {
        data: data,
        totalEntries: totalEntries,
        totalPages: Math.ceil(totalEntries / limit),
        currentPage: page,
        status: 200,
        message: 'OK',
      };
    } catch (error) {
      throw new InternalServerErrorException({
        status: 500,
        message: 'Internal server error',
      });
    }
  }

  async findOne(userId: string): Promise<any> {
    try {
      const user = await this.prisma.users.findUnique({
        where: { userId },
      });
      if (!user) {
        throw new NotFoundException({
          data: null,
          status: 404,
          message: 'User not found',
        });
      }
      return {
        userId: user.userId,
        username: user.username,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        status: user.status,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException({
        data: null,
        status: 500,
        message: 'Internal server error',
      });
    }
  }

  // eliminar usuario
  async remove(
    userId: string,
    req: any,
  ): Promise<{ status: number; message: string }> {
    try {
      const user = await this.prisma.users.findUnique({
        where: { userId },
      });
      if (!user) {
        throw new NotFoundException({
          message: 'User not found',
          status: 404,
        });
      }
      const logcreate: CreateLogDto = {
        userId: user.userId,
        action: 'DELETE USER',
        adminid: req.user.email,
        email: user.email,
      };
      await this.logservice.create(logcreate);
      await this.prisma.users.delete({
        where: { userId },
      });
      return { status: 204, message: 'User deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException({
        data: null,
        status: 500,
        message: 'Internal server error',
      });
    }
  }

  // Habilita o bloquea un usuario alternando el valor de isActive
  async enableDisableUser(
    userId: string,
    updateData: Partial<UpdateUserDto>,
    req: any,
  ): Promise<{ status: number; message: string }> {
    try {
      const user = await this.prisma.users.findUnique({
        where: { userId: userId },
      });
      if (!user) {
        throw new NotFoundException({
          message: 'User not found',
          status: 404,
        });
      }
      const logcreate: CreateLogDto = {
        userId: user.userId,
        action: updateData.status + ' USER',
        adminid: req.user.email,
        email: user.email,
      };
      await this.logservice.create(logcreate);

      const updatedUser = await this.prisma.users.update({
        where: { userId: userId },
        data: updateData,
      });
      return { status: 200, message: 'user updated successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException({
        status: 500,
        message: 'Internal server error',
      });
    }
  }

  // actualizar profile
  async updateProfileUser(
    userId: string,
    updateData: Partial<UpdateUserDto>,
  ): Promise<{ data: UpdateUserDto; status: number; message: string }> {
    try {
      const user = await this.prisma.users.findUnique({
        where: { userId: userId },
      });
      if (!user) {
        throw new NotFoundException({
          data: null,
          message: 'User not found',
          status: 404,
        });
      }
      const updatedUser = await this.prisma.users.update({
        where: { userId: userId },
        data: updateData,
      });
      const datauser = {
        username: updatedUser.username,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role as UserRole,
        status: updatedUser.status as Status,
        avatar: updatedUser.avatar,
      };
      return {
        data: datauser,
        status: 200,
        message: 'User updated successfully',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException({
        data: null,
        status: 500,
        message: 'Internal server error',
      });
    }
  }

  async changePasswordNew(
    userId: string,
    ChangePasswordDto: ChangePasswordDto,
  ) {
    try {
      const user = await this.prisma.users.findUnique({
        where: { userId: userId },
      });
      if (!user) {
        throw new NotFoundException({ status: 404, message: 'User not found' });
      }
      if (
        !(await bcrypt.compare(
          ChangePasswordDto.currentPassword,
          user.password,
        ))
      ) {
        throw new UnauthorizedException({
          status: 400,
          message: 'Invalid credentials',
        });
      }
      const hashedPassword = await bcrypt.hash(
        ChangePasswordDto.newPassword,
        10,
      );
      const updatedUser = await this.prisma.users.update({
        where: { userId: userId },
        data: { password: hashedPassword },
      });
      return { status: 200, message: 'Success updating password' };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      throw new InternalServerErrorException({
        data: null,
        status: 500,
        message: 'Internal server error',
      });
    }
  }
}
