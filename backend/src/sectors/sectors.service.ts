import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Sector } from './entities/sectors.entity';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResult } from '../common/interfaces/paginated-result.interface';
import { CreateSectorDto } from './dto/create-sector.dto';
import { User } from '../users/entities/user.entity';
import { UpdateSectorDto } from './dto/update-sector.dto';
import { Service } from '../services/entities/service.entity';

@Injectable()
export class SectorsService {
  constructor(
    @InjectRepository(Sector)
    private readonly sectorRepository: Repository<Sector>,
  ) {}

  async findAll(
    paginationDto: PaginationDto,
    search?: string,
  ): Promise<PaginatedResult<Sector>> {
    const {
      page = 1,
      limit = 10,
      sort = 'createdAt',
      order = 'DESC',
    } = paginationDto;

    const skip = (page - 1) * limit;

    // Sinon, tri classique
    const whereCondition: FindOptionsWhere<Sector> = {};
    if (search) {
      whereCondition.sectorName = ILike(`%${search}%`);
    }

    const orderBy: Record<string, 'ASC' | 'DESC'> = {};
    if (sort) {
      orderBy[sort] = order?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    }

    const [sectors, total] = await this.sectorRepository.findAndCount({
      where: whereCondition,
      relations: ['createdBy'],
      skip,
      take: limit,
      order: orderBy,
    });

    return {
      data: sectors,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async create(createSectorDto: CreateSectorDto, createdBy: string) {
    const existingSector = await this.sectorRepository.findOne({
      where: {
        sectorName: createSectorDto.sectorName,
      },
    });

    if (existingSector) {
      throw new BadRequestException('Un secteur avec ce nom existe déjà');
    }

    const sector = this.sectorRepository.create({
      ...createSectorDto,
      createdBy: { id: createdBy } as User,
    });

    return this.sectorRepository.save(sector);
  }

  async findOne(id: string): Promise<Sector> {
    const sector = await this.sectorRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    });

    if (!sector) {
      throw new BadRequestException('Secteur non trouvé');
    }

    return sector;
  }

  async getServicesBySectorId(id: string): Promise<Service[]> {
    const sector = await this.sectorRepository.findOne({
      where: { id },
      relations: ['services'],
    });

    if (!sector?.services) {
      throw new BadRequestException('Services non trouvé');
    }

    return sector.services;
  }

  async update(
    id: string,
    updateSectorDto: UpdateSectorDto,
    updatedBy: string,
  ): Promise<Sector> {
    const sector = await this.findOne(id);
    if (
      updateSectorDto.sectorName &&
      updateSectorDto.sectorName !== sector.sectorName
    ) {
      const existingSector = await this.sectorRepository.findOne({
        where: {
          sectorName: updateSectorDto.sectorName,
        },
      });
      if (existingSector) {
        throw new BadRequestException('Un secteur avec ce nom existe déjà');
      }
    }
    Object.assign(sector, updateSectorDto, {
      updatedBy: { id: updatedBy } as User,
    });

    return this.sectorRepository.save(sector);
  }

  async remove(id: string, deletedBy: string): Promise<void> {
    const sector = await this.sectorRepository.findOne({
      where: { id },
      relations: ['services', 'deletedBy'],
    });

    if (!sector) {
      throw new BadRequestException('Secteur non trouvé');
    }
    if (sector.services && sector.services.length > 0) {
      throw new BadRequestException(
        'Impossible de supprimer un secteur avec des services associés',
      );
    }

    sector.deletedBy = { id: deletedBy } as User;
    await this.sectorRepository.save(sector);

    await this.sectorRepository.softDelete(id);
  }

  async getSectorsList(): Promise<Sector[]> {
    return this.sectorRepository.find({
      select: ['id', 'sectorName'],
      order: { sectorName: 'ASC' },
    });
  }
}
