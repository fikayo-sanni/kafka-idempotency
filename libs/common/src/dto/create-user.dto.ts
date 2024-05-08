import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsEmail, ValidateNested } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstname: string;

  @IsString()
  @IsNotEmpty()
  lastname: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}
export class CreateUserMessageDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateUserDto)
  message: CreateUserDto;
}
