import { Flow } from '../../flows/entities/flow.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeliverableDelayFlow } from '../entities/deliverable-delay-flow.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { CreateDeliverableDelayFlowDto } from '../dto/create-deliverable-delay-flow.dto';
import { assertUniqueFields } from '../../common/utils/assert-unique-fields';
import { ERROR_MESSAGES } from '../../common/constants/error-messages.constant';
import { User } from '../../users/entities/user.entity';
import { DeliverableDelayRequestType } from '../../deliverable-delay-request-types/entities/deliverable-delay-request-type.entity';

@Injectable()
export class DeliverableDelayFlowsService {
  /**
   * Service pour gérer les délais de livraison des flux
   * @param deliverableDelayRequestTypeRepository Repository pour les types de demande de délai de livraison
   * @param flowRepository Repository pour les flux
   * @param deliverableDelayFlowRepository Repository pour les délais de livraison des flux
   */
  constructor(
    @InjectRepository(DeliverableDelayRequestType)
    private readonly deliverableDelayRequestTypeRepository: Repository<DeliverableDelayRequestType>,
    @InjectRepository(Flow)
    private readonly flowRepository: Repository<Flow>,
    @InjectRepository(DeliverableDelayFlow)
    private readonly deliverableDelayFlowRepository: Repository<DeliverableDelayFlow>,
  ) {}

