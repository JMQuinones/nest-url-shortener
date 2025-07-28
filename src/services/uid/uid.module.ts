import { Module } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { UidService } from './uid.service';

@Module({
  providers: [UidService],
  exports: [UidService],
})
export class UidModule {
    generateUid(lenght?: number): string {
        return nanoid(lenght);
    }
}
