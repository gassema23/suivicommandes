import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { CalculateDeadlineDto } from '../dto/calculate-deadline.dto';
import { HolidaysService } from '../../holidays/services/holidays.service';
import { DataToCalculateDeadlineDto } from '../dto/data-to-calculate-deadline.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestTypeServiceCategory } from '../../request-type-service-categories/entities/request-type-service-category.entity';
import { Repository } from 'typeorm';
import { RequestTypeDelay } from '../../request-type-delays/entities/request-type-delay.entity';
import * as moment from 'moment';

@Injectable()
export class DeadlineService {
  private readonly logger = new Logger(DeadlineService.name);

  constructor(
    private readonly holidaysService: HolidaysService,
    @InjectRepository(RequestTypeServiceCategory)
    private readonly requestTypeServiceCategoryRepository: Repository<RequestTypeServiceCategory>,
    @InjectRepository(RequestTypeDelay)
    private readonly requestTypeDelayRepository: Repository<RequestTypeDelay>,
  ) {}

  /**
   * Calculate the deadline based on the start date and delay in business days.
   *
   * @param dto CalculateDeadlineDto - The DTO containing the start date and delay in days.
   * @returns Promise<{ deadline: Date; delay: number; holidays: Array<{ holidayDate: string; holidayName: string }> }>
   */
  async calculateDeadline(dto: CalculateDeadlineDto) {
    const { startDate, delayInDays } = dto;
    const startMoment = moment(startDate, 'YYYY-MM-DD');

    const finalDeadline = await this.calculateDeadlineFromStartDate(
      startMoment,
      delayInDays,
    );

    const holidaysInRange = await this.getHolidaysInRange(
      startMoment.toDate(),
      finalDeadline.toDate(),
    );

    return {
      deadline: finalDeadline.toDate(),
      delay: delayInDays,
      startDate: startMoment.format('YYYY-MM-DD'),
      holidays: holidaysInRange,
    };
  }

  private async getHolidaysInRange(
    startDate: Date,
    endDate: Date,
  ): Promise<Array<{ holidayDate: string; holidayName: string }>> {
    try {
      // Récupération des jours fériés avec leurs noms
      const holidaysWithNames =
        await this.holidaysService.getHolidaysWithNames();

      return holidaysWithNames
        .filter((holiday) => {
          const holidayDate = new Date(holiday.holidayDate);
          return holidayDate >= startDate && holidayDate <= endDate;
        })
        .map((holiday) => ({
          holidayDate: moment(holiday.holidayDate).format('YYYY-MM-DD'),
          holidayName: holiday.holidayName || 'Unknown Holiday',
        }));
    } catch (error) {
      this.logger.warn(`Failed to fetch holidays in range: ${error}`);
      return [];
    }
  }

  private async calculateDeadlineFromStartDate(
    startDate: moment.Moment,
    daysToAdd: number,
  ): Promise<moment.Moment> {
    const holidays = await this.holidaysService.getHolidays();

    const parseDate = startDate.clone();

    while (this.isWeekend(parseDate) || this.isHoliday(parseDate, holidays)) {
      parseDate.add(1, 'day');
    }
    let addedDays = 0;
    while (addedDays < daysToAdd) {
      parseDate.add(1, 'day');
      // Si ce n'est ni un weekend ni un jour férié, compter ce jour
      if (!this.isWeekend(parseDate) && !this.isHoliday(parseDate, holidays)) {
        addedDays++;
      }
    }

    return parseDate;
  }

  private isWeekend(date: moment.Moment): boolean {
    const dayOfWeek = date.day();
    // 0 = Dimanche, 6 = Samedi
    return dayOfWeek === 0 || dayOfWeek === 6; // 0 = Dimanche, 6 = Samedi
  }

  private isHoliday(date: moment.Moment, holidays: string[]): boolean {
    const dateStr = date.format('YYYY-MM-DD');
    return holidays.includes(dateStr);
  }

  /**
   * Retrieves data necessary for calculating deadlines based on the request type service category and delay.
   *
   * @param dto DataToCalculateDeadlineDto - The DTO containing the request type service category ID and delay ID.
   * @returns Promise<{ requestTypeServiceCategory: { id: number; sectorClientTimeEnd: number | null; sectorProviderTimeEnd: number | null; isAutoCalculate: boolean; isConformity: boolean; isMultiLink: boolean; isMultiProvider: boolean; isRequiredExpertise: boolean; availableDelay: number; minimumRequiredDelay: number; serviceActivationDelay: number } }>
   */
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
}
