import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Provider } from '../../providers/entities/provider.entity';
import { ServiceCategory } from '../../service-categories/entities/service-category.entity';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { ProviderServiceCategory } from '../entities/provider-service-category.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';
import { CreateProviderServiceCategoryDto } from '../dto/create-provider-service-category.dto';
import { User } from '../../users/entities/user.entity';
import { UpdateProviderServiceCategoryDto } from '../dto/update-provider-service-category.dto';

@Injectable()
export class ProviderServiceCategoriesService {
  /**
   * Service pour gérer les catégories de services fournisseurs.
   * Permet de créer, lire, mettre à jour et supprimer des catégories de services.
   *
   * @param providerRepository - Repository pour les entités Provider.
   * @param serviceCategoryRepository - Repository pour les entités ServiceCategory.
   * @param providerServiceCategoryRepository - Repository pour les entités ProviderServiceCategory.
   */
  constructor(
    @InjectRepository(Provider)
    private readonly providerRepository: Repository<Provider>,
    @InjectRepository(ServiceCategory)
    private readonly serviceCategoryRepository: Repository<ServiceCategory>,
    @InjectRepository(ProviderServiceCategory)
    private readonly providerServiceCategoryRepository: Repository<ProviderServiceCategory>,
  ) {}

  /**
   * Récupère une liste paginée de catégories de services fournisseurs.
   * @param paginationDto - DTO pour la pagination.
   * @param search - Termes de recherche optionnels pour filtrer les résultats par nom de catégorie de service.
   * @returns Un objet contenant les catégories de services et les métadonnées de pagination.
   */
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

