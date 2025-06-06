import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProviderDisponibility } from './entities/provider-disponibility.entity';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResult } from '../common/interfaces/paginated-result.interface';
import { CreateProviderDisponibilityDto } from './dto/create-provider-disponibility.dto';
import { User } from '../users/entities/user.entity';
import { UpdateProviderDisponibilityDto } from './dto/update-provider-disponibility.dto';

@Injectable()
export class ProviderDisponibilitiesService {
  constructor(
    @InjectRepository(ProviderDisponibility)
    private readonly providerDisponibilityRepository: Repository<ProviderDisponibility>,
  ) {}

  async findAll(
    paginationDto: PaginationDto,
    search?: string,
  ): Promise<PaginatedResult<ProviderDisponibility>> {
    const {
      page = 1,
      limit = 10,
      sort = 'createdAt',
      order = 'DESC',
    } = paginationDto;

    const skip = (page - 1) * limit;

    // Sinon, tri classique
    const whereCondition: FindOptionsWhere<ProviderDisponibility> = {};
    if (search) {
      whereCondition.providerDisponibilityName = ILike(`%${search}%`);
    }

    const orderBy: Record<string, 'ASC' | 'DESC'> = {};
    if (sort) {
      orderBy[sort] = order?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    }

    const [providerDisponibilities, total] = await this.providerDisponibilityRepository.findAndCount({
      where: whereCondition,
      relations: ['createdBy'],
      skip,
      take: limit,
      order: orderBy,
    });

    return {
      data: providerDisponibilities,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async create(createProviderDisponibilityDto: CreateProviderDisponibilityDto, createdBy: string) {
    const existingProviderDisponibility = await this.providerDisponibilityRepository.findOne({
      where: {
        providerDisponibilityName: createProviderDisponibilityDto.providerDisponibilityName,
      },
    });

    if (existingProviderDisponibility) {
      throw new BadRequestException('Une disponibilité fournisseur avec ce nom existe déjà');
    }

    const providerDisponibility = this.providerDisponibilityRepository.create({
      ...createProviderDisponibilityDto,
      createdBy: { id: createdBy } as User,
    });

    return this.providerDisponibilityRepository.save(providerDisponibility);
  }

  async findOne(id: string): Promise<ProviderDisponibility> {
    const providerDisponibility = await this.providerDisponibilityRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    });

    if (!providerDisponibility) {
      throw new BadRequestException('Disponibilité fournisseur non trouvé');
    }

    return providerDisponibility;
  }

  async update(
    id: string,
    updateProviderDisponibilityDto: UpdateProviderDisponibilityDto,
    updatedBy: string,
  ): Promise<ProviderDisponibility> {
    const providerDisponibility = await this.findOne(id);
    if (
      updateProviderDisponibilityDto.providerDisponibilityName &&
      updateProviderDisponibilityDto.providerDisponibilityName !== providerDisponibility.providerDisponibilityName
    ) {
      const existingProviderDisponibility = await this.providerDisponibilityRepository.findOne({
        where: {
          providerDisponibilityName: updateProviderDisponibilityDto.providerDisponibilityName,
        },
      });
      if (existingProviderDisponibility) {
        throw new BadRequestException(
          'Une disponibilité fournisseur avec ce nom existe déjà',
        );
      }
    }
    Object.assign(providerDisponibility, updateProviderDisponibilityDto, {
      updatedBy: { id: updatedBy } as User,
    });

    return this.providerDisponibilityRepository.save(providerDisponibility);
  }

  async remove(id: string, deletedBy: string): Promise<void> {
    const providerDisponibility = await this.findOne(id);

    providerDisponibility.deletedBy = { id: deletedBy } as User;
    await this.providerDisponibilityRepository.save(providerDisponibility);

    await this.providerDisponibilityRepository.softDelete(id);
  }
}
