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

@Injectable()
export class RequestTypeServiceCategoriesService {
  constructor(
    @InjectRepository(RequestType)
    private readonly requestTypeRepository: Repository<RequestType>,
    @InjectRepository(ServiceCategory)
    private readonly serviceCategoryRepository: Repository<ServiceCategory>,
    @InjectRepository(RequestTypeServiceCategory)
    private readonly requestTypeServiceCategoryRepository: Repository<RequestTypeServiceCategory>,
  ) {}

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

    const [items, total] = await this.requestTypeServiceCategoryRepository.findAndCount({
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

  async create(
    dto: CreateRequestTypeServiceCategoryDto,
    createdBy: string,
  ) {
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

  async update(
    id: string,
    dto: CreateRequestTypeServiceCategoryDto,
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

  async remove(id: string, deletedBy: string): Promise<void> {
    const entity = await this.findOne(id);

    entity.deletedBy = { id: deletedBy } as User;
    await this.requestTypeServiceCategoryRepository.save(entity);

    await this.requestTypeServiceCategoryRepository.softDelete(id);
  }
}