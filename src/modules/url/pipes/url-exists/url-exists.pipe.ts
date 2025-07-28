import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UrlService } from '../../url.service';

@Injectable()
export class UrlExistsPipe implements PipeTransform {
  private host: string;

  constructor(private readonly urlService: UrlService) {}

   transform(uid: any) {
    console.log(`Validating URL with uid: ${uid}`);

    const redirectUrl = this.urlService.findOne(uid);


    if (!redirectUrl) {
      throw new NotFoundException(`URL with uid ${uid} not found`);
    }
    return redirectUrl;
  }
}
