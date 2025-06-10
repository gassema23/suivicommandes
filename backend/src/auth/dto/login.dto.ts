import { IsEmail, IsString, IsOptional, Length } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail({}, { message: "L'adresse e-mail doit être une adresse valide." })
  email: string;

  @ApiProperty({ example: 'SecurePass123!' })
  @IsString({ message: 'Le mot de passe doit être une chaîne de caractères.' })
  password: string;

  @ApiPropertyOptional({
    example: '123456',
    description: 'Code 2FA (si activé)',
  })
  @IsOptional()
  @IsString({ message: 'Le code 2FA doit être une chaîne de caractères.' })
  @Length(6, 6, { message: 'Le code 2FA doit contenir exactement 6 chiffres.' })
  twoFactorCode?: string;
}
