import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  Request,
  Patch,
  Query,
  Put,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserProfile } from './interface/user.interface';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ValidaTokenGuard } from '../redis/valida-token.guard';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ChangePasswordDto } from '../auth/dto/ChangePassword.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @ApiBody({
    description: 'User credentials required to create an account.',
    type: CreateUserDto,
    examples: {
      example1: {
        summary: 'Example of data to create a new user',
        value: {
          username: 'testuser',
          name: 'Test User',
          email: 'user@example.com',
          password: 'password123',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'User created successfully.',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'number', example: 201 },
        message: { type: 'string', example: 'User created successfully' },
        data: {
          type: 'object',
          properties: {
            userId: { type: 'string', example: '12345' },
            username: { type: 'string', example: 'testuser' },
            name: { type: 'string', example: 'Test User' },
            email: { type: 'string', example: 'user@example.com' },
            role: { type: 'string', example: 'PLAYER' },
            status: { type: 'string', example: 'ACTIVE' },
          },
        },
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
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ data: UserProfile; status: number; message: string }> {
    return await this.usersService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Obtener perfil de usuario autenticado' })
  @ApiBearerAuth()
  @ApiParam({ name: 'userId', required: true, description: 'ID del usuario' })
  @ApiResponse({
    status: 400,
    description: 'User not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error. An unexpected error occurred.',
  })
  @UseGuards(JwtAuthGuard)
  @UseGuards(ValidaTokenGuard)
  @Get('profile/:userId')
  async findOne(@Param('userId') userId: string, @Request() req) {
    try {
      return await this.usersService.findOne(userId);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Listar usuarios (solo admin)' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'List of users retrieved successfully.',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'number', example: 200 },
        description: {
          type: 'string',
          example: 'List of users retrieved successfully.',
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
              name: { type: 'string', example: 'Usuarioexa' },
              username: { type: 'string', example: 'Usuario example' },
              avatar: {
                type: 'string',
                example: 'https://example.com/photo.jpg',
              },
              status: { type: 'string', example: 'ACTIVE' },
              role: { type: 'string', example: 'PLAYER' },
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
    data: UserProfile[];
    status: number;
    message: string;
    totalEntries: number;
    totalPages: number;
    currentPage;
  }> {
    return await this.usersService.findAll(Number(page), Number(limit));
  }

  @ApiOperation({ summary: 'Eliminar usuario (solo admin)' })
  @ApiBearerAuth()
  @ApiParam({ name: 'userId', required: true, description: 'ID del usuario' })
  @ApiResponse({
    status: 204,
    description: 'User deleted successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'User not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error. An unexpected error occurred.',
  })
  @UseGuards(JwtAuthGuard)
  @UseGuards(ValidaTokenGuard)
  @Delete('admin/delete/:userId')
  async remove(
    @Param('userId') userId: string,
    @Request() req: any,
  ): Promise<{ status: number; message: string }> {
    return await this.usersService.remove(userId, req);
  }

  @ApiOperation({ summary: 'Actualizar perfil del usuario' })
  @ApiBearerAuth()
  @ApiParam({ name: 'userId', required: true, description: 'ID del usuario' })
  @ApiBody({
    description: 'User update.',
    type: CreateUserDto,
    examples: {
      example1: {
        summary: 'Example of data to update a user',
        value: {
          username: 'testuser',
          name: 'Test User',
          email: 'user@example.com',
          avatar: 'htttp://',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'User updated successfully' },
        status: { type: 'number', example: 200 },
        data: {
          type: 'object',
          properties: {
            userId: { type: 'string', example: '12345' },
            name: { type: 'string', example: 'User' },
            username: { type: 'string', example: 'user' },
            email: { type: 'string', example: 'user@example.com' },
            avatar: {
              type: 'string',
              example: 'https://example.com/avatar.jpg',
            },
            role: { type: 'string', example: 'USER' },
            status: { type: 'string', example: 'PLAYER' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'User not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error. An unexpected error occurred.',
  })
  @UseGuards(JwtAuthGuard)
  @UseGuards(ValidaTokenGuard)
  @Put('profile/update/:userId')
  async updateProfile(
    @Param('userId') userId: string,
    @Body() updateUserDto: Partial<UpdateUserDto>,
  ): Promise<{ data: UpdateUserDto; status: number; message: string }> {
    return await this.usersService.updateProfileUser(userId, updateUserDto);
  }

  @ApiOperation({ summary: 'Habilitar o bloquear usuario (solo admin)' })
  @ApiBearerAuth()
  @ApiParam({ name: 'userId', required: true, description: 'ID del usuario' })
  @ApiBody({
    description: 'User update.',
    type: CreateUserDto,
    examples: {
      example1: {
        summary: 'Example of data to update a user',
        value: {
          status: 'BLOCK',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'User not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error. An unexpected error occurred.',
  })
  @UseGuards(JwtAuthGuard)
  @Patch('admin/block/:userId')
  async enableDisableUser(
    @Param('userId') userId: string,
    @Body() updateUserDto: Partial<UpdateUserDto>,
    @Request() req: any,
  ): Promise<{ status: number; message: string }> {
    return await this.usersService.enableDisableUser(
      userId,
      updateUserDto,
      req,
    );
  }

  @ApiOperation({ summary: 'Obtener un usuario por ID' })
  @ApiParam({ name: 'userId', required: true, description: 'ID del usuario' })
  @ApiResponse({
    status: 201,
    description: 'User get successfully.',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'number', example: 201 },
        message: { type: 'string', example: 'User created successfully' },
        data: {
          type: 'object',
          properties: {
            userId: { type: 'string', example: '12345' },
            username: { type: 'string', example: 'testuser' },
            name: { type: 'string', example: 'Test User' },
            email: { type: 'string', example: 'user@example.com' },
            role: { type: 'string', example: 'PLAYER' },
            status: { type: 'string', example: 'ACTIVE' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'User not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error. An unexpected error occurred.',
  })
  @Get('getuser/:userId')
  async findOneuser(@Param('userId') userId: string, @Request() req) {
    try {
      return await this.usersService.findOne(userId);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Cargar imagen de perfil' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(ValidaTokenGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Profile image file to upload',
    type: 'multipart/form-data',
    examples: {
      'image-example': {
        summary: 'Profile Image Example',
        value: {
          file: 'image.jpg',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Image uploaded successfully',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error. An unexpected error occurred.',
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${uniqueSuffix}${ext}`);
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  @Post('profile/upload-image')
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No se recibió el archivo');
    }
    return {
      message: 'Imagen subida correctamente',
      filename: file.filename,
      path: `/uploads/${file.filename}`,
      mimeType: file.mimetype,
    };
  }

  @ApiOperation({ summary: 'Cambiar contraseña de usuario' })
  @ApiBearerAuth()
  @ApiParam({ name: 'userId', required: true, description: 'ID del usuario' })
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Password, updated sucessfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error. An unexpected error occurred.',
  })
  @ApiBody({
    description: 'Datos para cambiar contraseña',
    type: ChangePasswordDto,
    examples: {
      example1: {
        summary: 'Ejemplo de cambio de contraseña',
        value: {
          currentPassword: 'passwordActual123',
          newPassword: 'passwordNuevo123',
        },
      },
    },
  })
  @Post('changepassword/:userId')
  async changePasswordNew(
    @Param('userId') userId: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return await this.usersService.changePasswordNew(userId, changePasswordDto);
  }
}
