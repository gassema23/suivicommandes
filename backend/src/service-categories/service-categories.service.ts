import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from '../services/entities/service.entity';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { ServiceCategory } from './entities/service-category.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResult } from '../common/interfaces/paginated-result.interface';
import { CreateServiceCategoryDto } from './dto/create-service-category.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ServiceCategoriesService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    @InjectRepository(ServiceCategory)
    private readonly serviceCategoryRepository: Repository<ServiceCategory>,
  ) {}

  async findAll(
    paginationDto: PaginationDto,
    search?: string,
  ): Promise<PaginatedResult<ServiceCategory>> {
    const {
      page = 1,
      limit = 10,
      sort = 'createdAt',
      order = 'DESC',
    } = paginationDto;
    const skip = (page - 1) * limit;

    // Sinon, tri classique
    const whereCondition: FindOptionsWhere<ServiceCategory> = {};
    if (search) {
      whereCondition.serviceCategoryName = ILike(`%${search}%`);
    }

    const orderBy: Record<string, 'ASC' | 'DESC'> = {};
    if (sort) {
      orderBy[sort] = order?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    }

    const [serviceCategories, total] =
      await this.serviceCategoryRepository.findAndCount({
        where: whereCondition,
        relations: ['service', 'service.sector', 'createdBy'],
        skip,
        take: limit,
        order: orderBy,
      });

    return {
      data: serviceCategories,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async create(
    createServiceCategoryDto: CreateServiceCategoryDto,
    createdBy: string,
  ) {
    const existing = await this.serviceCategoryRepository.findOne({
      where: {
        serviceCategoryName: createServiceCategoryDto.serviceCategoryName,
        service: { id: createServiceCategoryDto.serviceId },
      },
      relations: ['service'],
    });

    if (existing) {
      throw new BadRequestException(
        'Une catégorie de service avec ce nom existe déjà',
      );
    }

    const service = await this.serviceRepository.findOne({
      where: { id: createServiceCategoryDto.serviceId },
    });

    if (!service) {
      throw new BadRequestException('Service introuvable');
    }

    const serviceCategory = this.serviceCategoryRepository.create({
      ...createServiceCategoryDto,
      service,
      createdBy: { id: createdBy } as User,
    });

    return this.serviceCategoryRepository.save(serviceCategory);
  }

  async findOne(id: string): Promise<ServiceCategory> {
    const serviceCategory = await this.serviceCategoryRepository.findOne({
      where: { id },
      relations: ['service', 'service.sector', 'createdBy'],
    });

    if (!serviceCategory) {
      throw new BadRequestException('Catégorie de service introuvable');
    }

    return serviceCategory;
  }

  async update(
    id: string,
    updateServiceCategoryDto: CreateServiceCategoryDto,
    updatedBy: string,
  ): Promise<ServiceCategory> {
    const serviceCategory = await this.findOne(id);

    if (updateServiceCategoryDto.serviceId) {
      const service = await this.serviceRepository.findOne({
        where: { id: updateServiceCategoryDto.serviceId },
      });

      if (!service) {
        throw new BadRequestException('Service introuvable');
      }
      serviceCategory.service = service;
    }

    Object.assign(serviceCategory, updateServiceCategoryDto);
    serviceCategory.updatedBy = { id: updatedBy } as User;

    return this.serviceCategoryRepository.save(serviceCategory);
  }

  async remove(id: string, deletedBy: string): Promise<void> {
    const serviceCategory = await this.serviceCategoryRepository.findOne({
      where: { id },
      relations: ['providerServiceCategories', 'deletedBy'],
    });

    if (!serviceCategory) {
      throw new BadRequestException('Client non trouvé');
    }
    if (
      serviceCategory.providerServiceCategories &&
      serviceCategory.providerServiceCategories.length > 0
    ) {
      throw new BadRequestException(
        'Impossible de supprimer cette catégorie de service car elle est liée à des fournisseurs',
      );
    }

    serviceCategory.deletedBy = { id: deletedBy } as User;
    await this.serviceCategoryRepository.save(serviceCategory);
    await this.serviceCategoryRepository.softDelete(id);
  }
}
