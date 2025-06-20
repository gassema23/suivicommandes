import { Injectable, BadRequestException } from '@nestjs/common';
import { CalculateDeadlineDto } from '../dto/calculate-deadline.dto';
import { HolidaysService } from '@/holidays/services/holidays.service';

@Injectable()
export class DeadlineService {
  constructor(
    private readonly holidaysService: HolidaysService, // Assuming HolidaysService is defined and imported correctly
  ) {}

  async calculateDeadline(dto: CalculateDeadlineDto) {
    const { startDate, delayInDays } = dto;
    const start = new Date(startDate);
    if (isNaN(start.getTime())) {
      throw new BadRequestException('Date de départ invalide');
    }
    if (typeof delayInDays !== 'number' || delayInDays < 0) {
      throw new BadRequestException('Le délai doit être un nombre positif');
    }
    // Récupère les jours fériés depuis le service
    const holidays: string[] = await this.holidaysService.getHolidays();
    const current = new Date(start);
    let daysAdded = 0;

    while (daysAdded < delayInDays) {
      current.setDate(current.getDate() + 1);
      const dateStr = current.toISOString().split('T')[0];
      const isWeekend = current.getDay() === 0 || current.getDay() === 6;
      const isHoliday = holidays.includes(dateStr);
      if (!isWeekend && !isHoliday) {
        daysAdded++;
      }
    }

    return { deadline: current.toISOString() };
  }
}
