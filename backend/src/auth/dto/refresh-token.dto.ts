import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty()
  @IsString({
    message: 'Le token de rafraîchissement doit être une chaîne de caractères.',
  })
  refreshToken: string;
}
