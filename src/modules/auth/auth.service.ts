import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../prisma/prisma.service';
import { JwtPayload } from './interface/jwt-payload.interface';
import { createClient } from 'redis';

@Injectable()
export class AuthService {
  private redisClient;

  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.redisClient = createClient({
      url: `redis://${this.configService.get('REDIS_HOST')}:${this.configService.get('REDIS_PORT')}`,
    });
    this.redisClient.connect().catch((err) => {
      console.error('Error connecting to Redis:', err);
    });
  }

  async validateUserByPayload(payload: JwtPayload) {
    const { userId } = payload;
    const user = await this.prisma.users.findUnique({
      where: { userId },
    });
    if (!user) {
      throw new NotFoundException({ status: 404, message: 'User_not_found' });
    }
    return { ...payload, ...user };
  }

  async login(email: string, password: string) {
    try {
      const user = await this.prisma.users.findUnique({
        where: { email },
      });
      if (!user) {
        throw new NotFoundException({ status: 404, message: 'User not found' });
      }
      if (!(await bcrypt.compare(password, user.password))) {
        throw new UnauthorizedException({
          status: 400,
          message: 'Invalid credentials',
        });
      }
      const payload: JwtPayload = {
        userId: user.userId,
        email: user.email,
        role: user.role,
        name: user.name,
        username: user.username,
        status: user.status,
        avatar: user.avatar,
      };
      const token = this.jwtService.sign(payload);
      const status = user.status;

      await this.redisClient.set(token, 'active', {
        EX: this.configService.get('JWT_EXPIRES_IN'),
      });

      if (status === 'BLOCKED') {
        throw new ForbiddenException({ status: 403, message: 'User blocked' });
      } else {
        this.validateToken(token);
        return {
          token: token,
          status: 200,
          message: 'Login successful',
          data: payload,
        };
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof ForbiddenException) {
        throw error;
      }
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException({
        status: 500,
        message: 'Internal server error',
      });
    }
  }
  async validateToken(token: string): Promise<boolean> {
    const result = await this.redisClient.get(token);
    return result === 'active';
  }

  async logout(token: string) {
    return await this.redisClient.del(token);
  }
}
