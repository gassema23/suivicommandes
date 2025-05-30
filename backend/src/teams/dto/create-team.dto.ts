import { IsString, MaxLength, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTeamDto {
  @ApiProperty({ example: 'Équipe Développement', description: 'Nom de l\'équipe' })
  @IsString()
  @MaxLength(100)
  teamName: string;

  @ApiPropertyOptional({ example: 'Équipe responsable du développement', description: 'Description de l\'équipe' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  teamDescription?: string;

  @ApiPropertyOptional({ description: 'ID du propriétaire de l\'équipe' })
  @IsOptional()
  @IsUUID()
  ownerId?: string;
}