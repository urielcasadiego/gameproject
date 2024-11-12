import { Module } from '@nestjs/common';
import { LogsgameController } from './logsgame.controller';
import { LogsgameService } from './logsgame.service';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ValidaTokenGuard } from '../redis/valida-token.guard';
@Module({
  controllers: [LogsgameController],
  providers: [
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
