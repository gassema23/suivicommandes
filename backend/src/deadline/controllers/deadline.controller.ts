import { Body, Controller, Post } from '@nestjs/common';
import { DeadlineService } from '../services/deadline.service';
import { CalculateDeadlineDto } from '../dto/calculate-deadline.dto';

@Controller('deadline')
export class DeadlineController {
  constructor(private readonly deadlineService: DeadlineService) {}

  @Post('calculate')
  calculate(@Body() dto: CalculateDeadlineDto) {
    return this.deadlineService.calculateDeadline(dto);
  }
}
