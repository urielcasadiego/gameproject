import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { LogsgameService } from '../logsgame/logsgame.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ValidaTokenGuard } from '../redis/valida-token.guard';
import { LogsgameController } from '../logsgame/logsgame.controller';
@Module({
  controllers: [UsersController, LogsgameController],
  providers: [
    UsersService,
    LogsgameService,
    PrismaService,
    JwtAuthGuard,
    JwtService,
    ValidaTokenGuard,
    AuthService,
  ],
  exports: [AuthService],
})
export class UsersModule {}
