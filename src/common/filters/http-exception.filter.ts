import {
  ExceptionFilter,
  Catch,
  HttpException,
  ArgumentsHost,
} from '@nestjs/common';
import { Response } from 'express';

interface CustomExceptionResponse {
  message?: string;
  code?: number;
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const responseData: CustomExceptionResponse =
      typeof exceptionResponse === 'object' ? exceptionResponse : {};

    const message = responseData.message || 'Error inesperado';
    const code = responseData.code || status;
    response.status(status).json({ code, message });
  }
}
