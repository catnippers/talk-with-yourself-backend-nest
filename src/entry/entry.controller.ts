import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { Entry } from '@prisma/client';
import { Request } from 'express';
import JwtUtil from 'src/security/auth/jwt/jwt.util';

import EntryDto, { CreateEntryRequest, LoadEntryRequest } from './entry.dto';
import EntryService from './entry.service';

@Controller({
  path: '/entries/',
  version: '1',
})
export default class EntryController {
  constructor(private entryService: EntryService, private jwtUtil: JwtUtil) {}

  @Get('/')
  async findEntriesByUserId(@Req() request: Request): Promise<Entry[]> {
    const token = request.cookies.AccessToken;
    const userId = this.jwtUtil.extractClaimFromToken(token, 'sub');
    return await this.entryService.findEntriesByUserId(Number.parseInt(userId));
  }

  @Post('/')
  async createEntry(
    @Req() request: Request,
    @Body() createEntryRequest: CreateEntryRequest,
  ): Promise<EntryDto> {
    const token = request.cookies.AccessToken;
    const userId = this.jwtUtil.extractClaimFromToken(token, 'sub');
    return await this.entryService.createEntry(createEntryRequest, Number.parseInt(userId));
  }

  @Post('/:entryId')
  async loadEntry(
    @Param('entryId') entryId: string,
    @Body() body: LoadEntryRequest,
  ): Promise<Entry> {
    return await this.entryService.loadEntry(Number.parseInt(entryId), body.secretKey);
  }
}
