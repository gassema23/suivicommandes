import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Deliverable } from '../../deliverables/entities/deliverable.entity';
import { RequestTypeServiceCategory } from '../../request-type-service-categories/entities/request-type-service-category.entity';
import { Repository } from 'typeorm';
import { DeliverableDelayRequestType } from '../entities/deliverable-delay-request-type.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';
import { CreateDeliverableDelayRequestTypeDto } from '../dto/create-deliverable-delay-request-type.dto';
import { User } from '../../users/entities/user.entity';
import { UpdateDeliverableDelayRequestTypeDto } from '../dto/update-deliverable-delay-request-type.dto';
import { assertUniqueFields } from '@/common/utils/assert-unique-fields';
import { ERROR_MESSAGES } from '@/common/constants/error-messages.constant';

@Injectable()
export class DeliverableDelayRequestTypesService {
  /**
   * Service for managing deliverable delay request types, including CRUD operations and pagination.
   * @param requestTypeServiceCategoryRepository - Repository for RequestTypeServiceCategory entity.
   * @param deliverableRepository - Repository for Deliverable entity.
   * @param deliverableDelayRequestTypeRepository - Repository for DeliverableDelayRequestType entity.
   */
  constructor(
    @InjectRepository(RequestTypeServiceCategory)
    private readonly requestTypeServiceCategoryRepository: Repository<RequestTypeServiceCategory>,
    @InjectRepository(Deliverable)
    private readonly deliverableRepository: Repository<Deliverable>,
    @InjectRepository(DeliverableDelayRequestType)
    private readonly deliverableDelayRequestTypeRepository: Repository<DeliverableDelayRequestType>,
  ) {}

