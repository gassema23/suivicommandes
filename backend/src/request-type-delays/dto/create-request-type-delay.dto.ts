import { IsInt, IsOptional, IsUUID, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRequestTypeDelayDto {
  @ApiProperty({
    example: 'd3f1e2c3-4567-890a-bcde-f1234567890a',
    description: 'ID de la catégorie de service du type de demande',
  })
  @IsUUID('4', {
    message:
      "L'ID de la catégorie de service du type de demande doit être un UUID valide.",
  })
  requestTypeServiceCategoryId: string;

  @ApiProperty({
    example: 'a1b2c3d4-5678-90ab-cdef-1234567890ab',
    description: 'ID du type de délai',
  })
  @IsUUID('4', { message: "L'ID du type de délai doit être un UUID valide." })
  delayTypeId: string;

  @ApiPropertyOptional({
    example: '1',
    description: 'Délai en jours',
  })
  @IsInt({ message: 'Le délai doit être un entier.' })
  @Min(0, { message: 'Le délai doit être supérieur ou égal à 0.' })
  @IsOptional()
  delayValue?: number;
}
