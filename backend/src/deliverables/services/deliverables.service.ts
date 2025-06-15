import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Deliverable } from '../entities/deliverable.entity';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';
import { CreateDeliverableDto } from '../dto/create-deliverable.dto';
import { User } from '../../users/entities/user.entity';
import { UpdateDeliverableDto } from '../dto/update-deliverable.dto';

@Injectable()
export class DeliverablesService {
  /**
   * Service for managing deliverables.
   * Provides methods to create, read, update, and delete deliverables.
   * @param deliverableRepository - Repository for handling database operations related to deliverables.
   */
  constructor(
    @InjectRepository(Deliverable)
    private readonly deliverableRepository: Repository<Deliverable>,
  ) {}

  /**
   * Retrieves a paginated list of deliverables with optional search functionality.
   * @param paginationDto - DTO containing pagination and sorting parameters.
   * @param search - Optional search term to filter deliverables by name.
   * @returns A paginated result containing the list of deliverables and metadata.
   */
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

    const [deliverables, total] = await this.deliverableRepository.findAndCount(
      {
        where: whereCondition,
        relations: ['createdBy'],
        skip,
        take: limit,
        order: orderBy,
      },
    );

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

  /**
   * Creates a new deliverable.
   * Checks if a deliverable with the same name already exists before creating.
   * @param createDeliverableDto - DTO containing the details of the deliverable to create.
   * @param createdBy - ID of the user creating the deliverable.
   * @returns The created deliverable.
   */
  async create(createDeliverableDto: CreateDeliverableDto, createdBy: string) {
    const existingDeliverable = await this.deliverableRepository.findOne({
      where: {
        deliverableName: createDeliverableDto.deliverableName,
      },
    });

    if (existingDeliverable) {
      throw new BadRequestException(
        'Impossible de créer : un livrable avec ce nom existe déjà.',
      );
    }

    const deliverable = this.deliverableRepository.create({
      ...createDeliverableDto,
      createdBy: { id: createdBy } as User,
    });

    return this.deliverableRepository.save(deliverable);
  }

  /**
   * Finds a deliverable by its ID.
   * Throws an error if the deliverable does not exist.
   * @param id - ID of the deliverable to find.
   * @returns The found deliverable.
   */
  async findOne(id: string): Promise<Deliverable> {
    const deliverable = await this.deliverableRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    });

    if (!deliverable) {
      throw new BadRequestException(
        'Aucun livrable trouvé avec cet identifiant.',
      );
    }

    return deliverable;
  }

  /**
   * Updates an existing deliverable.
   * Checks if the new deliverable name already exists before updating.
   * @param id - ID of the deliverable to update.
   * @param updateDeliverableDto - DTO containing the updated details of the deliverable.
   * @param updatedBy - ID of the user updating the deliverable.
   * @returns The updated deliverable.
   */
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
          'Impossible de modifier : un livrable avec ce nom existe déjà.',
        );
      }
    }
    Object.assign(deliverable, updateDeliverableDto, {
      updatedBy: { id: updatedBy } as User,
    });

    return this.deliverableRepository.save(deliverable);
  }

  /**
   * Removes a deliverable by its ID.
   * Marks the deliverable as deleted and records the user who deleted it.
   * @param id - ID of the deliverable to remove.
   * @param deletedBy - ID of the user deleting the deliverable.
   */
  async remove(id: string, deletedBy: string): Promise<void> {
    const deliverable = await this.findOne(id);

    deliverable.deletedBy = { id: deletedBy } as User;
    await this.deliverableRepository.save(deliverable);

    await this.deliverableRepository.softDelete(id);
  }
}
