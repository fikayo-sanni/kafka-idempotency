import {
  IsString,
  IsOptional,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateUserDto {
  @IsNumber()
  @IsOptional()
  id?: number;

  @IsString()
  @IsOptional()
  firstname?: string;

  @IsString()
  @IsOptional()
  lastname?: string;

  @IsEmail()
  @IsOptional()
  email?: string;
}

export class UpdateUserMessageDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => UpdateUserDto)
  message: UpdateUserDto;
}
