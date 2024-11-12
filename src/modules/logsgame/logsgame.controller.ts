import { Body, Controller, Get, Post, UseGuards, Query } from '@nestjs/common';
import { Loggame } from './interface/loggame.interface';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ValidaTokenGuard } from '../redis/valida-token.guard';
import { LogsgameService } from './logsgame.service';
import { CreateLogDto } from './dto/log.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('logs')
@Controller('logs')
export class LogsgameController {
  constructor(private readonly logsService: LogsgameService) {}

  @ApiOperation({ summary: 'Registrar un nuevo log' })
  @ApiBearerAuth()
  @ApiBody({
    description: 'Log credentials required to create an account.',
    type: CreateLogDto,
    examples: {
      example1: {
        summary: 'Example of data to create a new log',
        value: {
          userId: '1232h-ada8-adaaa-daad',
          adminid: 'admin@example.com',
          email: 'user@example.com',
          action: 'ACTIVE USER',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Log created successfully.',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'number', example: 201 },
        message: { type: 'string', example: 'Log created successfully' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. The submitted data is invalid.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error. An unexpected error occurred.',
  })
  @Post('register')
  async create(
    @Body() CreateLogDto: CreateLogDto,
  ): Promise<{ status: number; message: string }> {
    console.log('entra a controler');
    return await this.logsService.create(CreateLogDto);
  }

  @ApiOperation({ summary: 'Listar logs (solo admin)' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'List of uselogsrs retrieved successfully.',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'number', example: 200 },
        description: {
          type: 'string',
          example: 'List of logs retrieved successfully.',
        },
        totalPages: { type: 'number', example: 10 },
        currentPage: { type: 'number', example: 1 },
        totalEntries: { type: 'number', example: 1 },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              userId: { type: 'string', example: 'ads234-234-asddas-23423' },
              email: { type: 'string', example: 'usuario@example.com' },
              adminid: { type: 'string', example: 'admin@example.com' },
              action: { type: 'string', example: 'DELETED USER' },
              createdAt: { type: 'string', example: '01/01/2024' },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error. An unexpected error occurred.',
  })
  @UseGuards(JwtAuthGuard)
  @UseGuards(ValidaTokenGuard)
  @Get('admin')
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ): Promise<{
    data: Loggame[];
    status: number;
    message: string;
    totalEntries: number;
    totalPages: number;
    currentPage;
  }> {
    return await this.logsService.findAll(Number(page), Number(limit));
  }
}
