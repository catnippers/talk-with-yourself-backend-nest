import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Entry } from '@prisma/client';

import EntryDto, { CreateEntryRequest } from './entry.dto';
import EntryService from './entry.service';

@Controller({
  path: '/entries/user/:userId',
  version: '1',
})
export default class EntryController {
  constructor(private entryService: EntryService) {}

  @Get('/')
  async findEntriesByUserId(@Param('userId') userId: number): Promise<Entry[]> {
    return await this.entryService.findEntriesByUserId(userId);
  }

  @Post('/')
  async createEntry(@Param('userId') userId: string, @Body() createEntryRequest: CreateEntryRequest): Promise<EntryDto> {
    return await this.entryService.createEntry(
      createEntryRequest,
      Number.parseInt(userId),
    );
  }

  @Post('/:entryId')
  async loadEntry(@Param('entryId') entryId: string, @Body() body: { secretKey: string }): Promise<Entry> {
    return await this.entryService.loadEntry(
      Number.parseInt(entryId),
      body.secretKey,
    );
  }
}
