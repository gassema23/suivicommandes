import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Flow } from './entities/flow.entity';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResult } from '../common/interfaces/paginated-result.interface';
import { CreateFlowDto } from './dto/create-flow.dto';
import { User } from '../users/entities/user.entity';
import { UpdateFlowDto } from './dto/update-flow.dto';

@Injectable()
export class FlowsService {
  constructor(
    @InjectRepository(Flow)
    private readonly flowRepository: Repository<Flow>,
  ) {}

  async findAll(
    paginationDto: PaginationDto,
    search?: string,
  ): Promise<PaginatedResult<Flow>> {
    const {
      page = 1,
      limit = 10,
      sort = 'createdAt',
      order = 'DESC',
    } = paginationDto;

    const skip = (page - 1) * limit;

    // Sinon, tri classique
    const whereCondition: FindOptionsWhere<Flow> = {};
    if (search) {
      whereCondition.flowName = ILike(`%${search}%`);
    }

    const orderBy: Record<string, 'ASC' | 'DESC'> = {};
    if (sort) {
      orderBy[sort] = order?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    }

    const [flows, total] = await this.flowRepository.findAndCount({
      where: whereCondition,
      relations: ['createdBy'],
      skip,
      take: limit,
      order: orderBy,
    });

    return {
      data: flows,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async create(createFlowDto: CreateFlowDto, createdBy: string) {
    const existingFlow = await this.flowRepository.findOne({
      where: {
        flowName: createFlowDto.flowName,
      },
    });

    if (existingFlow) {
      throw new BadRequestException('Un flux de transmission avec ce nom existe déjà');
    }

    const flow = this.flowRepository.create({
      ...createFlowDto,
      createdBy: { id: createdBy } as User,
    });

    return this.flowRepository.save(flow);
  }

  async findOne(id: string): Promise<Flow> {
    const flow = await this.flowRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    });

    if (!flow) {
      throw new BadRequestException('Flux de transmission non trouvé');
    }

    return flow;
  }

  async update(
    id: string,
    updateFlowDto: UpdateFlowDto,
    updatedBy: string,
  ): Promise<Flow> {
    const flow = await this.findOne(id);
    if (
      updateFlowDto.flowName &&
      updateFlowDto.flowName !== flow.flowName
    ) {
      const existingFlow = await this.flowRepository.findOne({
        where: {
          flowName: updateFlowDto.flowName,
        },
      });
      if (existingFlow) {
        throw new BadRequestException(
          'Un flux de transmission avec ce nom existe déjà',
        );
      }
    }
    Object.assign(flow, updateFlowDto, {
      updatedBy: { id: updatedBy } as User,
    });

    return this.flowRepository.save(flow);
  }

  async remove(id: string, deletedBy: string): Promise<void> {
    const flow = await this.findOne(id);

    flow.deletedBy = { id: deletedBy } as User;
    await this.flowRepository.save(flow);

    await this.flowRepository.softDelete(id);
  }
}
