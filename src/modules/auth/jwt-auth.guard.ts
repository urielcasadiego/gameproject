import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext } from '@nestjs/common';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const extractedToken = request.headers.authorization?.split(' ')[1];
    if (extractedToken) {
      return request;
    }
    throw new UnauthorizedException({
      status: 404,
      message: 'No se encontró el token de autorización',
    });
  }

  handleRequest(err, user) {
    if (err) {
      console.error('Error', err);
      throw err;
    }
    if (!user) {
      console.error({ status: 400, message: 'Usuario no encontrado' });
      throw new UnauthorizedException();
    }
    return user;
  }
}
