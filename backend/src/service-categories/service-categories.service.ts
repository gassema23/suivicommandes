import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from 'src/services/entities/service.entity';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { ServiceCategory } from './entities/service-category.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginatedResult } from 'src/common/interfaces/paginated-result.interface';

@Injectable()
export class ServiceCategoriesService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    @InjectRepository(ServiceCategory)
    private readonly serviceCategoryRepository: Repository<ServiceCategory>,
  ) {}

   async findAll(
      paginationDto: PaginationDto,
      search?: string,
    ): Promise<PaginatedResult<ServiceCategory>> {
      const {
        page = 1,
        limit = 10,
        sort = 'createdAt',
        order = 'DESC',
      } = paginationDto;
      const skip = (page - 1) * limit;
  
      // Sinon, tri classique
      const whereCondition: FindOptionsWhere<ServiceCategory> = {};
      if (search) {
        whereCondition.serviceCategoryName = ILike(`%${search}%`);
      }
  
      const orderBy: Record<string, 'ASC' | 'DESC'> = {};
      if (sort) {
        orderBy[sort] = order?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
      }
  
      const [serviceCategories, total] = await this.serviceCategoryRepository.findAndCount({
        where: whereCondition,
        relations: ['service', 'createdBy'],
        skip,
        take: limit,
        order: orderBy,
      });
  
      return {
        data: serviceCategories,
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    }
  
}