  /**
   * Retrieves a paginated list of deliverable delay request types with optional search functionality.
   * @param paginationDto - The pagination and sorting parameters.
   * @param search - Optional search term to filter results by sector, service, service category, request type, or deliverable name.
   * @returns A paginated result containing the deliverable delay request types.
   */
  async findAll(
    paginationDto: PaginationDto,
    search?: string,
  ): Promise<PaginatedResult<DeliverableDelayRequestType>> {
    const {
      page = 1,
      limit = 10,
      sort = 'createdAt',
      order = 'DESC',
    } = paginationDto;
    const skip = (page - 1) * limit;

    // Whitelist des champs triables pour éviter les injections SQL
    const sortableFields = ['createdAt', 'updatedAt', 'delayValue'];
    const sortField = sortableFields.includes(sort) ? sort : 'createdAt';

    const qb = this.deliverableDelayRequestTypeRepository
      .createQueryBuilder('rtd')
      .leftJoinAndSelect('rtd.deliverable', 'deliverable')
      .leftJoinAndSelect('rtd.requestTypeServiceCategory', 'rtsc')
      .leftJoinAndSelect('rtsc.requestType', 'rt')
      .leftJoinAndSelect('rtsc.serviceCategory', 'sc')
      .leftJoinAndSelect('sc.service', 'svc')
      .leftJoinAndSelect('svc.sector', 'sector')
      .select([
        'rtd.id',
        'rtd.createdAt',
        'deliverable.id',
        'deliverable.deliverableName',
        'rtsc.id',
        'rt.requestTypeName',
        'sc.serviceCategoryName',
        'svc.serviceName',
        'sector.sectorName',
      ])
      .skip(skip)
      .take(limit)
      .orderBy(
        `rtd.${sortField}`,
        order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC',
      );

    if (search) {
      qb.andWhere(
        `sector.sectorName ILIKE :search OR svc.serviceName ILIKE :search OR sc.serviceCategoryName ILIKE :search OR rt.requestTypeName ILIKE :search OR d.deliverableName ILIKE :search`,
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
   * Creates a new deliverable delay request type association.
   * @param dto - The data transfer object containing the details for the new association.
   * @param createdBy - The ID of the user creating the association.
   * @returns The newly created DeliverableDelayRequestType entity.
   * @throws BadRequestException if an association with the same request type and deliverable already exists.
   */
  async create(dto: CreateDeliverableDelayRequestTypeDto, createdBy: string) {
    await assertUniqueFields(
      this.deliverableDelayRequestTypeRepository,
      {
        deliverable: dto.deliverableId,
        requestTypeServiceCategory: { id: dto.requestTypeServiceCategoryId },
      },
      undefined, // id à exclure pour l'update
      `${ERROR_MESSAGES.CREATE} ${ERROR_MESSAGES.UNIQUE_CONSTRAINT}`,
    );

    const requestTypeServiceCategory =
      await this.requestTypeServiceCategoryRepository.findOne({
        where: { id: dto.requestTypeServiceCategoryId },
      });
    if (!requestTypeServiceCategory) {
      throw new BadRequestException(
        `${ERROR_MESSAGES.CREATE} ${ERROR_MESSAGES.NOT_FOUND}`,
      );
    }

    const deliverable = await this.deliverableRepository.findOne({
      where: { id: dto.deliverableId },
    });
    if (!deliverable) {
      throw new BadRequestException(
        `${ERROR_MESSAGES.CREATE} ${ERROR_MESSAGES.NOT_FOUND}`,
      );
    }

    const entity = this.deliverableDelayRequestTypeRepository.create({
      ...dto,
      requestTypeServiceCategory,
      deliverable,
      createdBy: { id: createdBy } as User,
    });

    return this.deliverableDelayRequestTypeRepository.save(entity);
  }

  /**
   * Retrieves a deliverable delay request type by its ID.
   * @param id - The ID of the deliverable delay request type to retrieve.
   * @returns The DeliverableDelayRequestType entity found.
   * @throws BadRequestException if no association is found for the given ID.
   */
  async findOne(id: string): Promise<DeliverableDelayRequestType> {
    // Utilisation du QueryBuilder pour ne sélectionner que les champs nécessaires
    const qb = this.deliverableDelayRequestTypeRepository
      .createQueryBuilder('rtd')
      .leftJoin('rtd.requestTypeServiceCategory', 'rtsc')
      .leftJoin('rtsc.requestType', 'rt')
      .leftJoin('rtsc.serviceCategory', 'sc')
      .leftJoin('sc.service', 'svc')
      .leftJoin('svc.sector', 'sector')
      .leftJoin('rtd.deliverable', 'd')
      .select([
        'sector.sectorName AS sector_name',
        'svc.serviceName AS service_name',
        'sc.serviceCategoryName AS service_category_name',
        'rt.requestTypeName AS request_type_name',
        'd.deliverableName AS deliverable_name',
      ])
      .where('rtd.id = :id', { id });

    const entity = await qb.getOne();

    if (!entity) {
      throw new BadRequestException(`${ERROR_MESSAGES.NOT_FOUND}`);
    }

    return entity;
  }

  /**
   * Updates an existing deliverable delay request type.
   * @param id - The ID of the deliverable delay request type to update.
   * @param dto - The data transfer object containing the updated details.
   * @param updatedBy - The ID of the user updating the association.
   * @returns The updated DeliverableDelayRequestType entity.
   * @throws BadRequestException if the request type service category or deliverable is not found, or if an association already exists.
   */
  async update(
    id: string,
    dto: UpdateDeliverableDelayRequestTypeDto,
    updatedBy: string,
  ): Promise<DeliverableDelayRequestType> {
    const entity = await this.findOne(id);

    if (dto.requestTypeServiceCategoryId) {
      const requestTypeServiceCategory =
        await this.requestTypeServiceCategoryRepository.findOne({
          where: { id: dto.requestTypeServiceCategoryId },
        });
      if (!requestTypeServiceCategory) {
        throw new BadRequestException(
          'Impossible de modifier : le type de demande/service est introuvable avec cet identifiant.',
        );
      }
      entity.requestTypeServiceCategory = requestTypeServiceCategory;
    }

    if (dto.deliverableId) {
      const deliverable = await this.deliverableRepository.findOne({
        where: { id: dto.deliverableId },
      });
      if (!deliverable) {
        throw new BadRequestException(
          'Impossible de modifier : le livrable est introuvable avec cet identifiant.',
        );
      }
      entity.deliverable = deliverable;
    }

    if (dto.requestTypeServiceCategoryId && dto.deliverableId) {
      const existing = await this.deliverableDelayRequestTypeRepository.findOne(
        {
          where: {
            requestTypeServiceCategory: {
              id: dto.requestTypeServiceCategoryId,
            },
            deliverable: { id: dto.deliverableId },
          },
        },
      );
      if (existing && existing.id !== id) {
        throw new BadRequestException(
          'Impossible de modifier : une association entre ce type de demande et ce livrable existe déjà.',
        );
      }
    }

    Object.assign(entity, dto);
    entity.updatedBy = { id: updatedBy } as User;

    return this.deliverableDelayRequestTypeRepository.save(entity);
  }

  /**
   * Removes a deliverable delay request type by its ID.
   * @param id - The ID of the deliverable delay request type to remove.
   * @param deletedBy - The ID of the user removing the association.
   * @throws BadRequestException if no association is found for the given ID.
   */
  async remove(id: string, deletedBy: string): Promise<void> {
    const entity = await this.findOne(id);

    entity.deletedBy = { id: deletedBy } as User;
    await this.deliverableDelayRequestTypeRepository.save(entity);

    await this.deliverableDelayRequestTypeRepository.softDelete(id);
  }
}
