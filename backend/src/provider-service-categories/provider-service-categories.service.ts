import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Provider } from '../providers/entities/provider.entity';
import { ServiceCategory } from '../service-categories/entities/service-category.entity';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { ProviderServiceCategory } from './entities/provider-service-category.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResult } from '../common/interfaces/paginated-result.interface';
import { CreateProviderServiceCategoryDto } from './dto/create-provider-service-category.dto';
import { User } from '../users/entities/user.entity';
import { UpdateProviderServiceCategoryDto } from './dto/update-provider-service-category.dto';

@Injectable()
export class ProviderServiceCategoriesService {
  constructor(
    @InjectRepository(Provider)
    private readonly providerRepository: Repository<Provider>,
    @InjectRepository(ServiceCategory)
    private readonly serviceCategoryRepository: Repository<ServiceCategory>,
    @InjectRepository(ProviderServiceCategory)
    private readonly providerServiceCategoryRepository: Repository<ProviderServiceCategory>,
  ) {}

  async findAll(
    paginationDto: PaginationDto,
    search?: string,
  ): Promise<PaginatedResult<ProviderServiceCategory>> {
    const {
      page = 1,
      limit = 10,
      sort = 'createdAt',
      order = 'DESC',
    } = paginationDto;
    const skip = (page - 1) * limit;

    // Sinon, tri classique
    const whereCondition: FindOptionsWhere<ProviderServiceCategory> = {};
    if (search) {
      whereCondition.serviceCategory = {
        serviceCategoryName: ILike(`%${search}%`),
      } as any;
    }
    const orderBy: Record<string, 'ASC' | 'DESC'> = {};
    if (sort) {
      orderBy[sort] = order?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    }

    const [providerServiceCategories, total] =
      await this.providerServiceCategoryRepository.findAndCount({
        where: whereCondition,
        relations: [
          'provider',
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
      data: providerServiceCategories,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async create(
    createProviderServiceCategoryDto: CreateProviderServiceCategoryDto,
    createdBy: string,
  ) {
    const existing = await this.providerServiceCategoryRepository.findOne({
      where: {
        serviceCategory: {
          id: createProviderServiceCategoryDto.serviceCategoryId,
        },
        provider: { id: createProviderServiceCategoryDto.providerId },
      },
      relations: ['provider', 'serviceCategory'],
    });

    if (existing) {
      throw new BadRequestException(
        'Un fournisseur avec la catégorie de service existe déjà',
      );
    }

    const provider = await this.providerRepository.findOne({
      where: { id: createProviderServiceCategoryDto.providerId },
    });

    if (!provider) {
      throw new BadRequestException('Fournisseur introuvable');
    }

    const serviceCategory = await this.serviceCategoryRepository.findOne({
      where: { id: createProviderServiceCategoryDto.serviceCategoryId },
    });

    if (!serviceCategory) {
      throw new BadRequestException('Catégorie de service introuvable');
    }

    const providerServiceCategory =
      this.providerServiceCategoryRepository.create({
        ...createProviderServiceCategoryDto,
        provider,
        serviceCategory,
        createdBy: { id: createdBy } as User,
      });

    return this.providerServiceCategoryRepository.save(providerServiceCategory);
  }

  async findOne(id: string): Promise<ProviderServiceCategory> {
    const providerServiceCategory =
      await this.providerServiceCategoryRepository.findOne({
        where: { id },
        relations: [
          'provider',
          'serviceCategory',
          'serviceCategory.service',
          'serviceCategory.service.sector',
          'createdBy',
        ],
      });

    if (!providerServiceCategory) {
      throw new BadRequestException(
        'Fournisseur de la catégorie de service est introuvable',
      );
    }

    return providerServiceCategory;
  }

  async update(
    id: string,
    updateProviderServiceCategoryDto: UpdateProviderServiceCategoryDto,
    updatedBy: string,
  ): Promise<ProviderServiceCategory> {
    const providerServiceCategory = await this.findOne(id);

    if (updateProviderServiceCategoryDto.serviceCategoryId) {
      const serviceCategory = await this.serviceCategoryRepository.findOne({
        where: { id: updateProviderServiceCategoryDto.serviceCategoryId },
      });

      if (!serviceCategory) {
        throw new BadRequestException('Catégorie de service introuvable');
      }
      providerServiceCategory.serviceCategory = serviceCategory;
    }

    if (updateProviderServiceCategoryDto.providerId) {
      const provider = await this.providerRepository.findOne({
        where: { id: updateProviderServiceCategoryDto.providerId },
      });

      if (!provider) {
        throw new BadRequestException('Fournisseur introuvable');
      }
      providerServiceCategory.provider = provider;
    }

    Object.assign(providerServiceCategory, updateProviderServiceCategoryDto);
    providerServiceCategory.updatedBy = { id: updatedBy } as User;

    return this.providerServiceCategoryRepository.save(providerServiceCategory);
  }

  async remove(id: string, deletedBy: string): Promise<void> {
    const providerServiceCategory = await this.findOne(id);

    providerServiceCategory.deletedBy = { id: deletedBy } as User;
    await this.providerServiceCategoryRepository.save(providerServiceCategory);

    await this.providerServiceCategoryRepository.softDelete(id);
  }
}
