import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from 'src/clients/entities/client.entity';
import { SubdivisionClient } from './entities/subdivision-client.entity';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginatedResult } from 'src/common/interfaces/paginated-result.interface';
import { CreateSubdivisionClientDto } from './dto/create-subdivision-client.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class SubdivisionClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(SubdivisionClient)
    private readonly subdivisionClientRepository: Repository<SubdivisionClient>,
  ) {}

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
        'Une subdivision client avec ce nom existe déjà',
      );
    }

    const client = await this.clientRepository.findOne({
      where: { id: createSubdivisionClientDto.clientId },
    });
    if (!client) {
      throw new BadRequestException('Client introuvable');
    }

    const subdivisionClient = this.subdivisionClientRepository.create({
      ...createSubdivisionClientDto,
      client,
      createdBy: { id: createdBy } as User,
    });

    return this.subdivisionClientRepository.save(subdivisionClient);
  }

  async findOne(id: string): Promise<SubdivisionClient> {
    const subdivisionClient = await this.subdivisionClientRepository.findOne({
      where: { id },
      relations: ['client', 'createdBy'],
    });

    if (!subdivisionClient) {
      throw new NotFoundException('Subdivision client non trouvée');
    }

    return subdivisionClient;
  }
}
