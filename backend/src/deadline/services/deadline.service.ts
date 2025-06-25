import { Injectable, BadRequestException } from '@nestjs/common';
import { CalculateDeadlineDto } from '../dto/calculate-deadline.dto';
import { HolidaysService } from '@/holidays/services/holidays.service';
import { DataToCalculateDeadlineDto } from '../dto/data-to-calculate-deadline.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestTypeServiceCategory } from '@/request-type-service-categories/entities/request-type-service-category.entity';
import { Repository } from 'typeorm';
import { RequestTypeDelay } from '@/request-type-delays/entities/request-type-delay.entity';

@Injectable()
export class DeadlineService {
  constructor(
    private readonly holidaysService: HolidaysService,
    @InjectRepository(RequestTypeServiceCategory)
    private readonly requestTypeServiceCategoryRepository: Repository<RequestTypeServiceCategory>,
    @InjectRepository(RequestTypeDelay)
    private readonly requestTypeDelayepository: Repository<RequestTypeDelay>,
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

  async getDataToCalculateDeadline(dto: DataToCalculateDeadlineDto) {
    const { requestTypeServiceCategoryId, requestTypeDelayId } = dto;

    const requestTypeServiceCategory =
      await this.requestTypeServiceCategoryRepository.findOneOrFail({
        where: { id: requestTypeServiceCategoryId },
        relations: [
          'serviceCategory',
          'serviceCategory.service',
          'serviceCategory.service.sector',
        ],
      });
    if (!requestTypeServiceCategory) {
      throw new BadRequestException(
        "La catégorie de service spécifiée n'existe pas.",
      );
    }

    // Récupère les délais associés à la catégorie de service
    if (requestTypeDelayId) {
      const requestType = await this.requestTypeDelayepository.findOneOrFail({
        where: { id: requestTypeDelayId },
        relations: ['requestType'],
      });
      if (!requestType) {
        throw new BadRequestException(
          "Le type de demande spécifié n'existe pas.",
        );
      }
    }

    return {
      requestTypeServiceCategory: {
        id: requestTypeServiceCategory.id,
        sectorClientTimeEnd:
          requestTypeServiceCategory?.serviceCategory?.service?.sector
            ?.sectorClientTimeEnd || null,
        sectorProviderTimeEnd:
          requestTypeServiceCategory?.serviceCategory?.service?.sector
            ?.sectorProviderTimeEnd || null,
        isAutoCalculate:
          requestTypeServiceCategory?.serviceCategory?.service?.sector
            ?.isAutoCalculate || false,
        isConformity:
          requestTypeServiceCategory?.serviceCategory?.service?.sector
            ?.isConformity || false,
        isMultiLink:
          requestTypeServiceCategory?.serviceCategory?.isMultiLink || false,
        isMultiProvider:
          requestTypeServiceCategory?.serviceCategory?.isMultiProvider || false,
        isRequiredExpertise:
          requestTypeServiceCategory?.serviceCategory?.isRequiredExpertise ||
          false,
        availableDelay: requestTypeServiceCategory.availabilityDelay || 0,
        minimumRequiredDelay:
          requestTypeServiceCategory.minimumRequiredDelay || 0,
        serviceActivationDelay:
          requestTypeServiceCategory.serviceActivationDelay || 0,
      },
    };
  }
}
