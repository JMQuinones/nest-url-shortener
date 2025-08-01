import { Injectable } from '@nestjs/common';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';
import { UidService } from 'src/services/uid/uid.service';
import { DatabaseService } from 'src/database/database.service';
import { ConfigService } from '@nestjs/config';
import { GetUrlsDto } from './dto/get-urls-dto';

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

  async findAll({ page = 1, limit = 10, filter }: GetUrlsDto) {


    const skip = (page - 1) * limit;
    const whereClause = filter
      ? {
          OR: [
            { title: { contains: filter } },
            { description: { contains: filter } },
            { redirect: { contains: filter } },
          ],
        }
      : {};
    const urls = await this.databaseService.url.findMany({
      where: whereClause,
      take: limit,
      skip,
    });

    const totalCount = await this.databaseService.url.count();
    const totalPages = Math.ceil(totalCount / limit);
    let baseUrl = `${this.host}/url?limit=${limit}`;
    if (filter) {
      baseUrl += `&filter=${encodeURIComponent(filter)}`;
    }
    const nextPage =
      page < totalPages
        ? (baseUrl += `&page=${encodeURIComponent(page + 1)}`)
        : '';
    const prevPage =
      page > 1 ? (baseUrl += `&page=${encodeURIComponent(page - 1)}`) : '';
    const meta = {
      currentPage: page,
      perPage: limit,
      totalCount,
      totalPages,
      nextPage,
      prevPage,
    };
    return {
      urls,
      meta,
    };
  }

  async findOne(uid: string) {
    const url = await this.databaseService.url.findUnique({
      where: {
        url: `${this.host}/${uid}`,
      },
    });
    console.log(`Found URL: ${JSON.stringify(url)}`);
    return url;
  }

  async update(id: string, updateUrlDto: UpdateUrlDto) {
    return await this.databaseService.url.update({
      where: { id },
      data: updateUrlDto,
    });
  }

  async remove(id: string) {
    console.log(`Removing URL with id: ${id}`);
    return await this.databaseService.url.delete({
      where: { id },
    });
  }
}
