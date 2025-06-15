import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Sector } from '../entities/sectors.entity';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';
import { CreateSectorDto } from '../dto/create-sector.dto';
import { User } from '../../users/entities/user.entity';
import { UpdateSectorDto } from '../dto/update-sector.dto';
import { Service } from '../../services/entities/service.entity';

@Injectable()
export class SectorsService {
  /**
   * Service pour gérer les secteurs.
   * Permet de créer, lire, mettre à jour et supprimer des secteurs.
   *
   * @param sectorRepository - Repository pour accéder aux données des secteurs.
   */
  constructor(
    @InjectRepository(Sector)
    private readonly sectorRepository: Repository<Sector>,
  ) {}

  /**
   * Récupère tous les secteurs avec pagination et recherche.
   * @param paginationDto - DTO de pagination contenant les paramètres de pagination.
   * @param search - Chaîne de recherche pour filtrer les secteurs par nom.
   * @returns Un objet PaginatedResult contenant les secteurs et les métadonnées de pagination.
   */
  async findAll(
    paginationDto: PaginationDto,
    search?: string,
  ): Promise<PaginatedResult<Sector>> {
    const {
      page = 1,
      limit = 10,
      sort = 'createdAt',
      order = 'DESC',
    } = paginationDto;

    const skip = (page - 1) * limit;

    // Sinon, tri classique
    const whereCondition: FindOptionsWhere<Sector> = {};
    if (search) {
      whereCondition.sectorName = ILike(`%${search}%`);
    }

    const orderBy: Record<string, 'ASC' | 'DESC'> = {};
    if (sort) {
      orderBy[sort] = order?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    }

    const [sectors, total] = await this.sectorRepository.findAndCount({
      where: whereCondition,
      relations: ['createdBy'],
      skip,
      take: limit,
      order: orderBy,
    });

    return {
      data: sectors,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Crée un nouveau secteur.
   * @param createSectorDto - DTO contenant les informations du secteur à créer.
   * @param createdBy - ID de l'utilisateur qui crée le secteur.
   * @returns Le secteur créé.
   * @throws BadRequestException si un secteur avec le même nom existe déjà.
   */
  async create(createSectorDto: CreateSectorDto, createdBy: string) {
    const existingSector = await this.sectorRepository.findOne({
      where: {
        sectorName: createSectorDto.sectorName,
      },
    });

    if (existingSector) {
      throw new BadRequestException(
        'Impossible de créer : un secteur avec ce nom existe déjà.',
      );
    }

    const sector = this.sectorRepository.create({
      ...createSectorDto,
      createdBy: { id: createdBy } as User,
    });

    return this.sectorRepository.save(sector);
  }

  /**
   * Récupère un secteur par son ID.
   * @param id - ID du secteur à récupérer.
   * @returns Le secteur correspondant à l'ID.
   * @throws BadRequestException si le secteur n'existe pas.
   */
  async findOne(id: string): Promise<Sector> {
    const sector = await this.sectorRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    });

    if (!sector) {
      throw new BadRequestException(
        'Impossible de trouver : aucun secteur trouvé avec cet identifiant.',
      );
    }

    return sector;
  }

  /**
   * Récupère les services associés à un secteur par son ID.
   * @param id - ID du secteur.
   * @returns Liste des services associés au secteur.
   * @throws BadRequestException si le secteur n'existe pas ou s'il n'a pas de services associés.
   */
  async getServicesBySectorId(id: string): Promise<Service[]> {
    const sector = await this.sectorRepository.findOne({
      where: { id },
      relations: ['services'],
    });

    if (!sector?.services) {
      throw new BadRequestException(
        'Impossible de trouver : aucun service associé à ce secteur.',
      );
    }

    return sector.services;
  }

  /**
   * Met à jour un secteur.
   * @param id - ID du secteur à mettre à jour.
   * @param updateSectorDto - DTO contenant les informations à mettre à jour.
   * @param updatedBy - ID de l'utilisateur qui met à jour le secteur.
   * @returns Le secteur mis à jour.
   * @throws BadRequestException si le secteur n'existe pas ou si un secteur avec le même nom existe déjà.
   */
  async update(
    id: string,
    updateSectorDto: UpdateSectorDto,
    updatedBy: string,
  ): Promise<Sector> {
    const sector = await this.findOne(id);
    if (
      updateSectorDto.sectorName &&
      updateSectorDto.sectorName !== sector.sectorName
    ) {
      const existingSector = await this.sectorRepository.findOne({
        where: {
          sectorName: updateSectorDto.sectorName,
        },
      });
      if (existingSector) {
        throw new BadRequestException(
          'Impossible de modifier : un secteur avec ce nom existe déjà.',
        );
      }
    }
    Object.assign(sector, updateSectorDto, {
      updatedBy: { id: updatedBy } as User,
    });

    return this.sectorRepository.save(sector);
  }

  /**
   * Supprime un secteur.
   * @param id - ID du secteur à supprimer.
   * @param deletedBy - ID de l'utilisateur qui supprime le secteur.
   * @throws BadRequestException si le secteur n'existe pas ou s'il possède des services associés.
   */
  async remove(id: string, deletedBy: string): Promise<void> {
    const sector = await this.sectorRepository.findOne({
      where: { id },
      relations: ['services', 'deletedBy'],
    });

    if (!sector) {
      throw new BadRequestException(
        'Impossible de supprimer : aucun secteur trouvé avec cet identifiant.',
      );
    }
    if (sector.services && sector.services.length > 0) {
      throw new BadRequestException(
        'Impossible de supprimer : ce secteur possède des services associés.',
      );
    }

    sector.deletedBy = { id: deletedBy } as User;
    await this.sectorRepository.save(sector);

    await this.sectorRepository.softDelete(id);
  }

  /**
   * Récupère la liste des secteurs avec uniquement les champs id et sectorName.
   * @returns Liste des secteurs.
   */
  async getSectorsList(): Promise<Sector[]> {
    return this.sectorRepository.find({
      select: ['id', 'sectorName'],
      order: { sectorName: 'ASC' },
    });
  }
}
