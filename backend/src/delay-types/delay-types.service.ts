import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DelayType } from './entities/delay-type.entity';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResult } from '../common/interfaces/paginated-result.interface';
import { CreateDelayTypeDto } from './dto/create-delay-type.dto';
import { User } from '../users/entities/user.entity';
import { UpdateDelayTypeDto } from './dto/update-delay-type.dto';

@Injectable()
export class DelayTypesService {
  constructor(
    @InjectRepository(DelayType)
    private readonly delayTypeRepository: Repository<DelayType>,
  ) {}

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

  async create(createDelayTypeDto: CreateDelayTypeDto, createdBy: string) {
    const existingDelayType = await this.delayTypeRepository.findOne({
      where: {
        delayTypeName: createDelayTypeDto.delayTypeName,
      },
    });

    if (existingDelayType) {
      throw new BadRequestException('Un type de délai avec ce nom existe déjà');
    }

    const delayType = this.delayTypeRepository.create({
      ...createDelayTypeDto,
      createdBy: { id: createdBy } as User,
    });

    return this.delayTypeRepository.save(delayType);
  }

  async findOne(id: string): Promise<DelayType> {
    const delayType = await this.delayTypeRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    });

    if (!delayType) {
      throw new BadRequestException('Type de délai non trouvé');
    }

    return delayType;
  }

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
          'Un type de délai avec ce nom existe déjà',
        );
      }
    }
    Object.assign(delayType, updateDelayTypeDto, {
      updatedBy: { id: updatedBy } as User,
    });

    return this.delayTypeRepository.save(delayType);
  }

  async remove(id: string, deletedBy: string): Promise<void> {
    const delayType = await this.findOne(id);

    delayType.deletedBy = { id: deletedBy } as User;
    await this.delayTypeRepository.save(delayType);

    await this.delayTypeRepository.softDelete(id);
  }
}