    const qb = this.providerServiceCategoryRepository
      .createQueryBuilder('psc')
      .leftJoinAndSelect('psc.provider', 'provider')
      .leftJoinAndSelect('psc.serviceCategory', 'serviceCategory')
      .leftJoinAndSelect('serviceCategory.service', 'service')
      .leftJoinAndSelect('service.sector', 'sector')
      .leftJoinAndSelect('psc.createdBy', 'createdBy')
      .select([
        'psc.id',
        'psc.createdAt',
        'psc.updatedAt',
        'provider.id',
        'provider.providerName',
        'provider.providerCode',
        'serviceCategory.id',
        'serviceCategory.serviceCategoryName',
        'service.id',
        'service.serviceName',
        'sector.id',
        'sector.sectorName',
        'createdBy.id',
        'createdBy.firstName',
        'createdBy.lastName',
      ])
      .skip(skip)
      .take(limit)
      .orderBy(`psc.${sort}`, order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC');

    if (search) {
      qb.andWhere('serviceCategory.serviceCategoryName ILIKE :search', {
        search: `%${search}%`,
      });
    }

    const [providerServiceCategories, total] = await qb.getManyAndCount();

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

  /**
   * Crée une nouvelle catégorie de service fournisseur.
   * @param createProviderServiceCategoryDto - DTO pour la création d'une catégorie de service fournisseur.
   * @param createdBy - ID de l'utilisateur qui crée la catégorie.
   * @returns La catégorie de service créée.
   * @throws BadRequestException si une association entre le fournisseur et la catégorie de service existe déjà,
   * ou si le fournisseur ou la catégorie de service n'existe pas.
   */
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
        'Impossible de créer : une association entre ce fournisseur et cette catégorie de service existe déjà.',
      );
    }

    const provider = await this.providerRepository.findOne({
      where: { id: createProviderServiceCategoryDto.providerId },
    });

    if (!provider) {
      throw new BadRequestException(
        'Impossible de créer : fournisseur introuvable avec cet identifiant.',
      );
    }

    const serviceCategory = await this.serviceCategoryRepository.findOne({
      where: { id: createProviderServiceCategoryDto.serviceCategoryId },
    });

    if (!serviceCategory) {
      throw new BadRequestException(
        'Impossible de créer : catégorie de service introuvable avec cet identifiant.',
      );
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

  /**
   * Récupère une catégorie de service fournisseur par son ID.
   * @param id - ID de la catégorie de service à récupérer.
   * @returns La catégorie de service trouvée.
   * @throws BadRequestException si aucune catégorie de service n'est trouvée avec cet ID.
   */
  async findOne(id: string): Promise<ProviderServiceCategory> {
    const qb = this.providerServiceCategoryRepository
      .createQueryBuilder('psc')
      .leftJoinAndSelect('psc.provider', 'provider')
      .leftJoinAndSelect('psc.serviceCategory', 'serviceCategory')
      .leftJoinAndSelect('serviceCategory.service', 'service')
      .leftJoinAndSelect('service.sector', 'sector')
      .leftJoinAndSelect('psc.createdBy', 'createdBy')
      .select([
        'psc.id',
        'psc.createdAt',
        'psc.updatedAt',
        'provider.id',
        'provider.providerName',
        'provider.providerCode',
        'serviceCategory.id',
        'serviceCategory.serviceCategoryName',
        'service.id',
        'service.serviceName',
        'sector.id',
        'sector.sectorName',
        'createdBy.id',
        'createdBy.firstName',
        'createdBy.lastName',
      ])
      .where('psc.id = :id', { id });

    const providerServiceCategory = await qb.getOne();

    if (!providerServiceCategory) {
      throw new BadRequestException(
        'Aucune association fournisseur/catégorie de service trouvée avec cet identifiant.',
      );
    }

    return providerServiceCategory;
  }

  /**
   * Met à jour une catégorie de service fournisseur.
   * @param id - ID de la catégorie de service à mettre à jour.
   * @param updateProviderServiceCategoryDto - DTO contenant les détails mis à jour.
   * @param updatedBy - ID de l'utilisateur qui met à jour la catégorie.
   * @returns La catégorie de service mise à jour.
   * @throws BadRequestException si une association identique existe déjà.
   */
  async update(
    id: string,
    updateProviderServiceCategoryDto: UpdateProviderServiceCategoryDto,
    updatedBy: string,
  ): Promise<ProviderServiceCategory> {
    const providerServiceCategory = await this.findOne(id);

    // Vérification de doublon (autre que l'élément courant)
    if (
      updateProviderServiceCategoryDto.providerId &&
      updateProviderServiceCategoryDto.serviceCategoryId
    ) {
      const existing = await this.providerServiceCategoryRepository.findOne({
        where: {
          provider: { id: updateProviderServiceCategoryDto.providerId },
          serviceCategory: {
            id: updateProviderServiceCategoryDto.serviceCategoryId,
          },
        },
      });
      if (existing && existing.id !== id) {
        throw new BadRequestException(
          'Impossible de modifier : une association entre ce fournisseur et cette catégorie de service existe déjà.',
        );
      }
    }

    if (updateProviderServiceCategoryDto.serviceCategoryId) {
      const serviceCategory = await this.serviceCategoryRepository.findOne({
        where: { id: updateProviderServiceCategoryDto.serviceCategoryId },
      });

      if (!serviceCategory) {
        throw new BadRequestException(
          'Impossible de modifier : catégorie de service introuvable avec cet identifiant.',
        );
      }
      providerServiceCategory.serviceCategory = serviceCategory;
    }

    if (updateProviderServiceCategoryDto.providerId) {
      const provider = await this.providerRepository.findOne({
        where: { id: updateProviderServiceCategoryDto.providerId },
      });

      if (!provider) {
        throw new BadRequestException(
          'Impossible de modifier : fournisseur introuvable avec cet identifiant.',
        );
      }
      providerServiceCategory.provider = provider;
    }

    Object.assign(providerServiceCategory, updateProviderServiceCategoryDto);
    providerServiceCategory.updatedBy = { id: updatedBy } as User;

    return this.providerServiceCategoryRepository.save(providerServiceCategory);
  }

  /**
   * Supprime une catégorie de service fournisseur.
   * @param id - ID de la catégorie de service à supprimer.
   * @param deletedBy - ID de l'utilisateur qui supprime la catégorie.
   */
  async remove(id: string, deletedBy: string): Promise<void> {
    const providerServiceCategory = await this.findOne(id);

    providerServiceCategory.deletedBy = { id: deletedBy } as User;
    await this.providerServiceCategoryRepository.save(providerServiceCategory);

    await this.providerServiceCategoryRepository.softDelete(id);
  }
}
