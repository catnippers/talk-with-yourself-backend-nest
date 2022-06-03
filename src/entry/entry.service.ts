import { Injectable } from '@nestjs/common';
import { Entry } from '@prisma/client';

import PrismaService from 'src/config/prisma/prisma.service';
import { EntryNotFound } from 'src/exception/entry.exceptions';
import EncryptionService from 'src/security/encryption/encryption.service';
import EntryDto, { CreateEntryRequest, UpdateEntryRequest } from './entry.dto';

interface EntriesService {
  findEntriesByUserId(userId: number): Promise<Entry[]>;
  createEntry(
    createEntryRequest: CreateEntryRequest,
    userId: number,
  ): Promise<EntryDto>;
  updateEntry(
    id: number,
    updateEntryRequest: UpdateEntryRequest,
  ): Promise<EntryDto>;
  loadEntry(id: number, secretKey: string): Promise<Entry>;
}

@Injectable()
export default class EntryServiceImpl implements EntriesService {
  constructor(
    private prisma: PrismaService,
    private encryptionService: EncryptionService,
  ) {}

  async loadEntry(id: number, secretKey: string): Promise<Entry> {
    const entry = await this.prisma.entry.findUnique({
      where: { id: id },
    });
    if (!entry) {
      throw new EntryNotFound('Entry not found');
    }
    const decrypted = this.encryptionService.decrypt(
      entry.description,
      secretKey,
    );
    entry.description = decrypted;
    return entry;
  }

  async createEntry(
    createEntryRequest: CreateEntryRequest,
    userId: number,
  ): Promise<EntryDto> {
    const { name, description, emotions, userSecret } = createEntryRequest;
    return new EntryDto(
      await this.prisma.entry.create({
        data: {
          name: name,
          description: this.encryptionService.encrypt(description, userSecret),
          emotions: emotions,
          user_id: userId,
        },
      }),
    );
  }

  async findEntriesByUserId(userId: number): Promise<Entry[]> {
    return await this.prisma.entry.findMany({
      where: { user_id: userId },
    });
  }

  async updateEntry(
    id: number,
    updateEntryRequest: UpdateEntryRequest,
  ): Promise<EntryDto> {
    const { name, description, emotions, userSecret } = updateEntryRequest;
    return new EntryDto(
      await this.prisma.entry.update({
        where: { id: id },
        data: {
          name: name,
          description: this.encryptionService.encrypt(description, userSecret),
          emotions: emotions,
        },
      }),
    );
  }
}
