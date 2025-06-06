import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRequestTypeDto } from './dto/create-request-type.dto';
import { User } from '../users/entities/user.entity';
import { RequestType } from './entities/request-type.entity';
import { UpdateRequestTypeDto } from './dto/update-request-type.dto';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResult } from '../common/interfaces/paginated-result.interface';

@Injectable()
export class RequestTypesService {
  constructor(
    @InjectRepository(RequestType)
    private readonly requestTypeRepository: Repository<RequestType>,
  ) {}

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

  async create(createRequestTypeDto: CreateRequestTypeDto, createdBy: string) {
    const existingRequestType = await this.requestTypeRepository.findOne({
      where: {
        requestTypeName: createRequestTypeDto.requestTypeName,
      },
    });

    if (existingRequestType) {
      throw new BadRequestException(
        'Un type de demande avec ce nom existe déjà',
      );
    }

    const requestType = this.requestTypeRepository.create({
      ...createRequestTypeDto,
      createdBy: { id: createdBy } as User,
    });

    return this.requestTypeRepository.save(requestType);
  }

  async findOne(id: string): Promise<RequestType> {
    const requestType = await this.requestTypeRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    });

    if (!requestType) {
      throw new BadRequestException('Type de demande non trouvé');
    }

    return requestType;
  }

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
          'Un type de demande avec ce nom existe déjà',
        );
      }
    }
    Object.assign(requestType, updateRequestTypeDto, {
      updatedBy: { id: updatedBy } as User,
    });

    return this.requestTypeRepository.save(requestType);
  }

  async remove(id: string, deletedBy: string): Promise<void> {
    const requestType = await this.findOne(id);

    requestType.deletedBy = { id: deletedBy } as User;
    await this.requestTypeRepository.save(requestType);

    await this.requestTypeRepository.softDelete(id);
  }
}
