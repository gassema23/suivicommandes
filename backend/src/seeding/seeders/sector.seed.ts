import { Sector } from '../../sectors/entities/sectors.entity';
import { SeederFactoryManager } from 'typeorm-extension';
import * as cliProgress from 'cli-progress';
import { DataSource } from 'typeorm';

/**
 * ✅ Fonction utilitaire pour vérifier si une chaîne est valide
 */
function isValidString(value: string | null | undefined): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export async function sectorSeed(
  dataSource: DataSource,
  factoryManager: SeederFactoryManager,
  count: number,
): Promise<Sector[]> {
  const repository = dataSource.getRepository(Sector);

  // ✅ Récupérer les noms existants en base
  const existingNames = await repository
    .createQueryBuilder('s')
    .select('s.sectorName')
    .getMany();

  const existingNamesSet = new Set(
    existingNames
      .filter((s) => isValidString(s.sectorName)) // ✅ Filtrage avec type guard
      .map((s) => s.sectorName!.toLowerCase()), // ✅ Safe après validation
  );

  const sectorBar = new cliProgress.SingleBar(
    { format: '{bar} | {name} | {value}/{total}' },
    cliProgress.Presets.shades_classic,
  );

  const sectors: Sector[] = [];
  let attempts = 0;
  const maxAttempts = count * 3; // Limite pour éviter une boucle infinie

  sectorBar.start(count, 0, { name: 'Sectors' });

  const sectorFactory = factoryManager.get(Sector);

  while (sectors.length < count && attempts < maxAttempts) {
    attempts++;

    try {
      // ✅ Générer un nouveau secteur
      const sector = await sectorFactory.make();

      // ✅ Vérifier que sectorName est valide
      if (!isValidString(sector.sectorName)) {
        console.warn('⚠️  Generated sector with invalid name, skipping...');
        continue;
      }

      const nameToCheck = sector.sectorName.toLowerCase();

      // ✅ Vérifier l'unicité
      if (!existingNamesSet.has(nameToCheck)) {
        sectors.push(sector);
        existingNamesSet.add(nameToCheck); // Ajouter à l'ensemble pour éviter les doublons dans ce batch
        sectorBar.update(sectors.length);
      }
    } catch (factoryError) {
      console.warn('⚠️  Error generating sector:', factoryError);
    }
  }

  if (sectors.length < count) {
    console.warn(
      `⚠️  Could only generate ${sectors.length} unique sectors out of ${count} requested after ${attempts} attempts`,
    );
  }

  // ✅ Sauvegarder en base
  await repository.save(sectors);
  sectorBar.stop();

  console.log(`✅ Created ${sectors.length} unique Sectors`);
  return sectors;
}