  /**
   * Récupère tous les délais de livraison des flux avec pagination et recherche
   * @param paginationDto DTO de pagination
   * @param search Termes de recherche optionnels
   * @returns Liste paginée des délais de livraison des flux
   */
  async findAll(paginationDto: PaginationDto, search?: string) {
    const {
      page = 1,
      limit = 10,
      sort = 'createdAt',
      order = 'DESC',
    } = paginationDto;
    const skip = (page - 1) * limit;

    // Whitelist des champs triables pour éviter les injections SQL
    const sortableFields = ['createdAt', 'updatedAt'];
    const sortField = sortableFields.includes(sort) ? sort : 'createdAt';

    const qb = this.deliverableDelayFlowRepository
      .createQueryBuilder('ddf')
      .leftJoinAndSelect('ddf.flow', 'flow')
      .leftJoinAndSelect('ddf.deliverableDelayRequestType', 'ddrt')
      .leftJoinAndSelect('ddrt.requestTypeServiceCategory', 'rtsc')
      .leftJoinAndSelect('ddrt.deliverable', 'deliverable')
      .leftJoinAndSelect('rtsc.requestType', 'rt')
      .leftJoinAndSelect('rtsc.serviceCategory', 'sc')
      .leftJoinAndSelect('sc.service', 'svc')
      .leftJoinAndSelect('svc.sector', 'sector')
      .select([
        'ddf.id',
        'ddf.createdAt',
        'flow.id',
        'flow.flowName',
        'rtsc.id',
        'rt.requestTypeName',
        'sc.serviceCategoryName',
        'svc.serviceName',
        'sector.sectorName',
        'ddrt.id',
        'deliverable.id',
        'deliverable.deliverableName',
      ])
      .skip(skip)
      .take(limit)
      .orderBy(
        `ddf.${sortField}`,
        order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC',
      );

    if (search) {
      qb.andWhere(
        `sector.sectorName ILIKE :search OR svc.serviceName ILIKE :search OR sc.serviceCategoryName ILIKE :search OR rt.requestTypeName ILIKE :search OR flow.flowName ILIKE :search`,
        { search: `%${search}%` },
      );
    }

    const [items, total] = await qb.getManyAndCount();

    return {
      data: items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Récupère tous les délais de livraison des flux pour un type de demande spécifique
   * @param deliverableDelayRequestTypeId ID du type de demande de délai de livraison
   * @returns Liste des délais de livraison des flux pour le type de demande spécifié
   */
  async create(dto: CreateDeliverableDelayFlowDto, createdBy: string) {
    await assertUniqueFields<DeliverableDelayFlow>(
      this.deliverableDelayFlowRepository,
      {
        flow: dto.flowId,
        deliverableDelayRequestType: dto.deliverableDelayRequestTypeId,
      },
      undefined,
      `${ERROR_MESSAGES.CREATE} ${ERROR_MESSAGES.UNIQUE_CONSTRAINT}`,
    );

    const deliverableDelayRequestType =
      await this.deliverableDelayRequestTypeRepository.findOne({
        where: { id: dto.deliverableDelayRequestTypeId },
      });
    if (!deliverableDelayRequestType) {
      throw new BadRequestException(
        `${ERROR_MESSAGES.CREATE} ${ERROR_MESSAGES.NOT_FOUND}`,
      );
    }

    const flow = await this.flowRepository.findOne({
      where: { id: dto.flowId },
    });
    if (!flow) {
      throw new BadRequestException(
        `${ERROR_MESSAGES.CREATE} ${ERROR_MESSAGES.NOT_FOUND}`,
      );
    }

    const entity = this.deliverableDelayFlowRepository.create({
      ...dto,
      deliverableDelayRequestType,
      flow,
      createdBy: { id: createdBy } as User,
    });

    return this.deliverableDelayFlowRepository.save(entity);
  }

  /**
   * Récupère un délai de livraison des flux par son ID
   * @param id ID du délai de livraison des flux
   * @returns Délai de livraison des flux trouvé
   */
  async findOne(id: string) {
    const entity = await this.deliverableDelayFlowRepository.findOne({
      where: { id },
      relations: [
        'flow',
        'deliverableDelayRequestType',
        'deliverableDelayRequestType.requestTypeServiceCategory',
        'deliverableDelayRequestType.requestTypeServiceCategory.serviceCategory',
        'deliverableDelayRequestType.requestTypeServiceCategory.serviceCategory.service',
        'deliverableDelayRequestType.requestTypeServiceCategory.serviceCategory.service.sector',
      ],
    });

    if (!entity) {
      throw new BadRequestException(
        `${ERROR_MESSAGES.FETCH} ${ERROR_MESSAGES.NOT_FOUND}`,
      );
    }

    return entity;
  }

  /**
   * Met à jour un délai de livraison des flux
   * @param id ID du délai de livraison des flux à mettre à jour
   * @param dto DTO de mise à jour
   * @param updatedBy ID de l'utilisateur qui met à jour
   * @returns Délai de livraison des flux mis à jour
   */
  async update(
    id: string,
    dto: CreateDeliverableDelayFlowDto,
    updatedBy: string,
  ) {
    const entity = await this.findOne(id);

    if (dto.deliverableDelayRequestTypeId) {
      const deliverableDelayRequestType =
        await this.deliverableDelayRequestTypeRepository.findOne({
          where: { id: dto.deliverableDelayRequestTypeId },
        });
      if (!deliverableDelayRequestType) {
        throw new BadRequestException(
          'Impossible de modifier : le type de demande de délai de livraison est introuvable avec cet identifiant.',
        );
      }
      entity.deliverableDelayRequestType = deliverableDelayRequestType;
    }

    if (dto.flowId) {
      const flow = await this.flowRepository.findOne({
        where: { id: dto.flowId },
      });
      if (!flow) {
        throw new BadRequestException(
          'Impossible de modifier : le flux est introuvable avec cet identifiant.',
        );
      }
      entity.flow = flow;
    }

    if (dto.deliverableDelayRequestTypeId && dto.flowId) {
      const existing = await this.deliverableDelayFlowRepository.findOne({
        where: {
          deliverableDelayRequestType: {
            id: dto.deliverableDelayRequestTypeId,
          },
          flow: { id: dto.flowId },
        },
      });
      if (existing && existing.id !== id) {
        throw new BadRequestException(
          'Impossible de modifier : un délai de livraison des flux avec ce type de demande et ce flux, car un enregistrement similaire existe déjà.',
        );
      }
    }

    Object.assign(entity, dto);
    entity.updatedBy = { id: updatedBy } as User;

    return this.deliverableDelayFlowRepository.save(entity);
  }

  /**
   * Supprime un délai de livraison des flux par son ID
   * @param id ID du délai de livraison des flux à supprimer
   * @param deletedBy ID de l'utilisateur qui supprime
   */
  async remove(id: string, deletedBy: string): Promise<void> {
    const entity = await this.deliverableDelayFlowRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new BadRequestException(
        `${ERROR_MESSAGES.DELETE} ${ERROR_MESSAGES.NOT_FOUND}`,
      );
    }

    entity.deletedBy = { id: deletedBy } as User;
    await this.deliverableDelayFlowRepository.save(entity);

    await this.deliverableDelayFlowRepository.softDelete(id);
  }
}
