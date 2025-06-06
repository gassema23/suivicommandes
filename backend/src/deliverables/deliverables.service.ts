import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Deliverable } from './entities/deliverable.entity';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResult } from '../common/interfaces/paginated-result.interface';
import { CreateDeliverableDto } from './dto/create-deliverable.dto';
import { User } from '../users/entities/user.entity';
import { UpdateDeliverableDto } from './dto/update-deliverable.dto';

@Injectable()
export class DeliverablesService {
  constructor(
    @InjectRepository(Deliverable)
    private readonly deliverableRepository: Repository<Deliverable>,
  ) {}

  async findAll(
    paginationDto: PaginationDto,
    search?: string,
  ): Promise<PaginatedResult<Deliverable>> {
    const {
      page = 1,
      limit = 10,
      sort = 'createdAt',
      order = 'DESC',
    } = paginationDto;

    const skip = (page - 1) * limit;

    // Sinon, tri classique
    const whereCondition: FindOptionsWhere<Deliverable> = {};
    if (search) {
      whereCondition.deliverableName = ILike(`%${search}%`);
    }

    const orderBy: Record<string, 'ASC' | 'DESC'> = {};
    if (sort) {
      orderBy[sort] = order?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    }

    const [deliverables, total] = await this.deliverableRepository.findAndCount({
      where: whereCondition,
      relations: ['createdBy'],
      skip,
      take: limit,
      order: orderBy,
    });

    return {
      data: deliverables,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async create(createDeliverableDto: CreateDeliverableDto, createdBy: string) {
    const existingDeliverable = await this.deliverableRepository.findOne({
      where: {
        deliverableName: createDeliverableDto.deliverableName,
      },
    });

    if (existingDeliverable) {
      throw new BadRequestException('Un livrable avec ce nom existe déjà');
    }

    const deliverable = this.deliverableRepository.create({
      ...createDeliverableDto,
      createdBy: { id: createdBy } as User,
    });

    return this.deliverableRepository.save(deliverable);
  }

  async findOne(id: string): Promise<Deliverable> {
    const deliverable = await this.deliverableRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    });

    if (!deliverable) {
      throw new BadRequestException('Livrable non trouvé');
    }

    return deliverable;
  }

  async update(
    id: string,
    updateDeliverableDto: UpdateDeliverableDto,
    updatedBy: string,
  ): Promise<Deliverable> {
    const deliverable = await this.findOne(id);
    if (
      updateDeliverableDto.deliverableName &&
      updateDeliverableDto.deliverableName !== deliverable.deliverableName
    ) {
      const existingDeliverable = await this.deliverableRepository.findOne({
        where: {
          deliverableName: updateDeliverableDto.deliverableName,
        },
      });
      if (existingDeliverable) {
        throw new BadRequestException(
          'Un livrable avec ce nom existe déjà',
        );
      }
    }
    Object.assign(deliverable, updateDeliverableDto, {
      updatedBy: { id: updatedBy } as User,
    });

    return this.deliverableRepository.save(deliverable);
  }

  async remove(id: string, deletedBy: string): Promise<void> {
    const deliverable = await this.findOne(id);

    deliverable.deletedBy = { id: deletedBy } as User;
    await this.deliverableRepository.save(deliverable);

    await this.deliverableRepository.softDelete(id);
  }
}
