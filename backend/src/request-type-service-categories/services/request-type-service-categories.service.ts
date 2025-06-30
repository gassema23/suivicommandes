import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestType } from '../../request-types/entities/request-type.entity';
import { ServiceCategory } from '../../service-categories/entities/service-category.entity';
import { Repository } from 'typeorm';
import { RequestTypeServiceCategory } from '../entities/request-type-service-category.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';
import { CreateRequestTypeServiceCategoryDto } from '../dto/create-request-type-service-category.dto';
import { User } from '../../users/entities/user.entity';
import { UpdateRequestTypeServiceCategoryDto } from '../dto/update-request-type-service-category.dto';
import { DeliverableDelayRequestType } from '../../deliverable-delay-request-types/entities/deliverable-delay-request-type.entity';

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

    const qb = this.requestTypeServiceCategoryRepository
      .createQueryBuilder('rtsc')
      .leftJoinAndSelect('rtsc.requestType', 'rt')
      .leftJoinAndSelect('rtsc.serviceCategory', 'sc')
      .leftJoinAndSelect('sc.service', 'svc')
      .leftJoinAndSelect('svc.sector', 'sector')
      .leftJoinAndSelect('rtsc.createdBy', 'createdBy')
      .select([
        'rtsc.id',
        'rtsc.createdAt',
        'rtsc.updatedAt',
        'rtsc.availabilityDelay',
        'rtsc.minimumRequiredDelay',
        'rtsc.serviceActivationDelay',
        'rt.id',
        'rt.requestTypeName',
        'sc.id',
        'sc.serviceCategoryName',
        'svc.id',
        'svc.serviceName',
        'sector.id',
        'sector.sectorName',
        'createdBy.id',
        'createdBy.firstName',
        'createdBy.lastName',
      ])
      .skip(skip)
      .take(limit)
      .orderBy(`rtsc.${sort}`, order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC');

    if (search) {
      qb.andWhere('sc.serviceCategoryName ILIKE :search', {
        search: `%${search}%`,
      });
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
        'Impossible de créer : une association entre ce type de demande et cette catégorie de service existe déjà.',
      );
    }

    const requestType = await this.requestTypeRepository.findOne({
      where: { id: dto.requestTypeId },
    });
    if (!requestType) {
      throw new BadRequestException(
        'Impossible de créer : type de demande introuvable avec cet identifiant.',
      );
    }

    const serviceCategory = await this.serviceCategoryRepository.findOne({
      where: { id: dto.serviceCategoryId },
    });
    if (!serviceCategory) {
      throw new BadRequestException(
        'Impossible de créer : catégorie de service introuvable avec cet identifiant.',
      );
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
    const qb = this.requestTypeServiceCategoryRepository
      .createQueryBuilder('rtsc')
      .leftJoinAndSelect('rtsc.requestType', 'rt')
      .leftJoinAndSelect('rtsc.serviceCategory', 'sc')
      .leftJoinAndSelect('sc.service', 'svc')
      .leftJoinAndSelect('svc.sector', 'sector')
      .leftJoinAndSelect('rtsc.createdBy', 'createdBy')
      .select([
        'rtsc.id',
        'rtsc.createdAt',
        'rtsc.updatedAt',
        'rtsc.availabilityDelay',
        'rtsc.minimumRequiredDelay',
        'rtsc.serviceActivationDelay',
        'rt.id',
        'rt.requestTypeName',
        'sc.id',
        'sc.serviceCategoryName',
        'svc.id',
        'svc.serviceName',
        'sector.id',
        'sector.sectorName',
        'createdBy.id',
        'createdBy.firstName',
        'createdBy.lastName',
      ])
      .where('rtsc.id = :id', { id });

    const entity = await qb.getOne();

    if (!entity) {
      throw new BadRequestException(
        'Aucune association type de demande/catégorie de service trouvée avec cet identifiant.',
      );
    }

    return entity;
  }

  async getDeliverableDelayRequestByRequestTypeServiceCategory(
    id: string,
  ): Promise<DeliverableDelayRequestType[]> {
    const qb = this.requestTypeServiceCategoryRepository
      .createQueryBuilder('rtsc')
      .leftJoinAndSelect('rtsc.deliverableDelayRequestTypes', 'ddrt')
      .leftJoinAndSelect('ddrt.deliverable', 'deliverable')
      .select([
        'rtsc.id',
        'ddrt.id',
        'deliverable.id',
        'deliverable.deliverableName',
      ])
      .where('rtsc.id = :id', { id });

    const entities = await qb.getMany();

    if (!entities || entities.length === 0) {
      throw new BadRequestException(
        'Aucune association type de demande/catégorie de service trouvée avec cet identifiant.',
      );
    }

    // Flatten and filter out undefined/null
    const deliverableDelayRequestTypes = entities
      .flatMap((e) => e.deliverableDelayRequestTypes || [])
      .filter(Boolean);

    return deliverableDelayRequestTypes;
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

    if (dto.serviceCategoryId && dto.requestTypeId) {
      const existing = await this.requestTypeServiceCategoryRepository.findOne({
        where: {
          serviceCategory: { id: dto.serviceCategoryId },
          requestType: { id: dto.requestTypeId },
        },
      });
      if (existing && existing.id !== id) {
        throw new BadRequestException(
          'Impossible de modifier : une association entre ce type de demande et cette catégorie de service existe déjà.',
        );
      }
    }

    if (dto.serviceCategoryId) {
      const serviceCategory = await this.serviceCategoryRepository.findOne({
        where: { id: dto.serviceCategoryId },
      });
      if (!serviceCategory) {
        throw new BadRequestException(
          'Impossible de modifier : catégorie de service introuvable avec cet identifiant.',
        );
      }
      entity.serviceCategory = serviceCategory;
    }

    if (dto.requestTypeId) {
      const requestType = await this.requestTypeRepository.findOne({
        where: { id: dto.requestTypeId },
      });
      if (!requestType) {
        throw new BadRequestException(
          'Impossible de modifier : type de demande introuvable avec cet identifiant.',
        );
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
