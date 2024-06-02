import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';

export const RequestHeader = createParamDecorator(
  async (value: any, ctx: ExecutionContext) => {
    const headers = ctx.switchToHttp().getRequest().headers;

    const dto = plainToInstance(value, headers, {
      excludeExtraneousValues: true,
    });

    try {
      await validateOrReject(dto);
    } catch (error: unknown) {
      const constraints = (error as any[]).reduce((prev, curr) => {
        return prev.concat(Object.values(curr.constraints));
      }, []);
      console.log(error);
      throw new BadRequestException({ message: constraints });
    }

    return dto;
  },
);
