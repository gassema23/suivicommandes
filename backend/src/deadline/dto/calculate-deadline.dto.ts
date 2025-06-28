import { Type } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CalculateDeadlineDto {
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsString()
  @IsOptional()
  startTime?: string;

  @IsInt()
  @IsPositive()
  delayInDays: number;
}
