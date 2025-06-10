import { IsEmail, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyTwoFactorDto {
  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail({}, { message: "L'adresse e-mail doit être une adresse valide." })
  email: string;

  @ApiProperty({ example: '123456' })
  @IsString({ message: 'Le code doit être une chaîne de caractères.' })
  @Length(6, 6, { message: 'Le code doit contenir exactement 6 chiffres.' })
  code: string;
}
