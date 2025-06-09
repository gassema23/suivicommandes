import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from '../../clients/entities/client.entity';
import { SubdivisionClient } from '../entities/subdivision-client.entity';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';
import { CreateSubdivisionClientDto } from '../dto/create-subdivision-client.dto';
import { User } from '../../users/entities/user.entity';
import { UpdateSubdivisionClientDto } from '../dto/update-subdivision-client.dto';

@Injectable()
export class SubdivisionClientsService {
  /**
   * Service pour gérer les subdivisions clients.
   * Permet de créer, lire, mettre à jour et supprimer des subdivisions clients.
   */
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(SubdivisionClient)
    private readonly subdivisionClientRepository: Repository<SubdivisionClient>,
  ) {}

  /**
   * Récupère une liste paginée de subdivisions clients avec une option de recherche.
   * @param paginationDto - DTO pour la pagination et le tri.
   * @param search - Terme de recherche optionnel pour filtrer les subdivisions clients par numéro.
   * @returns Un objet contenant les subdivisions clients et les métadonnées de pagination.
   */
  async findAll(
    paginationDto: PaginationDto,
    search?: string,
  ): Promise<PaginatedResult<SubdivisionClient>> {
    const {
      page = 1,
      limit = 10,
      sort = 'createdAt',
      order = 'DESC',
    } = paginationDto;
    const skip = (page - 1) * limit;

    // Sinon, tri classique
    const whereCondition: FindOptionsWhere<SubdivisionClient> = {};
    if (search) {
      whereCondition.subdivisionClientNumber = ILike(`%${search}%`);
    }

    const orderBy: Record<string, 'ASC' | 'DESC'> = {};
    if (sort) {
      orderBy[sort] = order?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    }

    const [subdivisionClients, total] =
      await this.subdivisionClientRepository.findAndCount({
        where: whereCondition,
        relations: ['client', 'createdBy'],
        skip,
        take: limit,
        order: orderBy,
      });

    return {
      data: subdivisionClients,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Crée une nouvelle subdivision client.
   * @param createSubdivisionClientDto - DTO pour la création d'une subdivision client.
   * @param createdBy - ID de l'utilisateur qui crée la subdivision client.
   * @returns La subdivision client créée.
   * @throws BadRequestException si une subdivision client avec le même nom et numéro existe déjà ou si le client n'est pas trouvé.
   */
  async create(
    createSubdivisionClientDto: CreateSubdivisionClientDto,
    createdBy: string,
  ) {
    const existingSubdivisionClient =
      await this.subdivisionClientRepository.findOne({
        where: {
          subdivisionClientName:
            createSubdivisionClientDto.subdivisionClientName,
          subdivisionClientNumber:
            createSubdivisionClientDto.subdivisionClientNumber,
        },
      });

    if (existingSubdivisionClient) {
      throw new BadRequestException(
        'Impossible de créer : une subdivision client avec ce nom et ce numéro existe déjà.',
      );
    }

    const client = await this.clientRepository.findOne({
      where: { id: createSubdivisionClientDto.clientId },
    });
    if (!client) {
      throw new BadRequestException(
        'Impossible de créer : client introuvable avec cet identifiant.',
      );
    }

    const subdivisionClient = this.subdivisionClientRepository.create({
      ...createSubdivisionClientDto,
      client,
      createdBy: { id: createdBy } as User,
    });

    return this.subdivisionClientRepository.save(subdivisionClient);
  }

  /**
   * Récupère une subdivision client par son ID.
   * @param id - ID de la subdivision client à récupérer.
   * @returns La subdivision client trouvée.
   * @throws NotFoundException si aucune subdivision client n'est trouvée avec cet ID.
   */
  async findOne(id: string): Promise<SubdivisionClient> {
    const subdivisionClient = await this.subdivisionClientRepository.findOne({
      where: { id },
      relations: ['client', 'createdBy'],
    });

    if (!subdivisionClient) {
      throw new NotFoundException(
        'Impossible de trouver : aucune subdivision client trouvée avec cet identifiant.',
      );
    }

    return subdivisionClient;
  }

  /**
   * Met à jour une subdivision client existante.
   * @param id - ID de la subdivision client à mettre à jour.
   * @param updateSubdivisionClientDto - DTO contenant les données de mise à jour.
   * @param updatedBy - ID de l'utilisateur qui met à jour la subdivision client.
   * @returns La subdivision client mise à jour.
   * @throws BadRequestException si la subdivision client n'est pas trouvée ou si des validations échouent.
   */
  async update(
    id: string,
    updateSubdivisionClientDto: UpdateSubdivisionClientDto,
    updatedBy: string,
  ): Promise<SubdivisionClient> {
    const subdivisionClient = await this.subdivisionClientRepository.findOne({
      where: { id },
      relations: ['client', 'createdBy'],
    });

    if (!subdivisionClient) {
      throw new BadRequestException(
        'Impossible de modifier : aucune subdivision client trouvée avec cet identifiant.',
      );
    }

    if (
      updateSubdivisionClientDto.subdivisionClientName &&
      updateSubdivisionClientDto.subdivisionClientName !==
        subdivisionClient.subdivisionClientName
    ) {
      const existingSubdivisionClient =
        await this.subdivisionClientRepository.findOne({
          where: {
            subdivisionClientName:
              updateSubdivisionClientDto.subdivisionClientName,
            client: { id: updateSubdivisionClientDto.clientId },
          },
        });
      if (existingSubdivisionClient) {
        throw new BadRequestException(
          'Impossible de modifier : une subdivision client avec ce nom existe déjà pour ce client.',
        );
      }
    }

    if (
      updateSubdivisionClientDto.clientId &&
      (!subdivisionClient.client ||
        subdivisionClient.client.id !== updateSubdivisionClientDto.clientId)
    ) {
      const newClient = await this.clientRepository.findOne({
        where: { id: updateSubdivisionClientDto.clientId },
      });
      if (!newClient) {
        throw new BadRequestException(
          'Impossible de modifier : client introuvable avec cet identifiant.',
        );
      }
      subdivisionClient.client = newClient;
    }

    Object.assign(subdivisionClient, updateSubdivisionClientDto, {
      updatedBy: { id: updatedBy } as User,
    });

    return this.subdivisionClientRepository.save(subdivisionClient);
  }

  /**
   * Supprime une subdivision client par son ID.
   * @param id - ID de la subdivision client à supprimer.
   * @param deletedBy - ID de l'utilisateur qui supprime la subdivision client.
   * @throws NotFoundException si la subdivision client n'est pas trouvée.
   */
  async remove(id: string, deletedBy: string): Promise<void> {
    const subdivisionClient = await this.findOne(id);
    subdivisionClient.deletedBy = { id: deletedBy } as User;

    await this.subdivisionClientRepository.save(subdivisionClient);
    await this.subdivisionClientRepository.softDelete(id);
  }
}
