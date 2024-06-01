import { Controller, Get, Headers } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('test')
  getHello(
    // @Headers() headers,
    @Headers('x-user-id') userId: string,
    @Headers('x-user-email') userEmail: string,
  ) {
    // console.log(headers);

    return {
      ID: userId,
      EMAIL: userEmail,
    };
  }
}
