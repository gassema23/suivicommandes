import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RequisitionType } from '../entities/requisition-type.entity';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';
import { CreateRequisitionTypeDto } from '../dto/create-requisition-type.dto';
import { User } from '../../users/entities/user.entity';
import { UpdateRequisitionTypeDto } from '../dto/update-requisition-type.dto';

@Injectable()
export class RequisitionTypesService {
  /**
   * Service for managing requisition types.
   * Provides methods to create, read, update, and delete requisition types.
   * @param requisitionTypeRepository - Repository for handling database operations related to requisition types.
   */
  constructor(
    @InjectRepository(RequisitionType)
    private readonly requisitionTypeRepository: Repository<RequisitionType>,
  ) {}

  /**
   * Retrieves all requisition types with pagination and optional search.
   * @param paginationDto - DTO containing pagination parameters.
   * @param search - Optional search term to filter requisition types by name.
   * @returns A paginated result containing the requisition types and metadata.
   */
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

  /**
   * Creates a new requisition type.
   * Checks if a requisition type with the same name already exists before creating.
   * @param createRequisitionTypeDto - DTO containing the details of the requisition type to create.
   * @param createdBy - The ID of the user who is creating the requisition type.
   * @returns The created requisition type.
   * @throws BadRequestException if a requisition type with the same name already exists.
   */
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
        'Impossible de créer : un type de réquisition avec ce nom existe déjà.',
      );
    }

    const requisitionType = this.requisitionTypeRepository.create({
      ...createRequisitionTypeDto,
      createdBy: { id: createdBy } as User,
    });

    return this.requisitionTypeRepository.save(requisitionType);
  }

  /**
   * Finds a requisition type by its ID.
   * @param id - The ID of the requisition type to find.
   * @returns The found requisition type.
   * @throws BadRequestException if no requisition type is found with the given ID.
   */
  async findOne(id: string): Promise<RequisitionType> {
    const requisitionType = await this.requisitionTypeRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    });

    if (!requisitionType) {
      throw new BadRequestException(
        'Impossible de trouver : aucun type de réquisition trouvé avec cet identifiant.',
      );
    }

    return requisitionType;
  }

  /**
   * Updates a requisition type by its ID.
   * Checks if the new requisition type name already exists before updating.
   * @param id - The ID of the requisition type to update.
   * @param updateRequisitionTypeDto - DTO containing the updated details.
   * @param updatedBy - The ID of the user who is updating the requisition type.
   * @returns The updated requisition type.
   */
  async update(
    id: string,
    updateRequisitionTypeDto: UpdateRequisitionTypeDto,
    updatedBy: string,
  ): Promise<RequisitionType> {
    const requisitionType = await this.findOne(id);
    if (
      updateRequisitionTypeDto.requisitionTypeName &&
      updateRequisitionTypeDto.requisitionTypeName !==
        requisitionType.requisitionTypeName
    ) {
      const existingDelayType = await this.requisitionTypeRepository.findOne({
        where: {
          requisitionTypeName: updateRequisitionTypeDto.requisitionTypeName,
        },
      });
      if (existingDelayType) {
        throw new BadRequestException(
          'Impossible de modifier : un type de réquisition avec ce nom existe déjà.',
        );
      }
    }
    Object.assign(requisitionType, updateRequisitionTypeDto, {
      updatedBy: { id: updatedBy } as User,
    });

    return this.requisitionTypeRepository.save(requisitionType);
  }

  /**
   * Removes a requisition type by its ID.
   * Marks the requisition type as deleted and sets the user who deleted it.
   * @param id - The ID of the requisition type to remove.
   * @param deletedBy - The ID of the user who is deleting the requisition type.
   */
  async remove(id: string, deletedBy: string): Promise<void> {
    const requisitionType = await this.findOne(id);

    requisitionType.deletedBy = { id: deletedBy } as User;
    await this.requisitionTypeRepository.save(requisitionType);

    await this.requisitionTypeRepository.softDelete(id);
  }
}
