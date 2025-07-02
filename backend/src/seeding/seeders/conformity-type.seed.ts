import { SeederFactoryManager } from 'typeorm-extension';
import * as cliProgress from 'cli-progress';
import { DataSource } from 'typeorm';
import { ConformityType } from '../../conformity-types/entities/conformity-type.entity';

export async function conformityTypeSeed(
  dataSource: DataSource,
  factoryManager: SeederFactoryManager,
  count: number,
): Promise<ConformityType[]> {
  const repository = dataSource.getRepository(ConformityType);

  // ✅ Récupérer les noms existants en base
  const existingNames = await repository
    .createQueryBuilder('ct')
    .select('ct.conformityTypeName')
    .getMany();

  const existingNamesSet = new Set(
    existingNames.map((ct) => ct.conformityTypeName.toLowerCase()),
  );

  const conformityTypeBar = new cliProgress.SingleBar(
    { format: '{bar} | {name} | {value}/{total}' },
    cliProgress.Presets.shades_classic,
  );

  const conformityTypes: ConformityType[] = [];
  let attempts = 0;
  const maxAttempts = count * 3; // Limite pour éviter une boucle infinie

  conformityTypeBar.start(count, 0, { name: 'Conformity Types' });

  const conformityTypeFactory = factoryManager.get(ConformityType);

  while (conformityTypes.length < count && attempts < maxAttempts) {
    attempts++;

    // ✅ Générer une nouvelle entité
    const conformityType = await conformityTypeFactory.make();
    const nameToCheck = conformityType.conformityTypeName.toLowerCase();

    // ✅ Vérifier l'unicité
    if (!existingNamesSet.has(nameToCheck)) {
      conformityTypes.push(conformityType);
      existingNamesSet.add(nameToCheck); // Ajouter à l'ensemble pour éviter les doublons dans ce batch
      conformityTypeBar.update(conformityTypes.length);
    }
  }

  if (conformityTypes.length < count) {
    console.warn(
      `⚠️  Could only generate ${conformityTypes.length} unique conformity types out of ${count} requested after ${attempts} attempts`,
    );
  }

  // ✅ Sauvegarder en base
  await repository.save(conformityTypes);
  conformityTypeBar.stop();

  console.log(`✅ Created ${conformityTypes.length} unique ConformityTypes`);
  return conformityTypes;
}
