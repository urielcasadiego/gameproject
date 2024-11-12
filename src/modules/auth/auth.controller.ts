import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Get,
  Req,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Inicio de sesión de usuario' })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    schema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
        message: { type: 'string', example: 'Login successful' },
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
    status: 401,
    description: 'Incorrect username or password.',
  })
  @ApiResponse({
    status: 500,
    description:
      'Internal Server Error. An unexpected error occurred on the server.',
  })
  @ApiBody({
    description: 'Credenciales de usuario',
    type: LoginDto,
    examples: {
      example1: {
        summary: 'Ejemplo de inicio de sesión',
        value: {
          email: 'usuario@gmail.com',
          password: 'password123',
        },
      },
    },
  })
  @ApiBody({
    description: 'User login data',
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
        password: { type: 'string', example: 'securePassword123' },
      },
    },
  })
  @Post('login')
  async login(@Body() user: LoginDto) {
    if (!user.email || !user.password) {
      throw new UnauthorizedException({
        message: 'Email and password required',
        status: 401,
      });
    }
    return await this.authService.login(user.email, user.password);
  }

  @Get('token-validate')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Validar token' })
  @ApiResponse({
    status: 200,
    description: 'Token valid',
  })
  @ApiResponse({
    status: 404,
    description: 'Token not Found',
  })
  @ApiResponse({
    status: 500,
    description:
      'Internal Server Error. An unexpected error occurred on the server.',
  })
  async logoutUser(@Req() req: Request) {
    const [type, token] = req.headers?.authorization?.split(' ') ?? [];
    if (!token) {
      throw new UnauthorizedException('Token no encontrado');
    }
    const isValid = await this.authService.validateToken(token);
    if (isValid) {
      return {
        message: 'Token válido',
        status: 200,
      };
    } else {
      throw new UnauthorizedException({
        status: 400,
        message: 'Token inválido',
      });
    }
  }

  @Get('logout')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout' })
  @ApiResponse({
    status: 200,
    description: 'successful operation',
  })
  @ApiResponse({
    status: 404,
    description: 'Token not Found',
  })
  @ApiResponse({
    status: 500,
    description:
      'Internal Server Error. An unexpected error occurred on the server.',
  })
  async validateToken(@Req() req: Request) {
    try {
      const [type, token] = req.headers?.authorization?.split(' ') ?? [];
      if (!token) {
        throw new UnauthorizedException({
          status: 404,
          message: 'Token not found',
        });
      }
      await this.authService.logout(token);
      return { status: 200, message: 'successful operation' };
    } catch (err) {
      throw new InternalServerErrorException({
        status: 500,
        message:
          'Internal Server Error. An unexpected error occurred on the server.',
      });
    }
  }
}
