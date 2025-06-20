import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Holiday } from '../entities/holiday.entity';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';
import { CreateHolidayDto } from '../dto/create-holiday.dto';
import { User } from '../../users/entities/user.entity';
import { UpdateHolidayDto } from '../dto/update-holiday.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class HolidaysService {
  /**
   * Service pour gérer les jours fériés.
   * Permet de créer, lire, mettre à jour et supprimer des jours fériés.
   *
   * @param holidayRepository - Repository pour accéder aux données des jours fériés.
   */
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(Holiday)
    private readonly holidayRepository: Repository<Holiday>,
  ) {}

  /**
   * Récupère tous les jours fériés avec pagination et recherche.
   * @param paginationDto - DTO pour la pagination.
   * @param search - Termes de recherche optionnels.
   * @returns Un objet contenant les jours fériés et les métadonnées de pagination.
   */
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

  async getHolidays(): Promise<string[]> {
    const cacheKey = 'holidays';
    const cached = await this.cacheManager.get<string[]>(cacheKey);
    // 1. Si les jours fériés sont déjà en cache, on les retourne
    if (Array.isArray(cached)) {
      return cached;
    }

    // 2. Sinon, charge depuis la base
    const holidays = await this.holidayRepository.find({
      select: ['holidayDate'],
      order: { holidayDate: 'ASC' },
    });
    const holidayDates = holidays.map((holiday) => {
      if (typeof holiday.holidayDate === 'string') return holiday.holidayDate;
      return new Date(holiday.holidayDate).toISOString().split('T')[0];
    });
    await this.cacheManager.set(cacheKey, holidayDates, 60 * 60 * 24);

    return holidayDates;
  }

  /**
   * Crée un nouveau jour férié.
   * @param createHolidayDto - DTO contenant les informations du jour férié à créer.
   * @param createdBy - ID de l'utilisateur qui crée le jour férié.
   * @returns Le jour férié créé.
   */
  async create(createHolidayDto: CreateHolidayDto, createdBy: string) {
    const existingHoliday = await this.holidayRepository.findOne({
      where: {
        holidayName: createHolidayDto.holidayName,
        holidayDate: createHolidayDto.holidayDate,
      },
    });

    if (existingHoliday) {
      throw new BadRequestException(
        'Impossible de créer : un jour férié avec ce nom et cette date existe déjà.',
      );
    }

    const holiday = this.holidayRepository.create({
      ...createHolidayDto,
      createdBy: { id: createdBy } as User,
    });

    return this.holidayRepository.save(holiday);
  }

  /**
   * Récupère un jour férié par son ID.
   * @param id - ID du jour férié à récupérer.
   * @returns Le jour férié trouvé.
   * @throws BadRequestException si aucun jour férié n'est trouvé avec cet ID.
   */
  async findOne(id: string): Promise<Holiday> {
    const holiday = await this.holidayRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    });

    if (!holiday) {
      throw new BadRequestException(
        'Aucun jour férié trouvé avec cet identifiant.',
      );
    }

    return holiday;
  }

  /**
   * Met à jour un jour férié.
   * @param id - ID du jour férié à mettre à jour.
   * @param updateHolidayDto - DTO contenant les informations mises à jour.
   * @param updatedBy - ID de l'utilisateur qui met à jour le jour férié.
   * @returns Le jour férié mis à jour.
   * @throws BadRequestException si un jour férié avec le même nom et la même date existe déjà.
   */
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
        throw new BadRequestException(
          'Impossible de modifier : un jour férié avec ce nom et cette date existe déjà.',
        );
      }
    }
    Object.assign(holiday, updateHolidayDto, {
      updatedBy: { id: updatedBy } as User,
    });

    return this.holidayRepository.save(holiday);
  }

  /**
   * Supprime un jour férié de manière logique (soft delete).
   * @param id - ID du jour férié à supprimer.
   * @param deletedBy - ID de l'utilisateur qui supprime le jour férié.
   * @returns void
   */
  async remove(id: string, deletedBy: string): Promise<void> {
    const holiday = await this.findOne(id);

    holiday.deletedBy = { id: deletedBy } as User;
    await this.holidayRepository.save(holiday);

    await this.holidayRepository.softDelete(id);
  }
}
