import { IsDate, IsInt, IsPositive } from 'class-validator';

export class CalculateDeadlineDto {
  @IsDate()
  startDate: Date;

  @IsInt()
  @IsPositive()
  delayInDays: number;
}
