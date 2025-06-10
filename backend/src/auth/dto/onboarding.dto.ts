import { IsEmail, IsString, IsStrongPassword } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OnboardingDto {
  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail({}, { message: "L'adresse e-mail doit être une adresse valide." })
  email: string;

  @ApiProperty({ example: 'SecurePass123!' })
  @IsString({ message: 'Le mot de passe doit être une chaîne de caractères.' })
  @IsStrongPassword(
    {},
    {
      message:
        'Le mot de passe doit être complexe (majuscules, minuscules, chiffres et caractères spéciaux).',
    },
  )
  password: string;

  @ApiProperty({ example: 'SecurePass123!' })
  @IsString({
    message:
      'La confirmation du mot de passe doit être une chaîne de caractères.',
  })
  @IsStrongPassword(
    {},
    {
      message:
        'La confirmation du mot de passe doit être complexe (majuscules, minuscules, chiffres et caractères spéciaux).',
    },
  )
  confirmPassword: string;
}
