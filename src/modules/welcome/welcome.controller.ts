import { Controller, Get } from '@nestjs/common';

@Controller('/')
export class WelcomeController {
  @Get()
  base() {
    return 'Welcome to the API';
  }
}
