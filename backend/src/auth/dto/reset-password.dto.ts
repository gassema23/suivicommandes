import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty()
  @IsString({ message: 'Le token doit être une chaîne de caractères.' })
  token: string;

  @ApiProperty()
  @IsString({
    message: 'Le nouveau mot de passe doit être une chaîne de caractères.',
  })
  @MinLength(8, {
    message: 'Le nouveau mot de passe doit contenir au moins 8 caractères.',
  })
  newPassword: string;
}
