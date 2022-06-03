import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { User, PrismaClient } from '@prisma/client';

import UserService from './user.service';

@Controller({
  path: '/users',
  version: '1',
})
export class UserController {
  constructor(private readonly userService: UserService) {}
}
