import { SeederFactoryManager } from 'typeorm-extension';
import * as cliProgress from 'cli-progress';
import { DataSource } from 'typeorm';
import { Deliverable } from '../../deliverables/entities/deliverable.entity';

export async function deliverableSeed(
  dataSource: DataSource,
  factoryManager: SeederFactoryManager,
  count: number,
): Promise<Deliverable[]> {
  const repository = dataSource.getRepository(Deliverable);

  // ✅ Récupérer les noms existants en base avec vérification
  const existingNames = await repository
    .createQueryBuilder('d')
    .select('d.deliverableName')
    .getMany();

  const existingNamesSet = new Set(
    existingNames
      .filter((d) => d.deliverableName) // ✅ Filtrer les valeurs undefined/null
      .map((d) => d.deliverableName!.toLowerCase()), // ✅ Assertion non-null après filtrage
  );

  const deliverableBar = new cliProgress.SingleBar(
    { format: '{bar} | {name} | {value}/{total}' },
    cliProgress.Presets.shades_classic,
  );

  const deliverables: Deliverable[] = [];
  let attempts = 0;
  const maxAttempts = count * 3; // Limite pour éviter une boucle infinie

  deliverableBar.start(count, 0, { name: 'Deliverable' });

  const deliverableFactory = factoryManager.get(Deliverable);

  while (deliverables.length < count && attempts < maxAttempts) {
    attempts++;

    // ✅ Générer un nouveau deliverable
    const deliverable = await deliverableFactory.make();

    // ✅ Vérifier que deliverableName existe et n'est pas vide
    if (
      !deliverable.deliverableName ||
      deliverable.deliverableName.trim() === ''
    ) {
      console.warn('⚠️  Generated deliverable with empty name, skipping...');
      continue;
    }

    const nameToCheck = deliverable.deliverableName.toLowerCase();

    // ✅ Vérifier l'unicité
    if (!existingNamesSet.has(nameToCheck)) {
      deliverables.push(deliverable);
      existingNamesSet.add(nameToCheck); // Ajouter à l'ensemble pour éviter les doublons dans ce batch
      deliverableBar.update(deliverables.length);
    }
  }

  if (deliverables.length < count) {
    console.warn(
      `⚠️  Could only generate ${deliverables.length} unique deliverables out of ${count} requested after ${attempts} attempts`,
    );
  }

  // ✅ Sauvegarder en base
  await repository.save(deliverables);
  deliverableBar.stop();

  console.log(`✅ Created ${deliverables.length} unique Deliverables`);
  return deliverables;
}
