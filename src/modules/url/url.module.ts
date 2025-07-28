import { Module } from '@nestjs/common';
import { UrlService } from './url.service';
import { UrlController } from './url.controller';
import { UidService } from 'src/services/uid/uid.service';
import { UidModule } from 'src/services/uid/uid.module';

@Module({
  imports: [UidModule],
  controllers: [UrlController],
  providers: [UrlService],
})
export class UrlModule {}
