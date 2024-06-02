import { Expose, Transform } from 'class-transformer';
import { IsEmail, IsInt, Min } from 'class-validator';

export class XUserHeaders {
  @IsInt()
  @Min(0)
  @Transform((params) => parseInt(params.value))
  @Expose({ name: 'x-user-id' })
  ['X-User-Id']: number;

  @IsEmail()
  @Expose({ name: 'x-user-email' })
  ['X-User-Email']: string;
}
