import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Provider } from './entities/provider.entity';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginatedResult } from 'src/common/interfaces/paginated-result.interface';
import { CreateProviderDto } from './dto/create-provider.dto';
import { User } from 'src/users/entities/user.entity';
import { UpdateProviderDto } from './dto/update-provider.dto';

@Injectable()
export class ProvidersService {
  constructor(
    @InjectRepository(Provider)
    private readonly providerRepository: Repository<Provider>,
  ) {}

  async findAll(
    paginationDto: PaginationDto,
    search?: string,
  ): Promise<PaginatedResult<Provider>> {
    const {
      page = 1,
      limit = 10,
      sort = 'createdAt',
      order = 'DESC',
    } = paginationDto;

    const skip = (page - 1) * limit;

    // Sinon, tri classique
    const whereCondition: FindOptionsWhere<Provider> = {};
    if (search) {
      whereCondition.providerName = ILike(`%${search}%`);
    }

    const orderBy: Record<string, 'ASC' | 'DESC'> = {};
    if (sort) {
      orderBy[sort] = order?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    }

    const [providers, total] = await this.providerRepository.findAndCount({
      where: whereCondition,
      relations: ['createdBy'],
      skip,
      take: limit,
      order: orderBy,
    });

    return {
      data: providers,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async create(createProviderDto: CreateProviderDto, createdBy: string) {
    const existingProvider = await this.providerRepository.findOne({
      where: {
        providerName: createProviderDto.providerName,
        providerCode: createProviderDto.providerCode,
      },
    });

    if (existingProvider) {
      throw new BadRequestException('Un fournisseur avec ce nom existe déjà');
    }

    const provider = this.providerRepository.create({
      ...createProviderDto,
      createdBy: { id: createdBy } as User,
    });

    return this.providerRepository.save(provider);
  }

  async findOne(id: string): Promise<Provider> {
    const provider = await this.providerRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    });

    if (!provider) {
      throw new BadRequestException('Fournisseur non trouvé');
    }

    return provider;
  }

  async providersList(): Promise<Provider[]> {
    return this.providerRepository.find({
      select: ['id', 'providerName', 'providerCode'],
      order: { providerName: 'ASC' },
    });
  }

  async update(
    id: string,
    updateProviderDto: UpdateProviderDto,
    updatedBy: string,
  ): Promise<Provider> {
    const provider = await this.findOne(id);
    if (
      updateProviderDto.providerName &&
      updateProviderDto.providerName !== provider.providerName
    ) {
      const existingProvider = await this.providerRepository.findOne({
        where: {
          providerName: updateProviderDto.providerName,
          providerCode: updateProviderDto.providerCode,
        },
      });
      if (existingProvider) {
        throw new BadRequestException('Un fournisseur avec ce nom existe déjà');
      }
    }
    Object.assign(provider, updateProviderDto, {
      updatedBy: { id: updatedBy } as User,
    });

    return this.providerRepository.save(provider);
  }

  async remove(id: string, deletedBy: string): Promise<void> {
    const provider = await this.findOne(id);

    provider.deletedBy = { id: deletedBy } as User;
    await this.providerRepository.save(provider);

    await this.providerRepository.softDelete(id);
  }
}
