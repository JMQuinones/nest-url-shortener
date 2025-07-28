import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';
import { UidService } from 'src/services/uid/uid.service';
import { DatabaseService } from 'src/database/database.service';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

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
        url: `${this.host}/url/${randId}`,
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
        url: `${this.host}/url/${uid}`,
      },
    });
    return url;
  }

  update(uid: number, updateUrlDto: UpdateUrlDto) {
    return `This action updates a #${uid} url`;
  }

  remove(uid: number) {
    return `This action removes a #${uid} url`;
  }
}
