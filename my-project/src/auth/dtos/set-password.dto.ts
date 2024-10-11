import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SetPasswordDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}
