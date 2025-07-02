import { SeederFactoryManager } from 'typeorm-extension';
import * as cliProgress from 'cli-progress';
import { DataSource } from 'typeorm';
import { RequestTypeServiceCategory } from '../../request-type-service-categories/entities/request-type-service-category.entity';
import { Deliverable } from '../../deliverables/entities/deliverable.entity';
import { DeliverableDelayRequestType } from '../../deliverable-delay-request-types/entities/deliverable-delay-request-type.entity';

export async function deliverableDelayRequestTypeSeed(
  dataSource: DataSource,
  factoryManager: SeederFactoryManager,
  count: number,
  requestTypeServiceCategories: RequestTypeServiceCategory[],
  deliverables: Deliverable[],
): Promise<DeliverableDelayRequestType[]> {
  const repository = dataSource.getRepository(DeliverableDelayRequestType);

  // ✅ Récupérer les combinaisons existantes en base
  const existingCombinations = await repository
    .createQueryBuilder('ddrt')
    .select([
      'ddrt.request_type_service_category_id as requestTypeServiceCategoryId', // ✅ Nom correct de colonne
      'ddrt.deliverable_id as deliverableId', // ✅ Nom correct de colonne
    ])
    .getRawMany();

  const existingCombinationsSet = new Set(
    existingCombinations.map(
      (ddrt) => `${ddrt.requestTypeServiceCategoryId}-${ddrt.deliverableId}`, // ✅ Utiliser les vraies valeurs
    ),
  );

  // ✅ Créer toutes les combinaisons possibles (non existantes)
  const allCombinations: Array<{
    requestTypeServiceCategory: RequestTypeServiceCategory;
    deliverable: Deliverable;
  }> = [];

  for (const requestTypeServiceCategory of requestTypeServiceCategories) {
    for (const deliverable of deliverables) {
      const combinationKey = `${requestTypeServiceCategory.id}-${deliverable.id}`;

      // ✅ Vérifier que la combinaison n'existe pas déjà
      if (!existingCombinationsSet.has(combinationKey)) {
        allCombinations.push({ requestTypeServiceCategory, deliverable });
      }
    }
  }

  const maxPossibleCombinations = allCombinations.length;
  const actualCount = Math.min(count, maxPossibleCombinations);

  if (count > maxPossibleCombinations) {
    console.warn(
      `⚠️  Requested ${count} combinations, but only ${maxPossibleCombinations} new combinations are possible. Creating ${actualCount} instead.`,
    );
  }

  if (actualCount === 0) {
    console.log(
      'ℹ️  No new combinations to create - all possible combinations already exist',
    );
    return [];
  }

  // ✅ Nom correct pour la progress bar
  const deliverableDelayRequestTypeBar = new cliProgress.SingleBar(
    { format: '{bar} | {name} | {value}/{total}' },
    cliProgress.Presets.shades_classic,
  );
  deliverableDelayRequestTypeBar.start(actualCount, 0, {
    name: 'Deliverable Delay Request Types', // ✅ Nom corrigé
  });

  const deliverableDelayRequestTypeFactory = factoryManager.get(
    DeliverableDelayRequestType,
  );

  // ✅ Mélanger les combinaisons pour avoir un ordre aléatoire
  const shuffledCombinations = shuffleArray(allCombinations);
  const selectedCombinations = shuffledCombinations.slice(0, actualCount);

  const deliverableDelayRequestTypes: DeliverableDelayRequestType[] = [];

  // ✅ Ajout de gestion d'erreurs
  for (let i = 0; i < selectedCombinations.length; i++) {
    try {
      const combination = selectedCombinations[i];

      const deliverableDelayRequestType =
        await deliverableDelayRequestTypeFactory.make({
          requestTypeServiceCategory: combination.requestTypeServiceCategory,
          deliverable: combination.deliverable,
        });

      deliverableDelayRequestTypes.push(deliverableDelayRequestType);
      deliverableDelayRequestTypeBar.update(i + 1);
    } catch (factoryError) {
      console.warn(
        '⚠️  Error generating deliverable delay request type:',
        factoryError,
      );
    }
  }

  // ✅ Sauvegarder toutes les entités
  try {
    await repository.save(deliverableDelayRequestTypes);
  } catch (saveError) {
    console.error(
      '❌ Error saving deliverable delay request types:',
      saveError,
    );
    throw saveError;
  }

  deliverableDelayRequestTypeBar.stop();

  console.log(
    `✅ Created ${deliverableDelayRequestTypes.length} unique DeliverableDelayRequestType combinations`,
  );
  return deliverableDelayRequestTypes;
}

/**
 * ✅ Fonction utilitaire pour mélanger un tableau (Fisher-Yates shuffle)
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]; // Copie pour ne pas modifier l'original

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}
