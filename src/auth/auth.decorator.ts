import { createParamDecorator, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';

export const JwtUserParams = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  if (!req.jwt_payload) {
    throw new HttpException({message: 'Forbidden', error_id: 'user_invalid_jwt'}, HttpStatus.FORBIDDEN)
  }
  return req.jwt_payload;
});