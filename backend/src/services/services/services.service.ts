import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from '../entities/service.entity';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { Sector } from '../../sectors/entities/sectors.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';
import { CreateServiceDto } from '../dto/create-service.dto';
import { User } from '../../users/entities/user.entity';
import { UpdateServiceDto } from '../dto/update-service.dto';
import { ServiceCategory } from '../../service-categories/entities/service-category.entity';

@Injectable()
export class ServicesService {
  /**
   * Service pour gérer les opérations liées aux services.
   * @param serviceRepository - Repository pour l'entité Service.
   * @param sectorRepository - Repository pour l'entité Sector.
   */
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    @InjectRepository(Sector)
    private readonly sectorRepository: Repository<Sector>,
  ) {}

  /**
   * Récupère une liste paginée de services avec une option de recherche.
   * @param paginationDto - DTO pour la pagination et le tri.
   * @param search - Terme de recherche optionnel pour filtrer les services par nom.
   * @returns Un objet contenant les services et les métadonnées de pagination.
   */
  async findAll(
    paginationDto: PaginationDto,
    search?: string,
  ): Promise<PaginatedResult<Service>> {
    const {
      page = 1,
      limit = 10,
      sort = 'createdAt',
      order = 'DESC',
    } = paginationDto;
    const skip = (page - 1) * limit;

    // Sinon, tri classique
    const whereCondition: FindOptionsWhere<Service> = {};
    if (search) {
      whereCondition.serviceName = ILike(`%${search}%`);
    }

    const orderBy: Record<string, 'ASC' | 'DESC'> = {};
    if (sort) {
      orderBy[sort] = order?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    }

    const [services, total] = await this.serviceRepository.findAndCount({
      where: whereCondition,
      relations: ['sector', 'createdBy'],
      skip,
      take: limit,
      order: orderBy,
    });

    return {
      data: services,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Récupère un service par son ID.
   * @param id - L'ID du service à récupérer.
   * @returns Le service correspondant à l'ID fourni.
   * @throws BadRequestException si le service n'est pas trouvé.
   */
  async findOne(id: string): Promise<Service> {
    const service = await this.serviceRepository.findOne({
      where: { id },
      relations: ['sector', 'createdBy', 'serviceCategories'],
    });

    if (!service) {
      throw new BadRequestException(
        'Impossible de trouver : aucun service trouvé avec cet identifiant.',
      );
    }

    return service;
  }

  /**
   * Récupère la liste des services avec uniquement les ID et noms.
   * @returns Un tableau de services avec ID et nom.
   */
  async getServicesList(): Promise<Service[]> {
    return this.serviceRepository.find({
      select: ['id', 'serviceName'],
      order: { serviceName: 'ASC' },
    });
  }

  /**
   * Récupère les catégories de service associées à un service spécifique.
   * @param id - L'ID du service pour lequel récupérer les catégories.
   * @returns Un tableau de catégories de service associées au service.
   * @throws BadRequestException si aucune catégorie de service n'est associée au service.
   */
  async getServiceCategoriesByServiceId(
    id: string,
  ): Promise<ServiceCategory[]> {
    const service = await this.serviceRepository.findOne({
      where: { id },
      relations: ['serviceCategories'],
    });

    if (!service?.serviceCategories) {
      throw new BadRequestException(
        'Impossible de trouver : aucune catégorie de service associée à ce service.',
      );
    }

    return service.serviceCategories;
  }

  /**
   * Crée un nouveau service.
   * @param createServiceDto - DTO pour la création d'un service.
   * @param createdBy - ID de l'utilisateur qui crée le service.
   * @returns Le service créé.
   * @throws BadRequestException si un service avec le même nom existe déjà dans le secteur spécifié.
   */
  async create(createServiceDto: CreateServiceDto, createdBy: string) {
    const existingService = await this.serviceRepository.findOne({
      where: {
        serviceName: createServiceDto.serviceName,
        sector: { id: createServiceDto.sectorId },
      },
      relations: ['sector'],
    });

    if (existingService) {
      throw new BadRequestException(
        'Impossible de créer : un service avec ce nom existe déjà dans ce secteur.',
      );
    }

    // Récupère l'entité secteur
    const sector = await this.sectorRepository.findOne({
      where: { id: createServiceDto.sectorId },
    });
    if (!sector) {
      throw new BadRequestException(
        'Impossible de créer : secteur introuvable avec cet identifiant.',
      );
    }

    const service = this.serviceRepository.create({
      ...createServiceDto,
      sector,
      createdBy: { id: createdBy } as User,
    });

    return this.serviceRepository.save(service);
  }

  /**
   * Met à jour un service existant.
   * @param id - L'ID du service à mettre à jour.
   * @param updateServiceDto - DTO contenant les nouvelles informations du service.
   * @param updatedBy - ID de l'utilisateur qui met à jour le service.
   * @returns Le service mis à jour.
   * @throws BadRequestException si le service n'est pas trouvé ou si un service avec le même nom existe déjà dans le secteur spécifié.
   */
  async update(
    id: string,
    updateServiceDto: UpdateServiceDto,
    updatedBy: string,
  ): Promise<Service> {
    const service = await this.serviceRepository.findOne({
      where: { id },
      relations: ['sector', 'createdBy'],
    });

    if (!service) {
      throw new BadRequestException(
        'Impossible de modifier : aucun service trouvé avec cet identifiant.',
      );
    }

    if (
      updateServiceDto.serviceName &&
      updateServiceDto.sectorId &&
      (updateServiceDto.serviceName !== service.serviceName ||
        updateServiceDto.sectorId !== service.sector?.id)
    ) {
      const existingService = await this.serviceRepository.findOne({
        where: {
          serviceName: updateServiceDto.serviceName,
          sector: { id: updateServiceDto.sectorId },
        },
        relations: ['sector'],
      });
      if (existingService) {
        throw new BadRequestException(
          'Impossible de modifier : un service avec ce nom existe déjà dans ce secteur.',
        );
      }
    }

    if (updateServiceDto.sectorId) {
      const newSector = await this.sectorRepository.findOne({
        where: { id: updateServiceDto.sectorId },
      });
      if (!newSector) {
        throw new BadRequestException(
          'Impossible de modifier : secteur introuvable avec cet identifiant.',
        );
      }
      service.sector = newSector;
    }

    Object.assign(service, updateServiceDto, {
      updatedBy: { id: updatedBy } as User,
    });

    return this.serviceRepository.save(service);
  }

  /**
   * Supprime un service par son ID.
   * @param id - L'ID du service à supprimer.
   * @param deletedBy - ID de l'utilisateur qui supprime le service.
   * @throws BadRequestException si le service n'est pas trouvé ou s'il est lié à des catégories de services.
   */
  async remove(id: string, deletedBy: string): Promise<void> {
    const service = await this.serviceRepository.findOne({
      where: { id },
      relations: ['serviceCategories', 'deletedBy'],
    });

    if (!service) {
      throw new BadRequestException(
        'Impossible de supprimer : aucun service trouvé avec cet identifiant.',
      );
    }

    if (service.serviceCategories && service.serviceCategories.length > 0) {
      throw new BadRequestException(
        'Impossible de supprimer : ce service possède des catégories de services associées.',
      );
    }

    service.deletedBy = { id: deletedBy } as User;
    await this.serviceRepository.save(service);

    await this.serviceRepository.softDelete(id);
  }
}
