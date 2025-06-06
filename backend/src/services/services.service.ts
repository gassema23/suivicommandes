import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { Sector } from '../sectors/entities/sectors.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResult } from '../common/interfaces/paginated-result.interface';
import { CreateServiceDto } from './dto/create-service.dto';
import { User } from '../users/entities/user.entity';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ServiceCategory } from '../service-categories/entities/service-category.entity';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    @InjectRepository(Sector)
    private readonly sectorRepository: Repository<Sector>,
  ) {}

  async findAll(
    paginationDto: PaginationDto,
    search?: string,
  ): Promise<PaginatedResult<Service>> {
    const {
      page = 1,
      limit = 10,
      sort = 'createdAt',
      order = 'DESC',
    } = paginationDto;
    const skip = (page - 1) * limit;

    // Sinon, tri classique
    const whereCondition: FindOptionsWhere<Service> = {};
    if (search) {
      whereCondition.serviceName = ILike(`%${search}%`);
    }

    const orderBy: Record<string, 'ASC' | 'DESC'> = {};
    if (sort) {
      orderBy[sort] = order?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    }

    const [services, total] = await this.serviceRepository.findAndCount({
      where: whereCondition,
      relations: ['sector', 'createdBy'],
      skip,
      take: limit,
      order: orderBy,
    });

    return {
      data: services,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Service> {
    const service = await this.serviceRepository.findOne({
      where: { id },
      relations: ['sector', 'createdBy', 'serviceCategories'],
    });

    if (!service) {
      throw new BadRequestException('Service introuvable');
    }

    return service;
  }

  async getServicesList(): Promise<Service[]> {
    return this.serviceRepository.find({
      select: ['id', 'serviceName'],
      order: { serviceName: 'ASC' },
    });
  }

  async getServiceCategoriesByServiceId(
    id: string,
  ): Promise<ServiceCategory[]> {
    const service = await this.serviceRepository.findOne({
      where: { id },
      relations: ['serviceCategories'],
    });

    if (!service?.serviceCategories) {
      throw new BadRequestException('Catégorie de services non trouvé');
    }

    return service.serviceCategories;
  }

  async create(createServiceDto: CreateServiceDto, createdBy: string) {
    const existingService = await this.serviceRepository.findOne({
      where: {
        serviceName: createServiceDto.serviceName,
        sector: { id: createServiceDto.sectorId },
      },
      relations: ['sector'],
    });

    if (existingService) {
      throw new BadRequestException('Un service avec ce nom existe déjà');
    }

    // Récupère l'entité secteur
    const sector = await this.sectorRepository.findOne({
      where: { id: createServiceDto.sectorId },
    });
    if (!sector) {
      throw new BadRequestException('Secteur introuvable');
    }

    const service = this.serviceRepository.create({
      ...createServiceDto,
      sector,
      createdBy: { id: createdBy } as User,
    });

    return this.serviceRepository.save(service);
  }

  async update(
    id: string,
    updateServiceDto: UpdateServiceDto,
    updatedBy: string,
  ): Promise<Service> {
    const service = await this.serviceRepository.findOne({
      where: { id },
      relations: ['sector', 'createdBy'],
    });

    if (!service) {
      throw new BadRequestException('Service introuvable');
    }

    if (
      updateServiceDto.serviceName &&
      updateServiceDto.serviceName !== service.serviceName
    ) {
      const existingService = await this.serviceRepository.findOne({
        where: {
          serviceName: updateServiceDto.serviceName,
          sector: { id: updateServiceDto.sectorId },
        },
        relations: ['sector'],
      });
      if (existingService) {
        throw new BadRequestException('Un secteur avec ce nom existe déjà');
      }
    }

    if (
      updateServiceDto.sectorId &&
      (!service.sector || service.sector.id !== updateServiceDto.sectorId)
    ) {
      const newSector = await this.sectorRepository.findOne({
        where: { id: updateServiceDto.sectorId },
      });
      if (!newSector) {
        throw new BadRequestException('Secteur introuvable');
      }
      service.sector = newSector;
    }

    Object.assign(service, updateServiceDto, {
      updatedBy: { id: updatedBy } as User,
    });

    return this.serviceRepository.save(service);
  }

  async remove(id: string, deletedBy: string): Promise<void> {
    const service = await this.serviceRepository.findOne({
      where: { id },
      relations: ['serviceCategories', 'deletedBy'],
    });

    if (!service) {
      throw new BadRequestException('Service introuvable');
    }

    if (service.serviceCategories && service.serviceCategories.length > 0) {
      throw new BadRequestException(
        'Impossible de supprimer le service car il est lié à des catégories de services',
      );
    }

    service.deletedBy = { id: deletedBy } as User;
    await this.serviceRepository.save(service);

    await this.serviceRepository.softDelete(id);
  }
}
