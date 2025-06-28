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
    private readonly requestTypeDelayRepository: Repository<RequestTypeDelay>,
  ) {}

  async calculateDeadline(dto: CalculateDeadlineDto) {
    const { startDate, startTime, delayInDays } = dto;

    const holidays = await this.holidaysService.getHolidays();

    console.log(
      `Calculating deadline: ${delayInDays} business days from ${startDate}`,
    );
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
      const requestType = await this.requestTypeDelayRepository.findOneOrFail({
        where: { id: requestTypeDelayId },
        relations: ['delayType'],
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

  private isWeekend(date) {
    if (date instanceof Date) {
      return date.getDay() % 6 === 0;
    }

    throw new Error('La date doit être un objet Date valide.');
  }
}
