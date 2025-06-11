import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DelayType } from '../entities/delay-type.entity';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';
import { CreateDelayTypeDto } from '../dto/create-delay-type.dto';
import { User } from '../../users/entities/user.entity';
import { UpdateDelayTypeDto } from '../dto/update-delay-type.dto';

@Injectable()
export class DelayTypesService {
  /**
   * Service pour gérer les types de délais.
   * Permet de créer, lire, mettre à jour et supprimer des types de délais.
   * @Injectable()
   * @param delayTypeRepository - Le repository TypeORM pour l'entité DelayType.
   */
  constructor(
    @InjectRepository(DelayType)
    private readonly delayTypeRepository: Repository<DelayType>,
  ) {}

  /**
   * Récupère tous les types de délais avec pagination et recherche.
   * @param paginationDto - DTO de pagination contenant les paramètres de page, limite, tri et ordre.
   * @param search - Chaîne de recherche optionnelle pour filtrer les types de délais par nom.
   * @returns Un objet PaginatedResult contenant les types de délais et les métadonnées de pagination.
   */
  async findAll(
    paginationDto: PaginationDto,
    search?: string,
  ): Promise<PaginatedResult<DelayType>> {
    const {
      page = 1,
      limit = 10,
      sort = 'createdAt',
      order = 'DESC',
    } = paginationDto;

    const skip = (page - 1) * limit;

    // Sinon, tri classique
    const whereCondition: FindOptionsWhere<DelayType> = {};
    if (search) {
      whereCondition.delayTypeName = ILike(`%${search}%`);
    }

    const orderBy: Record<string, 'ASC' | 'DESC'> = {};
    if (sort) {
      orderBy[sort] = order?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    }

    const [delayTypes, total] = await this.delayTypeRepository.findAndCount({
      where: whereCondition,
      relations: ['createdBy'],
      skip,
      take: limit,
      order: orderBy,
    });

    return {
      data: delayTypes,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Crée un nouveau type de délai.
   * @param createDelayTypeDto - DTO contenant les informations du type de délai à créer.
   * @param createdBy - ID de l'utilisateur qui crée le type de délai.
   * @returns Le type de délai créé.
   * @throws BadRequestException si le nom du type de délai est déjà utilisé.
   */
  async create(createDelayTypeDto: CreateDelayTypeDto, createdBy: string) {
    const existingDelayType = await this.delayTypeRepository.findOne({
      where: {
        delayTypeName: createDelayTypeDto.delayTypeName,
      },
    });

    if (existingDelayType) {
      throw new BadRequestException(
        'Ce nom de type de délai est déjà utilisé.',
      );
    }

    const delayType = this.delayTypeRepository.create({
      ...createDelayTypeDto,
      createdBy: { id: createdBy } as User,
    });

    return this.delayTypeRepository.save(delayType);
  }

  /**
   * Récupère un type de délai par son ID.
   * @param id - L'ID du type de délai à récupérer.
   * @returns Le type de délai trouvé.
   * @throws BadRequestException si le type de délai n'est pas trouvé.
   */
  async findOne(id: string): Promise<DelayType> {
    const delayType = await this.delayTypeRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    });

    if (!delayType) {
      throw new BadRequestException(
        'Aucun type de délai trouvé avec cet identifiant.',
      );
    }

    return delayType;
  }

  /**
   * Met à jour un type de délai existant.
   * @param id - L'ID du type de délai à mettre à jour.
   * @param updateDelayTypeDto - DTO contenant les nouvelles informations du type de délai.
   * @param updatedBy - ID de l'utilisateur qui met à jour le type de délai.
   * @returns Le type de délai mis à jour.
   * @throws BadRequestException si le nom du type de délai existe déjà.
   */
  async update(
    id: string,
    updateDelayTypeDto: UpdateDelayTypeDto,
    updatedBy: string,
  ): Promise<DelayType> {
    const delayType = await this.findOne(id);
    if (
      updateDelayTypeDto.delayTypeName &&
      updateDelayTypeDto.delayTypeName !== delayType.delayTypeName
    ) {
      const existingDelayType = await this.delayTypeRepository.findOne({
        where: {
          delayTypeName: updateDelayTypeDto.delayTypeName,
        },
      });
      if (existingDelayType) {
        throw new BadRequestException(
          'Impossible de modifier : ce nom de type de délai existe déjà.',
        );
      }
    }
    Object.assign(delayType, updateDelayTypeDto, {
      updatedBy: { id: updatedBy } as User,
    });

    return this.delayTypeRepository.save(delayType);
  }

  /**
   * Supprime un type de délai.
   * @param id - L'ID du type de délai à supprimer.
   * @param deletedBy - ID de l'utilisateur qui supprime le type de délai.
   * @throws BadRequestException si le type de délai n'est pas trouvé ou s'il est utilisé par des types de demande.
   */
  async remove(id: string, deletedBy: string): Promise<void> {
    const delayType = await this.delayTypeRepository.findOne({
      where: { id },
      relations: ['requestTypeDelays'],
    });
    if (!delayType) {
      throw new BadRequestException(
        'Impossible de supprimer : type de délai introuvable.',
      );
    }

    if (delayType.requestTypeDelays && delayType.requestTypeDelays.length > 0) {
      throw new BadRequestException(
        'Suppression impossible : ce type de délai est utilisé par au moins un type de demande.',
      );
    }

    delayType.deletedBy = { id: deletedBy } as User;
    await this.delayTypeRepository.save(delayType);

    await this.delayTypeRepository.softDelete(id);
  }

  /**
   * Récupère tous les types de délais sans pagination.
   * @returns Une liste de tous les types de délais, triée par date de création.
   */
  async findAllDelayTypesList(): Promise<DelayType[]> {
    return this.delayTypeRepository.find({
      select: ['id', 'delayTypeName'],
      order: { delayTypeName: 'DESC' },
    });
  }
}
