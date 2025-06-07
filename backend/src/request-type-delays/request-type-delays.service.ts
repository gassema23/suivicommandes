import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DelayType } from '../delay-types/entities/delay-type.entity';
import { RequestTypeServiceCategory } from '../request-type-service-categories/entities/request-type-service-category.entity';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { RequestTypeDelay } from './entities/request-type-delay.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResult } from '../common/interfaces/paginated-result.interface';
import { CreateRequestTypeDelayDto } from './dto/create-request-type-delay.dto';
import { User } from '../users/entities/user.entity';
import { UpdateRequestTypeDelayDto } from './dto/update-request-type-delay.dto';

@Injectable()
export class RequestTypeDelaysService {
  /**
   * Service for managing request type delays, including CRUD operations and pagination.
   * @param requestTypeServiceCategoryRepository - Repository for RequestTypeServiceCategory entity.
   * @param delayTypeRepository - Repository for DelayType entity.
   * @param requestTypeDelayRepository - Repository for RequestTypeDelay entity.
   */
  constructor(
    @InjectRepository(RequestTypeServiceCategory)
    private readonly requestTypeServiceCategoryRepository: Repository<RequestTypeServiceCategory>,
    @InjectRepository(DelayType)
    private readonly delayTypeRepository: Repository<DelayType>,
    @InjectRepository(RequestTypeDelay)
    private readonly requestTypeDelayRepository: Repository<RequestTypeDelay>,
  ) {}

  /**
   * Retrieves a paginated list of request type delays with optional search functionality.
   * @param paginationDto - The pagination and sorting parameters.
   * @param search - Optional search term to filter results by delay type name or request type service category name.
   * @returns A paginated result containing the request type delays.
   */
  async findAll(
    paginationDto: PaginationDto,
    search?: string,
  ): Promise<PaginatedResult<RequestTypeDelay>> {
    const {
      page = 1,
      limit = 10,
      sort = 'createdAt',
      order = 'DESC',
    } = paginationDto;
    const skip = (page - 1) * limit;

    const whereCondition: FindOptionsWhere<RequestTypeDelay> = {};
    if (search) {
      // Search by delay type name or request type service category name
    }
    const orderBy: Record<string, 'ASC' | 'DESC'> = {};
    if (sort) {
      orderBy[sort] = order?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    }

    const [items, total] = await this.requestTypeDelayRepository.findAndCount({
      where: whereCondition,
      relations: [
        'requestTypeServiceCategory',
        'requestTypeServiceCategory.requestType',
        'requestTypeServiceCategory.serviceCategory',
        'requestTypeServiceCategory.serviceCategory.service',
        'requestTypeServiceCategory.serviceCategory.service.sector',
        'delayType',
      ],
      skip,
      take: limit,
      order: orderBy,
    });

    return {
      data: items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Creates a new request type delay association.
   * @param dto - The data transfer object containing the details of the request type delay to create.
   * @param createdBy - The ID of the user creating the request type delay.
   * @returns The created request type delay entity.
   * @throws BadRequestException if an association with the same request type service category and delay type already exists.
   */
  async create(dto: CreateRequestTypeDelayDto, createdBy: string) {
    // Vérifie l'existence d'une association identique
    const existing = await this.requestTypeDelayRepository.findOne({
      where: {
        requestTypeServiceCategory: { id: dto.requestTypeServiceCategoryId },
        delayType: { id: dto.delayTypeId },
      },
      relations: ['requestTypeServiceCategory', 'delayType'],
    });

    if (existing) {
      throw new BadRequestException(
        'Une association entre ce type de demande et ce type de délai existe déjà',
      );
    }

    const requestTypeServiceCategory =
      await this.requestTypeServiceCategoryRepository.findOne({
        where: { id: dto.requestTypeServiceCategoryId },
      });
    if (!requestTypeServiceCategory) {
      throw new BadRequestException('Type de demande introuvable');
    }

    const delayType = await this.delayTypeRepository.findOne({
      where: { id: dto.delayTypeId },
    });
    if (!delayType) {
      throw new BadRequestException('Type de délai introuvable');
    }

    const entity = this.requestTypeDelayRepository.create({
      ...dto,
      requestTypeServiceCategory,
      delayType,
      createdBy: { id: createdBy } as User,
    });

    return this.requestTypeDelayRepository.save(entity);
  }

  /**
   * Finds a request type delay by its ID.
   * @param id - The ID of the request type delay to find.
   * @returns The found request type delay entity.
   * @throws BadRequestException if the request type delay is not found.
   */
  async findOne(id: string): Promise<RequestTypeDelay> {
    const entity = await this.requestTypeDelayRepository.findOne({
      where: { id },
      relations: [
        'requestTypeServiceCategory',
        'requestTypeServiceCategory.requestType',
        'requestTypeServiceCategory.serviceCategory',
        'requestTypeServiceCategory.serviceCategory.service',
        'requestTypeServiceCategory.serviceCategory.service.sector',
        'delayType',
        'createdBy',
      ],
    });

    if (!entity) {
      throw new BadRequestException(
        'Association type de demande/type de délai introuvable',
      );
    }

    return entity;
  }

  /**
   * Updates an existing request type delay.
   * @param id - The ID of the request type delay to update.
   * @param dto - The data transfer object containing the updated details.
   * @param updatedBy - The ID of the user updating the request type delay.
   * @returns The updated request type delay entity.
   * @throws BadRequestException if the request type service category or delay type is not found.
   */
  async update(
    id: string,
    dto: UpdateRequestTypeDelayDto,
    updatedBy: string,
  ): Promise<RequestTypeDelay> {
    const entity = await this.findOne(id);

    if (dto.requestTypeServiceCategoryId) {
      const requestTypeServiceCategory =
        await this.requestTypeServiceCategoryRepository.findOne({
          where: { id: dto.requestTypeServiceCategoryId },
        });
      if (!requestTypeServiceCategory) {
        throw new BadRequestException('Type de demande introuvable');
      }
      entity.requestTypeServiceCategory = requestTypeServiceCategory;
    }

    if (dto.delayTypeId) {
      const delayType = await this.delayTypeRepository.findOne({
        where: { id: dto.delayTypeId },
      });
      if (!delayType) {
        throw new BadRequestException('Type de délai introuvable');
      }
      entity.delayType = delayType;
    }

    Object.assign(entity, dto);
    entity.updatedBy = { id: updatedBy } as User;

    return this.requestTypeDelayRepository.save(entity);
  }

  /**
   * Removes a request type delay by its ID.
   * @param id - The ID of the request type delay to remove.
   * @param deletedBy - The ID of the user removing the request type delay.
   * @returns A promise that resolves when the request type delay is removed.
   */
  async remove(id: string, deletedBy: string): Promise<void> {
    const entity = await this.findOne(id);

    entity.deletedBy = { id: deletedBy } as User;
    await this.requestTypeDelayRepository.save(entity);

    await this.requestTypeDelayRepository.softDelete(id);
  }
}
