import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({ description: 'Votre mot de passe actuel.' })
  @IsString({
    message: 'Le mot de passe actuel doit être une chaîne de caractères.',
  })
  currentPassword: string;

  @ApiProperty({
    description: 'Votre nouveau mot de passe (minimum 8 caractères).',
  })
  @IsString({
    message: 'Le nouveau mot de passe doit être une chaîne de caractères.',
  })
  @MinLength(8, {
    message: 'Le nouveau mot de passe doit contenir au moins 8 caractères.',
  })
  newPassword: string;
}
