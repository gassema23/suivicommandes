import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Flow } from '../entities/flow.entity';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';
import { CreateFlowDto } from '../dto/create-flow.dto';
import { User } from '../../users/entities/user.entity';
import { UpdateFlowDto } from '../dto/update-flow.dto';

@Injectable()
export class FlowsService {
  /**
   * Service pour gérer les flux de transmission.
   * Permet de créer, lire, mettre à jour et supprimer des flux.
u   * @param flowRepository - Repository pour l'entité Flow.
   */
  constructor(
    @InjectRepository(Flow)
    private readonly flowRepository: Repository<Flow>,
  ) {}

  /**
   * Récupère tous les flux de transmission avec pagination et recherche.
   * @param paginationDto - DTO pour la pagination.
   * @param search - Termes de recherche optionnels.
   * @returns Un objet PaginatedResult contenant les flux et les métadonnées de pagination.
   */
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

  /**
   * Crée un nouveau flux de transmission.
   * @param createFlowDto - DTO contenant les informations du flux à créer.
   * @param createdBy - ID de l'utilisateur qui crée le flux.
   * @returns Le flux créé.
   * @throws BadRequestException si un flux avec le même nom existe déjà.
   */
  async create(createFlowDto: CreateFlowDto, createdBy: string) {
    const existingFlow = await this.flowRepository.findOne({
      where: {
        flowName: createFlowDto.flowName,
      },
    });

    if (existingFlow) {
      throw new BadRequestException(
        'Impossible de créer : un flux de transmission avec ce nom existe déjà.',
      );
    }

    const flow = this.flowRepository.create({
      ...createFlowDto,
      createdBy: { id: createdBy } as User,
    });

    return this.flowRepository.save(flow);
  }

  /**
   * Récupère un flux de transmission par son ID.
   * @param id - ID du flux à récupérer.
   * @returns Le flux trouvé.
   * @throws BadRequestException si aucun flux n'est trouvé avec cet ID.
   */
  async findOne(id: string): Promise<Flow> {
    const flow = await this.flowRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    });

    if (!flow) {
      throw new BadRequestException(
        'Aucun flux de transmission trouvé avec cet identifiant.',
      );
    }

    return flow;
  }

  /**
   * Met à jour un flux de transmission.
   * @param id - ID du flux à mettre à jour.
   * @param updateFlowDto - DTO contenant les informations mises à jour.
   * @param updatedBy - ID de l'utilisateur qui met à jour le flux.
   * @returns Le flux mis à jour.
   * @throws BadRequestException si un flux avec le même nom existe déjà.
   */
  async update(
    id: string,
    updateFlowDto: UpdateFlowDto,
    updatedBy: string,
  ): Promise<Flow> {
    const flow = await this.findOne(id);
    if (updateFlowDto.flowName && updateFlowDto.flowName !== flow.flowName) {
      const existingFlow = await this.flowRepository.findOne({
        where: {
          flowName: updateFlowDto.flowName,
        },
      });
      if (existingFlow) {
        throw new BadRequestException(
          'Impossible de modifier : un flux de transmission avec ce nom existe déjà.',
        );
      }
    }
    Object.assign(flow, updateFlowDto, {
      updatedBy: { id: updatedBy } as User,
    });

    return this.flowRepository.save(flow);
  }

  /**
   * Supprime un flux de transmission.
   * @param id - ID du flux à supprimer.
   * @param deletedBy - ID de l'utilisateur qui supprime le flux.
   * @throws BadRequestException si le flux n'est pas trouvé.
   */
  async remove(id: string, deletedBy: string): Promise<void> {
    const flow = await this.findOne(id);

    flow.deletedBy = { id: deletedBy } as User;
    await this.flowRepository.save(flow);

    await this.flowRepository.softDelete(id);
  }
}
