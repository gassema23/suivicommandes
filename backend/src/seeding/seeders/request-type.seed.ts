import { SeederFactoryManager } from 'typeorm-extension';
import * as cliProgress from 'cli-progress';
import { DataSource } from 'typeorm';
import { RequestType } from '../../request-types/entities/request-type.entity';

/**
 * ✅ Fonction utilitaire pour vérifier si une chaîne est valide
 */
function isValidString(value: string | null | undefined): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export async function requestTypeSeed(
  dataSource: DataSource,
  factoryManager: SeederFactoryManager,
  count: number,
): Promise<RequestType[]> {
  const repository = dataSource.getRepository(RequestType);

  // ✅ Récupérer les noms existants en base
  const existingNames = await repository
    .createQueryBuilder('rt')
    .select('rt.requestTypeName')
    .getMany();

  const existingNamesSet = new Set(
    existingNames
      .filter((rt) => isValidString(rt.requestTypeName)) // ✅ Filtrage avec type guard
      .map((rt) => rt.requestTypeName!.toLowerCase()), // ✅ Safe après validation
  );

  const requestTypeBar = new cliProgress.SingleBar(
    { format: '{bar} | {name} | {value}/{total}' },
    cliProgress.Presets.shades_classic,
  );

  const requestTypes: RequestType[] = [];
  let attempts = 0;
  const maxAttempts = count * 3; // Limite pour éviter une boucle infinie

  requestTypeBar.start(count, 0, { name: 'Request type' });

  const requestTypeFactory = factoryManager.get(RequestType);

  while (requestTypes.length < count && attempts < maxAttempts) {
    attempts++;

    try {
      // ✅ Générer un nouveau type de requête
      const requestType = await requestTypeFactory.make();

      // ✅ Vérifier que requestTypeName est valide
      if (!isValidString(requestType.requestTypeName)) {
        console.warn(
          '⚠️  Generated request type with invalid name, skipping...',
        );
        continue;
      }

      const nameToCheck = requestType.requestTypeName.toLowerCase();

      // ✅ Vérifier l'unicité
      if (!existingNamesSet.has(nameToCheck)) {
        requestTypes.push(requestType);
        existingNamesSet.add(nameToCheck); // Ajouter à l'ensemble pour éviter les doublons dans ce batch
        requestTypeBar.update(requestTypes.length);
      }
    } catch (factoryError) {
      console.warn('⚠️  Error generating request type:', factoryError);
    }
  }

  if (requestTypes.length < count) {
    console.warn(
      `⚠️  Could only generate ${requestTypes.length} unique request types out of ${count} requested after ${attempts} attempts`,
    );
  }

  // ✅ Sauvegarder en base
  await repository.save(requestTypes);
  requestTypeBar.stop();

  console.log(`✅ Created ${requestTypes.length} unique Request Types`);
  return requestTypes;
}
