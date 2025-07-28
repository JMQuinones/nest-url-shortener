import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';
import { UidService } from 'src/services/uid/uid.service';
import { DatabaseService } from 'src/database/database.service';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { Url } from '@prisma/client';
import { dmmfToRuntimeDataModel } from 'generated/prisma/runtime/library';

@Injectable()
export class UrlService {
  private host: string;

  constructor(
    private readonly uidService: UidService,
    private readonly databaseService: DatabaseService,
    private readonly config: ConfigService,
  ) {}

  async onModuleInit() {
    this.host = this.config.getOrThrow<string>('host');
  }

  async create(createUrlDto: CreateUrlDto) {
    const randId = this.uidService.generateUid(5);
    const url = await this.databaseService.url.create({
      data: {
        ...createUrlDto,
        url: `${this.host}/${randId}`,
      },
    });
    return url;
  }

  findAll() {
    return `This action returns all url`;
  }

  async findOne(uid: string) {
    console.log(`uuid: ${uid}`);
    const url =  await this.databaseService.url.findUnique({
      where: {
        url: `${this.host}/${uid}`,
      },
    });
    return url;
  }

  async update(id: string, updateUrlDto: UpdateUrlDto) {

    return await this.databaseService.url.update({
      where: { id },
      data:updateUrlDto
    });
  }

  async remove(id: string) {
    console.log(`Removing URL with id: ${id}`);
    return await this.databaseService.url.delete({
      where: { id },  
    });
  }
}
