import { SeederFactoryManager } from 'typeorm-extension';
import * as cliProgress from 'cli-progress';
import { DataSource } from 'typeorm';
import { DeliverableDelayRequestType } from '../../deliverable-delay-request-types/entities/deliverable-delay-request-type.entity';
import { Flow } from '../../flows/entities/flow.entity';
import { DeliverableDelayFlow } from '../../deliverable-delay-flows/entities/deliverable-delay-flow.entity';

export async function deliverableDelayFlowSeed(
  dataSource: DataSource,
  factoryManager: SeederFactoryManager,
  count: number,
  deliverableDelayRequestTypes: DeliverableDelayRequestType[],
  flows: Flow[],
): Promise<DeliverableDelayFlow[]> {
  const repository = dataSource.getRepository(DeliverableDelayFlow);

  // ✅ Version simplifiée : récupérer toutes les entités existantes
  const existingEntities = await repository.find({
    relations: ['deliverableDelayRequestType', 'flow'],
  });

  const existingCombinationsSet = new Set(
    existingEntities.map(
      (entity) =>
        `${entity.deliverableDelayRequestType?.id}-${entity.flow?.id}`,
    ),
  );

  // ✅ Créer toutes les combinaisons possibles (non existantes)
  const allCombinations: Array<{
    deliverableDelayRequestType: DeliverableDelayRequestType;
    flow: Flow;
  }> = [];

  for (const deliverableDelayRequestType of deliverableDelayRequestTypes) {
    for (const flow of flows) {
      const combinationKey = `${deliverableDelayRequestType.id}-${flow.id}`;

      // ✅ Vérifier que la combinaison n'existe pas déjà
      if (!existingCombinationsSet.has(combinationKey)) {
        allCombinations.push({ deliverableDelayRequestType, flow });
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
  const deliverableDelayFlowBar = new cliProgress.SingleBar(
    { format: '{bar} | {name} | {value}/{total}' },
    cliProgress.Presets.shades_classic,
  );
  deliverableDelayFlowBar.start(actualCount, 0, {
    name: 'Deliverable Delay Flows', // ✅ Nom corrigé
  });

  const deliverableDelayFlowFactory = factoryManager.get(DeliverableDelayFlow);

  // ✅ Mélanger les combinaisons pour avoir un ordre aléatoire
  const shuffledCombinations = shuffleArray(allCombinations);
  const selectedCombinations = shuffledCombinations.slice(0, actualCount);

  const deliverableDelayFlows: DeliverableDelayFlow[] = [];

  // ✅ Ajout de gestion d'erreurs
  for (let i = 0; i < selectedCombinations.length; i++) {
    try {
      const combination = selectedCombinations[i];

      const deliverableDelayFlow = await deliverableDelayFlowFactory.make({
        deliverableDelayRequestType: combination.deliverableDelayRequestType,
        flow: combination.flow,
      });

      deliverableDelayFlows.push(deliverableDelayFlow);
      deliverableDelayFlowBar.update(i + 1);
    } catch (factoryError) {
      console.warn(
        '⚠️  Error generating deliverable delay flow:',
        factoryError,
      );
    }
  }

  // ✅ Sauvegarder toutes les entités
  try {
    await repository.save(deliverableDelayFlows);
  } catch (saveError) {
    console.error('❌ Error saving deliverable delay flows:', saveError);
    throw saveError;
  }

  deliverableDelayFlowBar.stop();

  console.log(
    `✅ Created ${deliverableDelayFlows.length} unique DeliverableDelayFlow combinations`,
  );
  return deliverableDelayFlows;
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
