import { Injectable } from '@nestjs/common';

@Injectable()
export class DbServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
