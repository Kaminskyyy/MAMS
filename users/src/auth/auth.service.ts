import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { scrypt as _scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';
import { User } from 'src/database/entity/user.entity';
import { SignUpDto } from './dto/signup.dto';
import { JwtService } from '@nestjs/jwt';
const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) return null;

    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) return null;
    // throw new BadRequestException('bad password');

    return user;
  }

  async signup(signUpDto: SignUpDto) {
    const existingUser = await this.usersService.findOneByEmail(
      signUpDto.email,
    );
    if (existingUser) throw new BadRequestException('email in use');

    const salt = randomBytes(8).toString('hex');

    const hash = (await scrypt(signUpDto.password, salt, 32)) as Buffer;

    signUpDto.password = `${salt}.${hash.toString('hex')}`;

    const user = await this.usersService.create(signUpDto);

    delete user.password;
    return {
      user,
      access_token: this.createJWT(user.email, user.id),
    };
  }

  async signin(user: User) {
    delete user.password;
    return {
      user,
      access_token: this.createJWT(user.email, user.id),
    };
  }

  private createJWT(userEmail: string, userId: number) {
    const payload = { email: userEmail, sub: userId };
    return this.jwtService.sign(payload);
  }
}
