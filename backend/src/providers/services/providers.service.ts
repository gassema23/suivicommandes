import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Provider } from '../entities/provider.entity';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';
import { CreateProviderDto } from '../dto/create-provider.dto';
import { User } from '../../users/entities/user.entity';
import { UpdateProviderDto } from '../dto/update-provider.dto';

@Injectable()
export class ProvidersService {
  /**
   * Service pour gérer les fournisseurs, y compris les opérations CRUD et la pagination.
   * @param providerRepository - Repository pour l'entité Provider.
   */
  constructor(
    @InjectRepository(Provider)
    private readonly providerRepository: Repository<Provider>,
  ) {}

  /**
   * Récupère une liste paginée de fournisseurs avec une option de recherche.
   * @param paginationDto - DTO pour la pagination et le tri.
   * @param search - Terme de recherche optionnel pour filtrer les fournisseurs par nom.
   * @returns Un objet contenant les fournisseurs et les métadonnées de pagination.
   */
  async findAll(
    paginationDto: PaginationDto,
    search?: string,
  ): Promise<PaginatedResult<Provider>> {
    const {
      page = 1,
      limit = 10,
      sort = 'createdAt',
      order = 'DESC',
    } = paginationDto;

    const skip = (page - 1) * limit;

    // Sinon, tri classique
    const whereCondition: FindOptionsWhere<Provider> = {};
    if (search) {
      whereCondition.providerName = ILike(`%${search}%`);
    }

    const orderBy: Record<string, 'ASC' | 'DESC'> = {};
    if (sort) {
      orderBy[sort] = order?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    }

    const [providers, total] = await this.providerRepository.findAndCount({
      where: whereCondition,
      relations: ['createdBy'],
      skip,
      take: limit,
      order: orderBy,
    });

    return {
      data: providers,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Crée un nouveau fournisseur.
   * @param createProviderDto - DTO pour la création d'un fournisseur.
   * @param createdBy - ID de l'utilisateur qui crée le fournisseur.
   * @returns Le fournisseur créé.
   */
  async create(createProviderDto: CreateProviderDto, createdBy: string) {
    const existingProvider = await this.providerRepository.findOne({
      where: {
        providerName: createProviderDto.providerName,
        providerCode: createProviderDto.providerCode,
      },
    });

    if (existingProvider) {
      throw new BadRequestException(
        'Impossible de créer : un fournisseur avec ce nom et ce code existe déjà.',
      );
    }

    const provider = this.providerRepository.create({
      ...createProviderDto,
      createdBy: { id: createdBy } as User,
    });

    return this.providerRepository.save(provider);
  }

  /**
   * Récupère un fournisseur par son ID.
   * @param id - ID du fournisseur à récupérer.
   * @returns Le fournisseur correspondant à l'ID.
   * @throws BadRequestException si le fournisseur n'est pas trouvé.
   */
  async findOne(id: string): Promise<Provider> {
    const provider = await this.providerRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    });

    if (!provider) {
      throw new BadRequestException(
        'Aucun fournisseur trouvé avec cet identifiant.',
      );
    }

    return provider;
  }

  /**
   * Récupère la liste des fournisseurs avec des informations minimales.
   * @returns Un tableau de fournisseurs avec ID, nom et code.
   */
  async providersList(): Promise<Provider[]> {
    return this.providerRepository.find({
      select: ['id', 'providerName', 'providerCode'],
      order: { providerName: 'ASC' },
    });
  }

  /**
   * Met à jour un fournisseur.
   * @param id - ID du fournisseur à mettre à jour.
   * @param updateProviderDto - DTO contenant les données de mise à jour.
   * @param updatedBy - ID de l'utilisateur qui met à jour le fournisseur.
   * @returns Le fournisseur mis à jour.
   * @throws BadRequestException si le fournisseur n'est pas trouvé ou si un fournisseur avec le même nom existe déjà.
   */
  async update(
    id: string,
    updateProviderDto: UpdateProviderDto,
    updatedBy: string,
  ): Promise<Provider> {
    const provider = await this.findOne(id);
    if (
      updateProviderDto.providerName &&
      updateProviderDto.providerName !== provider.providerName
    ) {
      const existingProvider = await this.providerRepository.findOne({
        where: {
          providerName: updateProviderDto.providerName,
          providerCode: updateProviderDto.providerCode,
        },
      });
      if (existingProvider) {
        throw new BadRequestException(
          'Impossible de modifier : un fournisseur avec ce nom et ce code existe déjà.',
        );
      }
    }
    Object.assign(provider, updateProviderDto, {
      updatedBy: { id: updatedBy } as User,
    });

    return this.providerRepository.save(provider);
  }

  /**
   * Supprime un fournisseur par son ID.
   * @param id - ID du fournisseur à supprimer.
   * @param deletedBy - ID de l'utilisateur qui supprime le fournisseur.
   * @throws BadRequestException si le fournisseur n'est pas trouvé ou s'il est associé à des catégories de services.
   */
  async remove(id: string, deletedBy: string): Promise<void> {
    const provider = await this.providerRepository.findOne({
      where: { id },
      relations: ['providerServiceCategories', 'deletedBy'],
    });

    if (!provider) {
      throw new BadRequestException(
        'Aucun fournisseur trouvé avec cet identifiant.',
      );
    }

    if (
      provider.providerServiceCategories &&
      provider.providerServiceCategories.length > 0
    ) {
      throw new BadRequestException(
        'Impossible de supprimer le fournisseur : il est associé à des catégories de services.',
      );
    }

    provider.deletedBy = { id: deletedBy } as User;
    await this.providerRepository.save(provider);

    await this.providerRepository.softDelete(id);
  }
}
