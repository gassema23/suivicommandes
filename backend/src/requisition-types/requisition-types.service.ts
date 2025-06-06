import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RequisitionType } from './entities/requisition-type.entity';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResult } from '../common/interfaces/paginated-result.interface';
import { CreateRequisitionTypeDto } from './dto/create-requisition-type.dto';
import { User } from '../users/entities/user.entity';
import { UpdateRequisitionTypeDto } from './dto/update-requisition-type.dto';

@Injectable()
export class RequisitionTypesService {
  constructor(
    @InjectRepository(RequisitionType)
    private readonly requisitionTypeRepository: Repository<RequisitionType>,
  ) {}

  async findAll(
    paginationDto: PaginationDto,
    search?: string,
  ): Promise<PaginatedResult<RequisitionType>> {
    const {
      page = 1,
      limit = 10,
      sort = 'createdAt',
      order = 'DESC',
    } = paginationDto;

    const skip = (page - 1) * limit;

    // Sinon, tri classique
    const whereCondition: FindOptionsWhere<RequisitionType> = {};
    if (search) {
      whereCondition.requisitionTypeName = ILike(`%${search}%`);
    }

    const orderBy: Record<string, 'ASC' | 'DESC'> = {};
    if (sort) {
      orderBy[sort] = order?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    }

    const [requisitionTypes, total] =
      await this.requisitionTypeRepository.findAndCount({
        where: whereCondition,
        relations: ['createdBy'],
        skip,
        take: limit,
        order: orderBy,
      });

    return {
      data: requisitionTypes,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async create(
    createRequisitionTypeDto: CreateRequisitionTypeDto,
    createdBy: string,
  ) {
    const existingDelayType = await this.requisitionTypeRepository.findOne({
      where: {
        requisitionTypeName: createRequisitionTypeDto.requisitionTypeName,
      },
    });

    if (existingDelayType) {
      throw new BadRequestException(
        'Un type de réquisition avec ce nom existe déjà',
      );
    }

    const requisitionType = this.requisitionTypeRepository.create({
      ...createRequisitionTypeDto,
      createdBy: { id: createdBy } as User,
    });

    return this.requisitionTypeRepository.save(requisitionType);
  }

  async findOne(id: string): Promise<RequisitionType> {
    const requisitionType = await this.requisitionTypeRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    });

    if (!requisitionType) {
      throw new BadRequestException('Type de réquisition non trouvé');
    }

    return requisitionType;
  }

  async update(
    id: string,
    updateRequisitionTypeDto: UpdateRequisitionTypeDto,
    updatedBy: string,
  ): Promise<RequisitionType> {
    const requisitionType = await this.findOne(id);
    if (
      updateRequisitionTypeDto.requisitionTypeName &&
      updateRequisitionTypeDto.requisitionTypeName !== requisitionType.requisitionTypeName
    ) {
      const existingDelayType = await this.requisitionTypeRepository.findOne({
        where: {
          requisitionTypeName: updateRequisitionTypeDto.requisitionTypeName,
        },
      });
      if (existingDelayType) {
        throw new BadRequestException(
          'Un type de réquisition avec ce nom existe déjà',
        );
      }
    }
    Object.assign(requisitionType, updateRequisitionTypeDto, {
      updatedBy: { id: updatedBy } as User,
    });

    return this.requisitionTypeRepository.save(requisitionType);
  }

  async remove(id: string, deletedBy: string): Promise<void> {
    const requisitionType = await this.findOne(id);

    requisitionType.deletedBy = { id: deletedBy } as User;
    await this.requisitionTypeRepository.save(requisitionType);

    await this.requisitionTypeRepository.softDelete(id);
  }
}
