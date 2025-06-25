import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DelayType } from '../../delay-types/entities/delay-type.entity';
import { RequestTypeServiceCategory } from '../../request-type-service-categories/entities/request-type-service-category.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { RequestTypeDelay } from '../entities/request-type-delay.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';
import { CreateRequestTypeDelayDto } from '../dto/create-request-type-delay.dto';
import { User } from '../../users/entities/user.entity';
import { UpdateRequestTypeDelayDto } from '../dto/update-request-type-delay.dto';

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

    // Utilisation du QueryBuilder pour ne sélectionner que les champs nécessaires
    const qb = this.requestTypeDelayRepository
      .createQueryBuilder('rtd')
      .leftJoinAndSelect('rtd.requestTypeServiceCategory', 'rtsc')
      .leftJoinAndSelect('rtsc.requestType', 'rt')
      .leftJoinAndSelect('rtsc.serviceCategory', 'sc')
      .leftJoinAndSelect('sc.service', 'svc')
      .leftJoinAndSelect('svc.sector', 'sector')
      .leftJoinAndSelect('rtd.delayType', 'dt')
      .leftJoinAndSelect('rtd.createdBy', 'createdBy')
      .select([
        'rtd.id',
        'rtd.createdAt',
        'rtd.updatedAt',
        'rtd.delayValue',
        'rtsc.id',
        'rt.id',
        'rt.requestTypeName',
        'sc.id',
        'sc.serviceCategoryName',
        'svc.id',
        'svc.serviceName',
        'sector.id',
        'sector.sectorName',
        'dt.id',
        'dt.delayTypeName',
        'createdBy.id',
        'createdBy.firstName',
        'createdBy.lastName',
      ])
      .skip(skip)
      .take(limit)
      .orderBy(`rtd.${sort}`, order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC');

    if (search) {
      qb.andWhere(
        'dt.delayTypeName ILIKE :search OR sc.serviceCategoryName ILIKE :search',
        { search: `%${search}%` },
      );
    }

    const [items, total] = await qb.getManyAndCount();

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
        'Impossible de créer : une association entre ce type de demande et ce type de délai existe déjà.',
      );
    }

    const requestTypeServiceCategory =
      await this.requestTypeServiceCategoryRepository.findOne({
        where: { id: dto.requestTypeServiceCategoryId },
      });
    if (!requestTypeServiceCategory) {
      throw new BadRequestException(
        'Impossible de créer : type de demande introuvable avec cet identifiant.',
      );
    }

    const delayType = await this.delayTypeRepository.findOne({
      where: { id: dto.delayTypeId },
    });
    if (!delayType) {
      throw new BadRequestException(
        'Impossible de créer : type de délai introuvable avec cet identifiant.',
      );
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
    // Utilisation du QueryBuilder pour ne sélectionner que les champs nécessaires
    const qb = this.requestTypeDelayRepository
      .createQueryBuilder('rtd')
      .leftJoinAndSelect('rtd.requestTypeServiceCategory', 'rtsc')
      .leftJoinAndSelect('rtsc.requestType', 'rt')
      .leftJoinAndSelect('rtsc.serviceCategory', 'sc')
      .leftJoinAndSelect('sc.service', 'svc')
      .leftJoinAndSelect('svc.sector', 'sector')
      .leftJoinAndSelect('rtd.delayType', 'dt')
      .leftJoinAndSelect('rtd.createdBy', 'createdBy')
      .select([
        'rtd.id',
        'rtd.createdAt',
        'rtd.updatedAt',
        'rtd.delayValue',
        'rtsc.id',
        'rt.id',
        'rt.requestTypeName',
        'sc.id',
        'sc.serviceCategoryName',
        'svc.id',
        'svc.serviceName',
        'sector.id',
        'sector.sectorName',
        'dt.id',
        'dt.delayTypeName',
        'createdBy.id',
        'createdBy.firstName',
        'createdBy.lastName',
      ])
      .where('rtd.id = :id', { id });

    const entity = await qb.getOne();

    if (!entity) {
      throw new BadRequestException(
        'Aucune association type de demande/type de délai trouvée avec cet identifiant.',
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
        throw new BadRequestException(
          'Impossible de modifier : type de demande introuvable avec cet identifiant.',
        );
      }
      entity.requestTypeServiceCategory = requestTypeServiceCategory;
    }

    if (dto.delayTypeId) {
      const delayType = await this.delayTypeRepository.findOne({
        where: { id: dto.delayTypeId },
      });
      if (!delayType) {
        throw new BadRequestException(
          'Impossible de modifier : type de délai introuvable avec cet identifiant.',
        );
      }
      entity.delayType = delayType;
    }

    if (dto.requestTypeServiceCategoryId && dto.delayTypeId) {
      const existing = await this.requestTypeDelayRepository.findOne({
        where: {
          requestTypeServiceCategory: { id: dto.requestTypeServiceCategoryId },
          delayType: { id: dto.delayTypeId },
        },
      });
      if (existing && existing.id !== id) {
        throw new BadRequestException(
          'Impossible de modifier : une association entre ce type de demande et ce type de délai existe déjà.',
        );
      }
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

  /**
   * Finds request type delays associated with a specific request type service category.
   * @param id - The ID of the request type service category.
   * @returns An array of request type delays associated with the specified request type service category.
   */
  async findByRequestType(id: string): Promise<RequestTypeDelay[]> {
    const where: FindOptionsWhere<RequestTypeDelay> = {
      requestTypeServiceCategory: { id },
    };

    return this.requestTypeDelayRepository.find({
      where,
      relations: ['requestTypeServiceCategory', 'delayType'],
      order: { createdAt: 'DESC' },
    });
  }
}
