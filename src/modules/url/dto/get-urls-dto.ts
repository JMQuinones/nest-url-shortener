import { ParseIntPipe } from '@nestjs/common';
import { IsInt, IsOptional, Min } from 'class-validator';
import { Transform } from 'class-transformer';   

export class GetUrlsDto {
  @IsOptional()
  filter?: string;
  @IsInt()
  @IsOptional()
  @Transform(({ value }) => {

    return value? parseInt(value, 10) : 1;
  })
  @Min(1)
  page?: number

  @IsInt()
  @IsOptional()
  @Transform(({ value }) => {
    return value? parseInt(value, 10) : 10;
  })
  @Min(1)
  limit?: number
}
