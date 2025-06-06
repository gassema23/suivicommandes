import { IsString, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDeliverableDto {
  @ApiProperty({
    example: 'Étude de faisabilité',
    description: 'Nom du livrable',
  })
  @IsOptional()
  @IsString()
  @MaxLength(125)
  deliverableName?: string;

  @ApiPropertyOptional({
    example: 'Une description',
    description: 'Description du livrable',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  deliverableDescription?: string;
}
