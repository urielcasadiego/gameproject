import {
  Injectable,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateLogDto } from './dto/log.dto';

@Injectable()
export class LogsgameService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createLogDto: CreateLogDto,
  ): Promise<{ status: number; message: string }> {
    try {
      console.log('entra a servicio', createLogDto);
      const newLog = await this.prisma.logs.create({
        data: {
          action: createLogDto.action,
          userId: createLogDto.userId,
          adminid: createLogDto.adminid,
          email: createLogDto.email,
        },
      });
      return {
        status: 200,
        message: 'Log create successfully',
      };
    } catch (error) {
      console.log(error);
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
      const data = await this.prisma.logs.findMany({
        skip: skip,
        take: limit,
      });
      const totalEntries = await this.prisma.logs.count();
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
}
