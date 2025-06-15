import { IsString, IsStrongPassword, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({ description: 'Votre mot de passe actuel.' })
  @IsString({
    message: 'Le mot de passe actuel est requis.',
  })
  currentPassword: string;

  @ApiProperty({
    description:
      'Votre nouveau mot de passe (minimum 8 caractères, incluant majuscule, minuscule, chiffre et symbole).',
  })
  @IsString({
    message: 'Le nouveau mot de passe est requis.',
  })
  @IsStrongPassword(
    {},
    {
      message:
        'Le nouveau mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un symbole.',
    },
  )
  @MinLength(8, {
    message: 'Le nouveau mot de passe doit contenir au moins 8 caractères.',
  })
  newPassword: string;

  @ApiProperty({
    description: 'Confirmez votre nouveau mot de passe.',
  })
  @IsString({
    message: 'La confirmation du mot de passe est requise.',
  })
  confirmPassword: string;
}
