import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRequestTypeDto } from '../dto/create-request-type.dto';
import { User } from '../../users/entities/user.entity';
import { RequestType } from '../entities/request-type.entity';
import { UpdateRequestTypeDto } from '../dto/update-request-type.dto';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';

@Injectable()
export class RequestTypesService {
  /**
   * Service pour gérer les types de demandes.
   * Permet de créer, lire, mettre à jour et supprimer des types de demandes.
   * @Injectable()
   * @param requestTypeRepository - Le repository TypeORM pour l'entité RequestType.
   */
  constructor(
    @InjectRepository(RequestType)
    private readonly requestTypeRepository: Repository<RequestType>,
  ) {}

  /**
   * Récupère tous les types de demandes avec pagination et recherche.
   * @param paginationDto - DTO de pagination contenant les paramètres de page, limite, tri et ordre.
   * @param search - Chaîne de recherche optionnelle pour filtrer les types de demandes par nom.
   * @returns Un objet PaginatedResult contenant les types de demandes et les métadonnées de pagination.
   */
  async findAll(
    paginationDto: PaginationDto,
    search?: string,
  ): Promise<PaginatedResult<RequestType>> {
    const {
      page = 1,
      limit = 10,
      sort = 'createdAt',
      order = 'DESC',
    } = paginationDto;

    const skip = (page - 1) * limit;

    // Sinon, tri classique
    const whereCondition: FindOptionsWhere<RequestType> = {};
    if (search) {
      whereCondition.requestTypeName = ILike(`%${search}%`);
    }

    const orderBy: Record<string, 'ASC' | 'DESC'> = {};
    if (sort) {
      orderBy[sort] = order?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    }

    const [requestTypes, total] = await this.requestTypeRepository.findAndCount(
      {
        where: whereCondition,
        relations: ['createdBy'],
        skip,
        take: limit,
        order: orderBy,
      },
    );

    return {
      data: requestTypes,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Crée un nouveau type de demande.
   * @param createRequestTypeDto - DTO contenant les informations du type de demande à créer.
   * @param createdBy - ID de l'utilisateur créant le type de demande.
   * @returns Le type de demande créé.
   */
  async create(createRequestTypeDto: CreateRequestTypeDto, createdBy: string) {
    const existingRequestType = await this.requestTypeRepository.findOne({
      where: {
        requestTypeName: createRequestTypeDto.requestTypeName,
      },
    });

    if (existingRequestType) {
      throw new BadRequestException(
        'Impossible de créer : un type de demande avec ce nom existe déjà.',
      );
    }

    const requestType = this.requestTypeRepository.create({
      ...createRequestTypeDto,
      createdBy: { id: createdBy } as User,
    });

    return this.requestTypeRepository.save(requestType);
  }

  /**
   * Récupère un type de demande par son ID.
   * @param id - ID du type de demande à récupérer.
   * @returns Le type de demande correspondant à l'ID fourni.
   * @throws BadRequestException si aucun type de demande n'est trouvé avec cet ID.
   */
  async findOne(id: string): Promise<RequestType> {
    const requestType = await this.requestTypeRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    });

    if (!requestType) {
      throw new BadRequestException(
        'Impossible de trouver : aucun type de demande trouvé avec cet identifiant.',
      );
    }

    return requestType;
  }

  /**
   * Récupère la liste des types de demandes avec leurs ID et noms.
   * @returns Un tableau de types de demandes avec les champs sélectionnés.
   */
  async getRequestTypeList(): Promise<RequestType[]> {
    return this.requestTypeRepository.find({
      select: ['id', 'requestTypeName'],
      order: { requestTypeName: 'ASC' },
    });
  }

  /**
   * Met à jour un type de demande existant.
   * Valide le nouveau nom pour s'assurer qu'il ne crée pas de conflit avec les types existants.
   * @param id - ID du type de demande à mettre à jour.
   * @param updateRequestTypeDto - DTO contenant les nouvelles informations du type de demande.
   * @param updatedBy - ID de l'utilisateur qui met à jour le type de demande.
   * @returns Le type de demande mis à jour.
   * @throws BadRequestException si un type de demande avec le même nom existe déjà.
   */
  async update(
    id: string,
    updateRequestTypeDto: UpdateRequestTypeDto,
    updatedBy: string,
  ): Promise<RequestType> {
    const requestType = await this.findOne(id);
    if (
      updateRequestTypeDto.requestTypeName &&
      updateRequestTypeDto.requestTypeName !== requestType.requestTypeName
    ) {
      const existingRequestType = await this.requestTypeRepository.findOne({
        where: {
          requestTypeName: updateRequestTypeDto.requestTypeName,
        },
      });
      if (existingRequestType) {
        throw new BadRequestException(
          'Impossible de modifier : un type de demande avec ce nom existe déjà.',
        );
      }
    }
    Object.assign(requestType, updateRequestTypeDto, {
      updatedBy: { id: updatedBy } as User,
    });

    return this.requestTypeRepository.save(requestType);
  }

  /**
   * Supprime un type de demande.
   * @param id - ID du type de demande à supprimer.
   * @param deletedBy - ID de l'utilisateur qui supprime le type de demande.
   * @returns void
   * @throws BadRequestException si le type de demande n'existe pas ou s'il est lié à des catégories de service.
   */
  async remove(id: string, deletedBy: string): Promise<void> {
    const requestType = await this.requestTypeRepository.findOne({
      where: { id },
      relations: ['requestTypeServiceCategories'],
    });
    if (!requestType) {
      throw new BadRequestException(
        'Impossible de supprimer : aucun type de demande trouvé avec cet identifiant.',
      );
    }
    if (
      requestType.requestTypeServiceCategories &&
      requestType.requestTypeServiceCategories.length > 0
    ) {
      throw new BadRequestException(
        'Impossible de supprimer : ce type de demande est associé à au moins une catégorie de service.',
      );
    }

    requestType.deletedBy = { id: deletedBy } as User;
    await this.requestTypeRepository.save(requestType);

    await this.requestTypeRepository.softDelete(id);
  }
}
