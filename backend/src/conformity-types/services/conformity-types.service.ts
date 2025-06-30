import { InjectRepository } from '@nestjs/typeorm';
import { CreateConformityTypeDto } from '../dto/create-conformity-type.dto';
import { User } from '../../users/entities/user.entity';
import { ConformityType } from '../entities/conformity-type.entity';
import { UpdateConformityTypeDto } from '../dto/update-conformity-type.dto';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';
import { BadRequestException, Injectable } from '@nestjs/common';
import { assertUniqueFields } from '../../common/utils/assert-unique-fields';
import { ERROR_MESSAGES } from '../../common/constants/error-messages.constant';

@Injectable()
export class ConformityTypesService {
  /**
   * Service for managing conformity types.
   * Provides methods to create, read, update, and delete conformity types.
   * @param conformityTypeRepository - Repository for handling database operations related to conformity types.
   */
  constructor(
    @InjectRepository(ConformityType)
    private readonly conformityTypeRepository: Repository<ConformityType>,
  ) {}

  /**
   * Retrieves a paginated list of conformity types with optional search functionality.
   * @param paginationDto - DTO containing pagination parameters.
   * @param search - Optional search term to filter conformity types by name.
   * @returns A paginated result containing conformity types and metadata.
   */
  async findAll(
    paginationDto: PaginationDto,
    search?: string,
  ): Promise<PaginatedResult<ConformityType>> {
    const {
      page = 1,
      limit = 10,
      sort = 'createdAt',
      order = 'DESC',
    } = paginationDto;

    const skip = (page - 1) * limit;

    // Sinon, tri classique
    const whereCondition: FindOptionsWhere<ConformityType> = {};
    if (search) {
      whereCondition.conformityTypeName = ILike(`%${search}%`);
    }

    const orderBy: Record<string, 'ASC' | 'DESC'> = {};
    if (sort) {
      orderBy[sort] = order?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    }

    const [conformityTypes, total] =
      await this.conformityTypeRepository.findAndCount({
        where: whereCondition,
        relations: ['createdBy'],
        skip,
        take: limit,
        order: orderBy,
      });

    return {
      data: conformityTypes,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Creates a new conformity type.
   * @param createConformityTypeDto - DTO containing the details of the conformity type to create.
   * @param createdBy - ID of the user creating the conformity type.
   * @returns The created conformity type.
   * @throws BadRequestException if a conformity type with the same name already exists.
   */
  async create(
    createConformityTypeDto: CreateConformityTypeDto,
    createdBy: string,
  ) {
    await assertUniqueFields(
      this.conformityTypeRepository,
      { conformityTypeName: createConformityTypeDto.conformityTypeName },
      undefined, // id à exclure pour l'update
      `${ERROR_MESSAGES.CREATE} ${ERROR_MESSAGES.UNIQUE_CONSTRAINT}`,
    );

    const conformityType = this.conformityTypeRepository.create({
      ...createConformityTypeDto,
      createdBy: { id: createdBy } as User,
    });

    return this.conformityTypeRepository.save(conformityType);
  }

  /**
   * Retrieves a conformity type by its ID.
   * @param id - The ID of the conformity type to retrieve.
   * @returns The conformity type with the specified ID.
   * @throws BadRequestException if the conformity type is not found.
   */
  async findOne(id: string): Promise<ConformityType> {
    const conformityType = await this.conformityTypeRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    });

    if (!conformityType) {
      throw new BadRequestException(ERROR_MESSAGES.NOT_FOUND);
    }

    return conformityType;
  }

  /**
   * Updates an existing conformity type.
   * Validates the new name to ensure it does not conflict with existing types.
   * @param id - The ID of the conformity type to update.
   * @param updateConformityTypeDto - DTO containing the updated details of the conformity type.
   * @param updatedBy - ID of the user updating the conformity type.
   * @returns The updated conformity type.
   * @throws BadRequestException if a conformity type with the same name already exists.
   */
  async update(
    id: string,
    updateConformityTypeDto: UpdateConformityTypeDto,
    updatedBy: string,
  ): Promise<ConformityType> {
    const conformityType = await this.findOne(id);

    await assertUniqueFields(
      this.conformityTypeRepository,
      { conformityTypeName: updateConformityTypeDto.conformityTypeName },
      id, // id à exclure pour l'update
      `${ERROR_MESSAGES.UPDATE} ${ERROR_MESSAGES.UNIQUE_CONSTRAINT}`,
    );

    Object.assign(conformityType, updateConformityTypeDto, {
      updatedBy: { id: updatedBy } as User,
    });

    return this.conformityTypeRepository.save(conformityType);
  }

  /**
   * Removes a conformity type by its ID.
   * Marks the conformity type as deleted and records the user who deleted it.
   * @param id - The ID of the conformity type to remove.
   * @param deletedBy - ID of the user deleting the conformity type.
   */
  async remove(id: string, deletedBy: string): Promise<void> {
    const conformityType = await this.findOne(id);

    if (!conformityType) {
      throw new BadRequestException(
        `${ERROR_MESSAGES.DELETE} type de conformité introuvable.`,
      );
    }

    conformityType.deletedBy = { id: deletedBy } as User;
    await this.conformityTypeRepository.save(conformityType);

    await this.conformityTypeRepository.softDelete(id);
  }
}
