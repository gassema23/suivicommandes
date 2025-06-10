import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EnableTwoFactorDto {
  @ApiProperty()
  @IsString({ message: 'Le secret doit être une chaîne de caractères.' })
  secret: string;

  @ApiProperty({ example: '123456' })
  @IsString({ message: 'Le code doit être une chaîne de caractères.' })
  @Length(6, 6, { message: 'Le code doit contenir exactement 6 chiffres.' })
  code: string;
}
