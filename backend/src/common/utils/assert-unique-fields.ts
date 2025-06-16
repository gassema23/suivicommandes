import type { Repository, ObjectLiteral } from 'typeorm';
import { BadRequestException } from '@nestjs/common';

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
    if (typeof value === 'string') {
      whereClauses.push(`LOWER(entity.${key}) = LOWER(:${paramKey})`);
    } else {
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
        "Impossible d'enregistrer : un type de délai avec ces informations existe déjà. Veuillez choisir un nom ou une combinaison unique pour le type de délai.",
    );
  }
}
