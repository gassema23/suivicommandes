import type { Repository, ObjectLiteral } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { ERROR_MESSAGES } from '../constants/error-messages.constant';

/**
 * Vérifie l'unicité de plusieurs colonnes (insensible à la casse pour les strings) dans une entité,
 * en excluant un id donné (pour l'update).
 * @param repository Repository TypeORM de l'entité
 * @param fields Objet { colonne: valeur } à vérifier
 * @param excludeId Id à exclure de la recherche (optionnel)
 * @param message Message d'erreur personnalisé
 */
export async function assertUniqueFields<T extends ObjectLiteral>(
  repository: Repository<T>,
  fields: Partial<Record<keyof T, unknown>>,
  excludeId?: string | number,
  message?: string,
): Promise<void> {
  let query = repository.createQueryBuilder('entity');
  const whereClauses: string[] = [];
  const params: Record<string, unknown> = {};

  Object.entries(fields).forEach(([key, value], idx) => {
    const paramKey = `value${idx}`;
    // Récupère le type du champ via les métadonnées TypeORM
    const column = repository.metadata.findColumnWithPropertyName(key);
    if (column?.type === 'uuid') {
      // Pour les UUID, comparaison directe
      whereClauses.push(`entity.${key} = :${paramKey}`);
    } else if (typeof value === 'string') {
      // Pour les strings, insensible à la casse
      whereClauses.push(`LOWER(entity.${key}) = LOWER(:${paramKey})`);
    } else {
      // Pour les autres types (number, etc.)
      whereClauses.push(`entity.${key} = :${paramKey}`);
    }
    params[paramKey] = value;
  });

  if (excludeId !== undefined) {
    whereClauses.push('entity.id != :excludeId');
    params.excludeId = excludeId;
  }

  query = query.where(whereClauses.join(' AND '), params);

  const existing = await query.getOne();

  if (existing) {
    throw new BadRequestException(
      message ||
        `${ERROR_MESSAGES.CREATE} un ou plusieurs champs doivent être uniques. Veuillez vérifier les valeurs fournies.`,
    );
  }
}
