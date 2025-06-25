import { Body, Controller, Post } from '@nestjs/common';
import { DeadlineService } from '../services/deadline.service';
import { CalculateDeadlineDto } from '../dto/calculate-deadline.dto';
import { Permissions } from '@/roles/decorators/permission.decorator';
import { Action } from '@/roles/enums/action.enum';
import { Resource } from '@/roles/enums/resource.enum';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { DataToCalculateDeadlineDto } from '../dto/data-to-calculate-deadline.dto';

@Controller('deadline')
export class DeadlineController {
  constructor(private readonly deadlineService: DeadlineService) {}

  /**
   * Endpoint to calculate the deadline based on the provided parameters.
   * @param dto - The DTO containing the start date and delay in days.
   * @returns The calculated deadline.
   */
  @Post('calculate')
  calculate(@Body() dto: CalculateDeadlineDto) {
    return this.deadlineService.calculateDeadline(dto);
  }

  @Post('get-data-to-calculate-deadline')
  @Permissions([
    {
      resource: Resource.REQUEST_TYPE_SERVICE_CATEGORIES,
      actions: [Action.READ],
    },
  ])
  @ApiOperation({
    summary:
      'Récupérer les données nécessaires pour calculer le délai de traitement',
  })
  @ApiResponse({
    status: 200,
    description:
      'Données récupérées avec succès pour le calcul du délai de traitement',
  })
  @ApiQuery({
    name: 'requestTypeServiceCategoryId',
    required: true,
    description:
      'ID de la catégorie de service pour laquelle le délai doit être calculé',
  })
  async getDataToCalculateDeadline(@Body() dto: DataToCalculateDeadlineDto) {
    return this.deadlineService.getDataToCalculateDeadline(dto);
  }
}
