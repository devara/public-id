import { Controller, Get } from '@nestjs/common';

@Controller('/')
export class BaseController {
  @Get()
  base() {
    return 'Welcome to the API';
  }
}
