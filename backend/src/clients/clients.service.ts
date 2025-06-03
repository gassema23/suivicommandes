import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginatedResult } from 'src/common/interfaces/paginated-result.interface';
import { CreateClientDto } from './dto/create-client.dto';
import { User } from 'src/users/entities/user.entity';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

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

  async getClientsList(): Promise<Client[]> {
    return this.clientRepository.find({
      select: ['id', 'clientName', 'clientNumber'],
      order: { clientName: 'ASC' },
    });
  }

  async create(createClientDto: CreateClientDto, createdBy: string) {
    const existingClient = await this.clientRepository.findOne({
      where: {
        clientName: createClientDto.clientName,
        clientNumber: createClientDto.clientNumber,
      },
    });

    if (existingClient) {
      throw new BadRequestException('Un client avec ce nom existe déjà');
    }

    const client = this.clientRepository.create({
      ...createClientDto,
      createdBy: { id: createdBy } as User,
    });

    return this.clientRepository.save(client);
  }

  async findOne(id: string): Promise<Client> {
    const client = await this.clientRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    });

    if (!client) {
      throw new BadRequestException('Client non trouvé');
    }
    return client;
  }

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
      const existingHoliday = await this.clientRepository.findOne({
        where: {
          clientName: updateClientDto.clientName,
          clientNumber: updateClientDto.clientNumber,
        },
      });
      if (existingHoliday) {
        throw new BadRequestException('Un client avec ce nom existe déjà');
      }
    }
    Object.assign(client, updateClientDto, {
      updatedBy: { id: updatedBy } as User,
    });

    return this.clientRepository.save(client);
  }

  async remove(id: string, deletedBy: string): Promise<void> {
    const client = await this.findOne(id);

    client.deletedBy = { id: deletedBy } as User;
    await this.clientRepository.save(client);

    await this.clientRepository.softDelete(id);
  }
}
