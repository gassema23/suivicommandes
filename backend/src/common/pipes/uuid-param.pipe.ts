import { BadRequestException, ParseUUIDPipe } from '@nestjs/common';

export class UuidParamPipe extends ParseUUIDPipe {
  constructor() {
    super({
      version: '4',
      exceptionFactory: () =>
        new BadRequestException("Le format de l'identifiant n'est pas valide."),
    });
  }
}