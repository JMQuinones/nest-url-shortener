import { IsDefined, IsEmail } from "class-validator";

export class CreateUserDto {
    @IsEmail()
    @IsDefined()
    email: string
}