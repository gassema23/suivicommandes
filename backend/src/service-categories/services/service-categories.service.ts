import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from '../../services/entities/service.entity';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { ServiceCategory } from '../entities/service-category.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';
import { CreateServiceCategoryDto } from '../dto/create-service-category.dto';
import { User } from '../../users/entities/user.entity';
import { UpdateServiceCategoryDto } from '../dto/update-service-category.dto';
import { RequestType } from 'src/request-types/entities/request-type.entity';
import { RequestTypeServiceCategory } from 'src/request-type-service-categories/entities/request-type-service-category.entity';

@Injectable()
export class ServiceCategoriesService {
  /**
   * Service pour gérer les catégories de service.
   * Permet de créer, lire, mettre à jour et supprimer des catégories de service.
   *
   * @param serviceRepository - Repository pour accéder aux données des services.
   * @param serviceCategoryRepository - Repository pour accéder aux données des catégories de service.
   */
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    @InjectRepository(ServiceCategory)
    private readonly serviceCategoryRepository: Repository<ServiceCategory>,
  ) {}

  /**
   * Récupère toutes les catégories de service avec pagination et recherche.
   * @param paginationDto - DTO pour la pagination.
   * @param search - Termes de recherche optionnels.
   * @returns Un objet contenant les catégories de service et les métadonnées de pagination.
   */
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

  /**
   * Crée une nouvelle catégorie de service.
   * @param createServiceCategoryDto - DTO contenant les informations de la catégorie de service à créer.
   * @param createdBy - ID de l'utilisateur qui crée la catégorie de service.
   * @returns La catégorie de service créée.
   * @throws BadRequestException si une catégorie de service avec le même nom existe déjà pour le service spécifié.
   */
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
        'Impossible de créer : une catégorie de service avec ce nom existe déjà pour ce service.',
      );
    }

    const service = await this.serviceRepository.findOne({
      where: { id: createServiceCategoryDto.serviceId },
    });

    if (!service) {
      throw new BadRequestException(
        'Impossible de créer : service introuvable avec cet identifiant.',
      );
    }

    const serviceCategory = this.serviceCategoryRepository.create({
      ...createServiceCategoryDto,
      service,
      createdBy: { id: createdBy } as User,
    });

    return this.serviceCategoryRepository.save(serviceCategory);
  }

  /**
   * Récupère une catégorie de service par son ID.
   * @param id - ID de la catégorie de service à récupérer.
   * @returns La catégorie de service trouvée.
   * @throws BadRequestException si aucune catégorie de service n'est trouvée avec cet ID.
   */
  async findOne(id: string): Promise<ServiceCategory> {
    const serviceCategory = await this.serviceCategoryRepository.findOne({
      where: { id },
      relations: ['service', 'service.sector', 'createdBy'],
    });

    if (!serviceCategory) {
      throw new BadRequestException(
        'Impossible de trouver : aucune catégorie de service trouvée avec cet identifiant.',
      );
    }

    return serviceCategory;
  }

  async getRequestTypeServiceCategory(id: string): Promise<RequestTypeServiceCategory[]> {
    const serviceCategory = await this.serviceCategoryRepository.findOne({
      where: { id },
      relations: [
        'requestTypeServiceCategories',
        'requestTypeServiceCategories.requestType',
      ],
    });

    if (!serviceCategory) {
      throw new BadRequestException(
        'Impossible de trouver : aucun type de demande trouvée pour cette catégorie de service.',
      );
    }

    return serviceCategory.requestTypeServiceCategories;
  }

  /**
   * Met à jour une catégorie de service.
   * @param id - ID de la catégorie de service à mettre à jour.
   * @param updateServiceCategoryDto - DTO contenant les informations mises à jour.
   * @param updatedBy - ID de l'utilisateur qui met à jour la catégorie de service.
   * @returns La catégorie de service mise à jour.
   */
  async update(
    id: string,
    updateServiceCategoryDto: UpdateServiceCategoryDto,
    updatedBy: string,
  ): Promise<ServiceCategory> {
    const serviceCategory = await this.findOne(id);

    if (updateServiceCategoryDto.serviceId) {
      const service = await this.serviceRepository.findOne({
        where: { id: updateServiceCategoryDto.serviceId },
      });

      if (!service) {
        throw new BadRequestException(
          'Impossible de modifier : service introuvable avec cet identifiant.',
        );
      }
      serviceCategory.service = service;
    }

    Object.assign(serviceCategory, updateServiceCategoryDto);
    serviceCategory.updatedBy = { id: updatedBy } as User;

    return this.serviceCategoryRepository.save(serviceCategory);
  }

  /**
   * Supprime une catégorie de service.
   * @param id - ID de la catégorie de service à supprimer.
   * @param deletedBy - ID de l'utilisateur qui supprime la catégorie de service.
   * @throws BadRequestException si la catégorie de service n'existe pas ou est liée à des fournisseurs.
   */
  async remove(id: string, deletedBy: string): Promise<void> {
    const serviceCategory = await this.serviceCategoryRepository.findOne({
      where: { id },
      relations: ['providerServiceCategories', 'deletedBy'],
    });

    if (!serviceCategory) {
      throw new BadRequestException(
        'Impossible de supprimer : aucune catégorie de service trouvée avec cet identifiant.',
      );
    }
    if (
      serviceCategory.providerServiceCategories &&
      serviceCategory.providerServiceCategories.length > 0
    ) {
      throw new BadRequestException(
        'Impossible de supprimer : cette catégorie de service est liée à des fournisseurs.',
      );
    }

    serviceCategory.deletedBy = { id: deletedBy } as User;
    await this.serviceCategoryRepository.save(serviceCategory);
    await this.serviceCategoryRepository.softDelete(id);
  }
}
