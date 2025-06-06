import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Holiday } from './entities/holiday.entity';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResult } from '../common/interfaces/paginated-result.interface';
import { CreateHolidayDto } from './dto/create-holiday.dto';
import { User } from '../users/entities/user.entity';
import { UpdateHolidayDto } from './dto/update-holiday.dto';

@Injectable()
export class HolidaysService {
  constructor(
    @InjectRepository(Holiday)
    private readonly holidayRepository: Repository<Holiday>,
  ) {}

  async findAll(
    paginationDto: PaginationDto,
    search?: string,
  ): Promise<PaginatedResult<Holiday>> {
    const {
      page = 1,
      limit = 10,
      sort = 'createdAt',
      order = 'DESC',
    } = paginationDto;

    const skip = (page - 1) * limit;

    // Sinon, tri classique
    const whereCondition: FindOptionsWhere<Holiday> = {};
    if (search) {
      whereCondition.holidayName = ILike(`%${search}%`);
    }

    const orderBy: Record<string, 'ASC' | 'DESC'> = {};
    if (sort) {
      orderBy[sort] = order?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    }

    const [holidays, total] = await this.holidayRepository.findAndCount({
      where: whereCondition,
      relations: ['createdBy'],
      skip,
      take: limit,
      order: orderBy,
    });

    return {
      data: holidays,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async create(createHolidayDto: CreateHolidayDto, createdBy: string) {
    const existingHoliday = await this.holidayRepository.findOne({
      where: {
        holidayName: createHolidayDto.holidayName,
        holidayDate: createHolidayDto.holidayDate,
      },
    });

    if (existingHoliday) {
      throw new BadRequestException('Un jour férié avec ce nom existe déjà');
    }

    const holiday = this.holidayRepository.create({
      ...createHolidayDto,
      createdBy: { id: createdBy } as User,
    });

    return this.holidayRepository.save(holiday);
  }

  async findOne(id: string): Promise<Holiday> {
    const holiday = await this.holidayRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    });

    if (!holiday) {
      throw new BadRequestException('Jour férié non trouvé');
    }

    return holiday;
  }

  async update(
    id: string,
    updateHolidayDto: UpdateHolidayDto,
    updatedBy: string,
  ): Promise<Holiday> {
    const holiday = await this.findOne(id);
    if (
      updateHolidayDto.holidayName &&
      updateHolidayDto.holidayName !== holiday.holidayName
    ) {
      const existingHoliday = await this.holidayRepository.findOne({
        where: {
          holidayName: updateHolidayDto.holidayName,
          holidayDate: updateHolidayDto.holidayDate,
        },
      });
      if (existingHoliday) {
        throw new BadRequestException('Un jour férié avec ce nom existe déjà');
      }
    }
    Object.assign(holiday, updateHolidayDto, {
      updatedBy: { id: updatedBy } as User,
    });

    return this.holidayRepository.save(holiday);
  }

  async remove(id: string, deletedBy: string): Promise<void> {
    const holiday = await this.findOne(id);

    holiday.deletedBy = { id: deletedBy } as User;
    await this.holidayRepository.save(holiday);

    await this.holidayRepository.softDelete(id);
  }
}
