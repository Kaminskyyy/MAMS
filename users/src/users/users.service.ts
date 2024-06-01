import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SignUpDto } from 'src/auth/dto/signup.dto';
import { User } from 'src/database/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
  ) {}

  async findOneByEmail(email: string): Promise<User> {
    return this.usersRepo.findOne({ where: { email } });
  }

  async create(userDto: SignUpDto): Promise<User> {
    const user = this.usersRepo.create(userDto);

    await user.save();

    return user;
  }
}
