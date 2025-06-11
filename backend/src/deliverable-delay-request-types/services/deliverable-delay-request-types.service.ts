import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Deliverable } from 'src/deliverables/entities/deliverable.entity';
import { RequestTypeServiceCategory } from 'src/request-type-service-categories/entities/request-type-service-category.entity';
import { Repository } from 'typeorm';
import { DeliverableDelayRequestType } from '../entities/deliverable-delay-request-type.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginatedResult } from 'src/common/interfaces/paginated-result.interface';
import { CreateDeliverableDelayRequestTypeDto } from '../dto/create-deliverable-delay-request-type.dto';

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
      .skip(skip)
      .take(limit)
      .orderBy(
        `rtd.${sortField}`,
        order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC',
      );

    if (search) {
      qb.andWhere(
        `sector.sectorName ILIKE :search
    OR svc.serviceName ILIKE :search
    OR sc.serviceCategoryName ILIKE :search
    OR rt.requestTypeName ILIKE :search
    OR d.deliverableName ILIKE :search`,
        { search: `%${search}%` },
      );
    }

    const { entities, raw } = await qb.getRawAndEntities();

    return {
      data: raw,
      meta: {
        page,
        limit,
        total: entities.length,
        totalPages: Math.ceil(entities.length / limit),
      },
    };
  }

  async create(dto: CreateDeliverableDelayRequestTypeDto, createdBy: string) {
      // Vérifie l'existence d'une association identique
      
      const existing = await this.deliverableDelayRequestTypeRepository.findOne({
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
}
