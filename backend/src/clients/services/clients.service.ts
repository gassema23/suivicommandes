import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from '../entities/client.entity';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';
import { CreateClientDto } from '../dto/create-client.dto';
import { User } from '../../users/entities/user.entity';
import { UpdateClientDto } from '../dto/update-client.dto';

@Injectable()
export class ClientsService {
  /**
   * Service pour gérer les clients.
   * Permet de créer, lire, mettre à jour et supprimer des clients.
   * @Injectable()
   * @param clientRepository - Le repository TypeORM pour l'entité Client.
   */
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  /**
   * Récupère tous les clients avec pagination et recherche.
   * @param paginationDto - DTO de pagination contenant les paramètres de page, limite, tri et ordre.
   * @param search - Chaîne de recherche optionnelle pour filtrer les clients par numéro.
   * @returns Un objet PaginatedResult contenant les clients et les métadonnées de pagination.
   */
  async findAll(
    paginationDto: PaginationDto,
    search?: string,
  ): Promise<PaginatedResult<Client>> {
    const {
      page = 1,
      limit = 10,
      sort = 'createdAt',
      order = 'DESC',
    } = paginationDto;

    const skip = (page - 1) * limit;

    // Sinon, tri classique
    const whereCondition: FindOptionsWhere<Client> = {};
    if (search) {
      whereCondition.clientNumber = ILike(`%${search}%`);
    }

    const orderBy: Record<string, 'ASC' | 'DESC'> = {};
    if (sort) {
      orderBy[sort] = order?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    }

    const [clients, total] = await this.clientRepository.findAndCount({
      where: whereCondition,
      relations: ['createdBy'],
      skip,
      take: limit,
      order: orderBy,
    });

    return {
      data: clients,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Récupère la liste des clients avec leurs ID, noms et numéros.
   * @returns Un tableau de clients avec les champs sélectionnés.
   */
  async getClientsList(): Promise<Client[]> {
    return this.clientRepository.find({
      select: ['id', 'clientName', 'clientNumber'],
      order: { clientName: 'ASC' },
    });
  }

  /**
   * Crée un nouveau client.
   * @param createClientDto - DTO contenant les informations du client à créer.
   * @param createdBy - ID de l'utilisateur qui crée le client.
   * @returns Le client créé.
   * @throws BadRequestException si un client avec le même nom ou numéro existe déjà.
   */
  async create(createClientDto: CreateClientDto, createdBy: string) {
    const existingClient = await this.clientRepository.findOne({
      where: {
        clientName: createClientDto.clientName,
        clientNumber: createClientDto.clientNumber,
      },
    });

    if (existingClient) {
      throw new BadRequestException(
        'Un client avec ce nom ET ce numéro existe déjà. Veuillez choisir un nom ou un numéro différent.',
      );
    }

    const client = this.clientRepository.create({
      ...createClientDto,
      createdBy: { id: createdBy } as User,
    });

    return this.clientRepository.save(client);
  }

  /**
   * Récupère un client par son ID.
   * @param id - L'ID du client à récupérer.
   * @returns Le client trouvé.
   * @throws BadRequestException si le client n'est pas trouvé.
   */
  async findOne(id: string): Promise<Client> {
    const client = await this.clientRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    });

    if (!client) {
      throw new BadRequestException(`Aucun client trouvé.`);
    }
    return client;
  }

  /**
   * Met à jour un client existant.
   * @param id - L'ID du client à mettre à jour.
   * @param updateClientDto - DTO contenant les informations mises à jour du client.
   * @param updatedBy - ID de l'utilisateur qui met à jour le client.
   * @returns Le client mis à jour.
   * @throws BadRequestException si un client avec le même nom ou numéro existe déjà.
   */
  async update(
    id: string,
    updateClientDto: UpdateClientDto,
    updatedBy: string,
  ): Promise<Client> {
    const client = await this.findOne(id);
    if (
      updateClientDto.clientName &&
      updateClientDto.clientName !== client.clientName
    ) {
      const existingClient = await this.clientRepository.findOne({
        where: {
          clientName: updateClientDto.clientName,
          clientNumber: updateClientDto.clientNumber,
        },
      });
      if (existingClient) {
        throw new BadRequestException(
          'Un client avec ce nom ET ce numéro existe déjà. Impossible de mettre à jour.',
        );
      }
    }
    Object.assign(client, updateClientDto, {
      updatedBy: { id: updatedBy } as User,
    });

    return this.clientRepository.save(client);
  }

  /**
   * Supprime un client par son ID.
   * @param id - L'ID du client à supprimer.
   * @param deletedBy - ID de l'utilisateur qui supprime le client.
   * @throws BadRequestException si le client n'est pas trouvé ou s'il est associé à des subdivisions.
   */
  async remove(id: string, deletedBy: string): Promise<void> {
    const client = await this.clientRepository.findOne({
      where: { id },
      relations: ['subdivisionClients', 'deletedBy'],
    });

    if (!client) {
      throw new BadRequestException(
        `Impossible de supprimer : aucun client trouvé.`,
      );
    }

    if (client.subdivisionClients && client.subdivisionClients.length > 0) {
      throw new BadRequestException(
        'Suppression impossible : ce client est associé à une ou plusieurs subdivisions.',
      );
    }

    client.deletedBy = { id: deletedBy } as User;
    await this.clientRepository.save(client);

    await this.clientRepository.softDelete(id);
  }
}
