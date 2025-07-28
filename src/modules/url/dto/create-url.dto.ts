import { IsNotEmpty, IsOptional, IsString, IsUrl } from "class-validator";

export class CreateUrlDto {
    @IsUrl()
    @IsNotEmpty()
    redirect: string;
    @IsString()
    @IsNotEmpty()
    title: string;
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    description?: string;
}
