import { InjectRepository } from '@nestjs/typeorm';
import { CreateConformityTypeDto } from './dto/create-conformity-type.dto';
import { User } from '../users/entities/user.entity';
import { ConformityType } from './entities/conformity-type.entity';
import { UpdateConformityTypeDto } from './dto/update-conformity-type.dto';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResult } from '../common/interfaces/paginated-result.interface';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class ConformityTypesService {
  constructor(
    @InjectRepository(ConformityType)
    private readonly conformityTypeRepository: Repository<ConformityType>,
  ) {}

  async findAll(
    paginationDto: PaginationDto,
    search?: string,
  ): Promise<PaginatedResult<ConformityType>> {
    const {
      page = 1,
      limit = 10,
      sort = 'createdAt',
      order = 'DESC',
    } = paginationDto;

    const skip = (page - 1) * limit;

    // Sinon, tri classique
    const whereCondition: FindOptionsWhere<ConformityType> = {};
    if (search) {
      whereCondition.conformityTypeName = ILike(`%${search}%`);
    }

    const orderBy: Record<string, 'ASC' | 'DESC'> = {};
    if (sort) {
      orderBy[sort] = order?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    }

    const [conformityTypes, total] = await this.conformityTypeRepository.findAndCount(
      {
        where: whereCondition,
        relations: ['createdBy'],
        skip,
        take: limit,
        order: orderBy,
      },
    );

    return {
      data: conformityTypes,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async create(createConformityTypeDto: CreateConformityTypeDto, createdBy: string) {
    const existingConformityType = await this.conformityTypeRepository.findOne({
      where: {
        conformityTypeName: createConformityTypeDto.conformityTypeName,
      },
    });

    if (existingConformityType) {
      throw new BadRequestException(
        'Un type de conformité avec ce nom existe déjà',
      );
    }

    const conformityType = this.conformityTypeRepository.create({
      ...createConformityTypeDto,
      createdBy: { id: createdBy } as User,
    });

    return this.conformityTypeRepository.save(conformityType);
  }

  async findOne(id: string): Promise<ConformityType> {
    const conformityType = await this.conformityTypeRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    });

    if (!conformityType) {
      throw new BadRequestException('Type de conformité non trouvé');
    }

    return conformityType;
  }

  async update(
    id: string,
    updateConformityTypeDto: UpdateConformityTypeDto,
    updatedBy: string,
  ): Promise<ConformityType> {
    const conformityType = await this.findOne(id);
    if (
      updateConformityTypeDto.conformityTypeName &&
      updateConformityTypeDto.conformityTypeName !== conformityType.conformityTypeName
    ) {
      const existingConformityType = await this.conformityTypeRepository.findOne({
        where: {
          conformityTypeName: updateConformityTypeDto.conformityTypeName,
        },
      });
      if (existingConformityType) {
        throw new BadRequestException(
          'Un type de conformité avec ce nom existe déjà',
        );
      }
    }
    Object.assign(conformityType, updateConformityTypeDto, {
      updatedBy: { id: updatedBy } as User,
    });

    return this.conformityTypeRepository.save(conformityType);
  }

  async remove(id: string, deletedBy: string): Promise<void> {
    const conformityType = await this.findOne(id);

    conformityType.deletedBy = { id: deletedBy } as User;
    await this.conformityTypeRepository.save(conformityType);

    await this.conformityTypeRepository.softDelete(id);
  }
}
