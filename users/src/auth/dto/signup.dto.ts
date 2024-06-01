import { IsEmail, IsString, Length } from 'class-validator';

export class SignUpDto {
  @IsString()
  @Length(3, 100)
  firstName: string;

  @IsString()
  @Length(3, 100)
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(8, 64)
  password: string;
}
