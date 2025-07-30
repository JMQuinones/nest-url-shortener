import { ParseIntPipe } from '@nestjs/common';
import { IsInt, IsOptional, Min } from 'class-validator';
import { Transform } from 'class-transformer';   

export class GetUrlsDto {
  @IsOptional()
  filter?: string;
  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  page?: number;
  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  limit?: number;
}
