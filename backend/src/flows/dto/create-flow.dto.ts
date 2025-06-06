import { IsString, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFlowDto {
  @ApiProperty({
    example: 'MCN -> Client',
    description: 'Nom du flux de transmission',
  })
  @IsOptional()
  @IsString()
  @MaxLength(125)
  flowName?: string;

  @ApiPropertyOptional({
    example: 'Une description',
    description: 'Description du flux de transmission',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  flowDescription?: string;
}
