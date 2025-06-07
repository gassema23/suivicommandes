import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestType } from '../request-types/entities/request-type.entity';
import { ServiceCategory } from '../service-categories/entities/service-category.entity';
import { Repository, FindOptionsWhere, ILike } from 'typeorm';
import { RequestTypeServiceCategory } from './entities/request-type-service-category.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResult } from '../common/interfaces/paginated-result.interface';
import { CreateRequestTypeServiceCategoryDto } from './dto/create-request-type-service-category.dto';
import { User } from '../users/entities/user.entity';
import { UpdateRequestTypeServiceCategoryDto } from './dto/update-request-type-service-category.dto';

@Injectable()
export class RequestTypeServiceCategoriesService {
  /**
   * Service for managing request type and service category associations, including CRUD operations and pagination.
   * @param requestTypeRepository - Repository for RequestType entity.
   * @param serviceCategoryRepository - Repository for ServiceCategory entity.
   * @param requestTypeServiceCategoryRepository - Repository for RequestTypeServiceCategory entity.
   */
  constructor(
    @InjectRepository(RequestType)
    private readonly requestTypeRepository: Repository<RequestType>,
    @InjectRepository(ServiceCategory)
    private readonly serviceCategoryRepository: Repository<ServiceCategory>,
    @InjectRepository(RequestTypeServiceCategory)
    private readonly requestTypeServiceCategoryRepository: Repository<RequestTypeServiceCategory>,
  ) {}

  /**
   * Retrieves a paginated list of request type service categories with optional search functionality.
   * @param paginationDto - The pagination and sorting parameters.
   * @param search - Optional search term to filter results by service category name.
   * @returns A paginated result containing the request type service categories.
   */
  async findAll(
    paginationDto: PaginationDto,
    search?: string,
  ): Promise<PaginatedResult<RequestTypeServiceCategory>> {
    const {
      page = 1,
      limit = 10,
      sort = 'createdAt',
      order = 'DESC',
    } = paginationDto;
    const skip = (page - 1) * limit;

    const whereCondition: FindOptionsWhere<RequestTypeServiceCategory> = {};
    if (search) {
      whereCondition.serviceCategory = {
        serviceCategoryName: ILike(`%${search}%`),
      } as any;
    }
    const orderBy: Record<string, 'ASC' | 'DESC'> = {};
    if (sort) {
      orderBy[sort] = order?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    }

    const [items, total] =
      await this.requestTypeServiceCategoryRepository.findAndCount({
        where: whereCondition,
        relations: [
          'requestType',
          'serviceCategory',
          'serviceCategory.service',
          'serviceCategory.service.sector',
          'createdBy',
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
   * Creates a new association between a request type and a service category.
   * @param dto - Data transfer object containing the details of the association.
   * @param createdBy - ID of the user creating the association.
   * @returns The created RequestTypeServiceCategory entity.
   * @throws BadRequestException if an association already exists or if the request type or service category is not found.
   */
  async create(dto: CreateRequestTypeServiceCategoryDto, createdBy: string) {
    // Vérifie l'existence d'une association identique
    const existing = await this.requestTypeServiceCategoryRepository.findOne({
      where: {
        serviceCategory: { id: dto.serviceCategoryId },
        requestType: { id: dto.requestTypeId },
      },
      relations: ['requestType', 'serviceCategory'],
    });

    if (existing) {
      throw new BadRequestException(
        'Une association entre ce type de demande et cette catégorie de service existe déjà',
      );
    }

    const requestType = await this.requestTypeRepository.findOne({
      where: { id: dto.requestTypeId },
    });
    if (!requestType) {
      throw new BadRequestException('Type de demande introuvable');
    }

    const serviceCategory = await this.serviceCategoryRepository.findOne({
      where: { id: dto.serviceCategoryId },
    });
    if (!serviceCategory) {
      throw new BadRequestException('Catégorie de service introuvable');
    }

    const entity = this.requestTypeServiceCategoryRepository.create({
      ...dto,
      requestType,
      serviceCategory,
      createdBy: { id: createdBy } as User,
    });

    return this.requestTypeServiceCategoryRepository.save(entity);
  }

  /**
   * Retrieves a single RequestTypeServiceCategory entity by its ID.
   * @param id - The ID of the RequestTypeServiceCategory to retrieve.
   * @returns The found RequestTypeServiceCategory entity.
   * @throws BadRequestException if the entity is not found.
   */
  async findOne(id: string): Promise<RequestTypeServiceCategory> {
    const entity = await this.requestTypeServiceCategoryRepository.findOne({
      where: { id },
      relations: [
        'requestType',
        'serviceCategory',
        'serviceCategory.service',
        'serviceCategory.service.sector',
        'createdBy',
      ],
    });

    if (!entity) {
      throw new BadRequestException(
        'Association type de demande/catégorie de service introuvable',
      );
    }

    return entity;
  }

  /**
   * Updates an existing RequestTypeServiceCategory entity.
   * @param id - The ID of the entity to update.
   * @param dto - Data transfer object containing the updated details.
   * @param updatedBy - ID of the user updating the entity.
   * @returns The updated RequestTypeServiceCategory entity.
   * @throws BadRequestException if the service category or request type is not found.
   */
  async update(
    id: string,
    dto: UpdateRequestTypeServiceCategoryDto,
    updatedBy: string,
  ): Promise<RequestTypeServiceCategory> {
    const entity = await this.findOne(id);

    if (dto.serviceCategoryId) {
      const serviceCategory = await this.serviceCategoryRepository.findOne({
        where: { id: dto.serviceCategoryId },
      });
      if (!serviceCategory) {
        throw new BadRequestException('Catégorie de service introuvable');
      }
      entity.serviceCategory = serviceCategory;
    }

    if (dto.requestTypeId) {
      const requestType = await this.requestTypeRepository.findOne({
        where: { id: dto.requestTypeId },
      });
      if (!requestType) {
        throw new BadRequestException('Type de demande introuvable');
      }
      entity.requestType = requestType;
    }

    Object.assign(entity, dto);
    entity.updatedBy = { id: updatedBy } as User;

    return this.requestTypeServiceCategoryRepository.save(entity);
  }

  /**
   * Removes a RequestTypeServiceCategory entity by its ID.
   * @param id - The ID of the entity to remove.
   * @param deletedBy - ID of the user performing the deletion.
   * @returns A promise that resolves when the entity is successfully removed.
   * @throws BadRequestException if the entity is not found.
   */
  async remove(id: string, deletedBy: string): Promise<void> {
    const entity = await this.findOne(id);

    entity.deletedBy = { id: deletedBy } as User;
    await this.requestTypeServiceCategoryRepository.save(entity);

    await this.requestTypeServiceCategoryRepository.softDelete(id);
  }
}
