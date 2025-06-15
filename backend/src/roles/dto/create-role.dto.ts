import { Type } from 'class-transformer';
import {
  ArrayUnique,
  IsArray,
  IsEnum,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Resource } from '../enums/resource.enum';
import { Action } from '../enums/action.enum';

export class CreateRoleDto {
  @IsString({ message: 'Le nom du rôle doit être une chaîne de caractères.' })
  roleName: string;

  @IsArray({ message: 'Les permissions doivent être un tableau.' })
  @ValidateNested({
    each: true,
    message: 'Chaque permission doit être un objet valide.',
  })
  @Type(() => Permission)
  permissions: Permission[];
}

export class Permission {
  @IsEnum(Resource, { message: "La ressource spécifiée n'est pas valide." })
  resource: Resource;

  @IsArray({ message: 'Les actions doivent être un tableau.' })
  @IsEnum(Action, {
    each: true,
    message: 'Chaque action doit être une valeur valide.',
  })
  @ArrayUnique({ message: 'Les actions ne doivent pas contenir de doublons.' })
  actions: Action[];
}
