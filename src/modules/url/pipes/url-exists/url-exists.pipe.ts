import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UrlService } from '../../url.service';

@Injectable()
export class UrlExistsPipe implements PipeTransform {
  private host: string;

  constructor(private readonly urlService: UrlService) {}

  async transform(uid: any) {
    console.log(`Validating URL with uid: ${uid}`);

    const redirectUrl = await this.urlService.findOne(uid);
    if (redirectUrl == null) {
      throw new NotFoundException(`URL with uid ${uid} not found`);
    }
    return redirectUrl;
  }
}
