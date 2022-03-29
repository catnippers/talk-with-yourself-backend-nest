import { Entry } from "@prisma/client";
import { IsArray, IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";

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

    constructor (entry: Entry) {
        this.id = entry.id;
        this.name = entry.name;
        this.emotions = entry.emotions;
        this.createdAt = entry.createdAt;
        this.updatedAt = entry.updatedAt;
    }
}

export class CreateEntryRequest {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @IsArray()
    emotions: string[];

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty() @IsString()
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

    @IsNotEmpty() @IsString()
    userSecret: string;
}