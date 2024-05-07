import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AppServiceUtils {
  generateMsg(payload: unknown) {
    return { id: uuidv4(), messsage: payload };
  }
}
