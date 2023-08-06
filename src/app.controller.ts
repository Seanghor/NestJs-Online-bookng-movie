import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';

@Controller()
export class AppController {
  getHello(): any {
    throw new Error('Method not implemented.');
  }
 
}