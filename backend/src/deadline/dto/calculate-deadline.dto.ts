import { IsDateString, IsInt, Min } from 'class-validator';

export class CalculateDeadlineDto {
  @IsDateString()
  startDate: string;

  @IsInt()
  @Min(1)
  delayInDays: number;
}
