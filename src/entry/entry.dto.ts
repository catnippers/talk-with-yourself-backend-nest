import { Entry } from '@prisma/client';
import {
  IsArray,
  IsDate,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
} from 'class-validator';
import emotions from './emotions';

export default class EntryDto {
  @IsNumber()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsArray()
  emotions: string[];

  @IsDate()
  @IsNotEmpty()
  createdAt: Date;

  @IsDate()
  @IsNotEmpty()
  updatedAt: Date;

  constructor(entry: Entry) {
    this.id = entry.id;
    this.name = entry.name;
    this.emotions = entry.emotions;
    this.createdAt = entry.createdAt;
    this.updatedAt = entry.updatedAt;
  }
}

export class LoadEntryRequest {
  @IsString()
  @IsNotEmpty()
  @Length(32,32)
  secretKey: string;
}

export class CreateEntryRequest {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty({
    each: true
  })
  @IsArray()
  @IsIn(emotions.positiveEmotions.english, {each: true})
  emotions: string[];

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  @Length(32,32)
  userSecret: string;
}

export class UpdateEntryRequest {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsArray()
  emotions: string[];

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  userSecret: string;
}
