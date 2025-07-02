import { SeederFactoryManager } from 'typeorm-extension';
import * as cliProgress from 'cli-progress';
import { DataSource } from 'typeorm';
import { RequestTypeServiceCategory } from '../../request-type-service-categories/entities/request-type-service-category.entity';
import { ServiceCategory } from '../../service-categories/entities/service-category.entity';
import { RequestType } from '../../request-types/entities/request-type.entity';

export async function requestTypeServiceCategorySeed(
  dataSource: DataSource,
  factoryManager: SeederFactoryManager,
  count: number,
  serviceCategories: ServiceCategory[],
  requestTypes: RequestType[],
): Promise<RequestTypeServiceCategory[]> {
  // Calculer le maximum de combinaisons possibles
  const maxPossibleCombinations =
    serviceCategories.length * requestTypes.length;
  const actualCount = Math.min(count, maxPossibleCombinations);

  if (count > maxPossibleCombinations) {
    console.warn(
      `⚠️  Requested ${count} combinations, but only ${maxPossibleCombinations} are possible. Creating ${actualCount} instead.`,
    );
  }

  const requestTypeServiceCategoryBar = new cliProgress.SingleBar(
    { format: '{bar} | {name} | {value}/{total}' },
    cliProgress.Presets.shades_classic,
  );
  requestTypeServiceCategoryBar.start(actualCount, 0, {
    name: 'Request Type Services Categories',
  });

  const requestTypeServiceFactory = factoryManager.get(
    RequestTypeServiceCategory,
  );

  // Créer toutes les combinaisons possibles
  const allCombinations: Array<{
    serviceCategory: ServiceCategory;
    requestType: RequestType;
  }> = [];

  for (const serviceCategory of serviceCategories) {
    for (const requestType of requestTypes) {
      allCombinations.push({ serviceCategory, requestType });
    }
  }

  // Mélanger les combinaisons pour avoir un ordre aléatoire
  const shuffledCombinations = shuffleArray(allCombinations);

  // Prendre seulement le nombre demandé
  const selectedCombinations = shuffledCombinations.slice(0, actualCount);

  // Créer les entités avec les combinaisons uniques
  const requestTypeServiceCategories: RequestTypeServiceCategory[] = [];

  for (let i = 0; i < selectedCombinations.length; i++) {
    const combination = selectedCombinations[i];

    const requestTypeServiceCategory = await requestTypeServiceFactory.make({
      serviceCategory: combination.serviceCategory,
      requestType: combination.requestType,
    });

    requestTypeServiceCategories.push(requestTypeServiceCategory);
    requestTypeServiceCategoryBar.update(i + 1);
  }

  // Sauvegarder toutes les entités
  await dataSource
    .getRepository(RequestTypeServiceCategory)
    .save(requestTypeServiceCategories);

  requestTypeServiceCategoryBar.stop();

  console.log(
    `✅ Created ${requestTypeServiceCategories.length} unique RequestTypeServiceCategory combinations`,
  );
  return requestTypeServiceCategories;
}

/**
 * Fonction utilitaire pour mélanger un tableau (Fisher-Yates shuffle)
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]; // Copie pour ne pas modifier l'original

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}
