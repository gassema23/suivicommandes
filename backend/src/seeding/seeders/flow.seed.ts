import { SeederFactoryManager } from 'typeorm-extension';
import * as cliProgress from 'cli-progress';
import { DataSource } from 'typeorm';
import { Flow } from '../../flows/entities/flow.entity';

/**
 * ✅ Fonction utilitaire pour vérifier si une chaîne est valide
 */
function isValidString(value: string | null | undefined): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export async function flowSeed(
  dataSource: DataSource,
  factoryManager: SeederFactoryManager,
  count: number,
): Promise<Flow[]> {
  const repository = dataSource.getRepository(Flow);

  // ✅ Récupérer les noms existants en base
  const existingNames = await repository
    .createQueryBuilder('f')
    .select('f.flowName')
    .getMany();

  const existingNamesSet = new Set(
    existingNames
      .filter((f) => isValidString(f.flowName))
      .map((f) => f.flowName?.toLowerCase())
      .filter((name): name is string => name !== undefined && name !== ''),
  );

  const flowBar = new cliProgress.SingleBar(
    { format: '{bar} | {name} | {value}/{total}' },
    cliProgress.Presets.shades_classic,
  );

  const flows: Flow[] = [];
  let attempts = 0;
  const maxAttempts = count * 3; // Limite pour éviter une boucle infinie

  flowBar.start(count, 0, { name: 'Flow' });

  const flowFactory = factoryManager.get(Flow);

  while (flows.length < count && attempts < maxAttempts) {
    attempts++;

    try {
      // ✅ Générer un nouveau flow
      const flow = await flowFactory.make();

      // ✅ Vérifier que flowName est valide
      if (!isValidString(flow.flowName)) {
        console.warn('⚠️  Generated flow with invalid name, skipping...');
        continue;
      }

      const nameToCheck = flow.flowName.toLowerCase();

      // ✅ Vérifier l'unicité
      if (!existingNamesSet.has(nameToCheck)) {
        flows.push(flow);
        existingNamesSet.add(nameToCheck); // Ajouter à l'ensemble pour éviter les doublons dans ce batch
        flowBar.update(flows.length);
      }
    } catch (factoryError) {
      console.warn('⚠️  Error generating flow:', factoryError);
    }
  }

  if (flows.length < count) {
    console.warn(
      `⚠️  Could only generate ${flows.length} unique flows out of ${count} requested after ${attempts} attempts`,
    );
  }

  // ✅ Sauvegarder en base
  await repository.save(flows);
  flowBar.stop();

  console.log(`✅ Created ${flows.length} unique Flows`);
  return flows;
}
