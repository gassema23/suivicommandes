import { Service } from '../../services/entities/service.entity';
import { SeederFactoryManager } from 'typeorm-extension';
import * as cliProgress from 'cli-progress';
import { DataSource } from 'typeorm';
import { Sector } from '../../sectors/entities/sectors.entity';

/**
 * ✅ Fonction utilitaire pour vérifier si une chaîne est valide
 */
function isValidString(value: string | null | undefined): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export async function serviceSeed(
  dataSource: DataSource,
  factoryManager: SeederFactoryManager,
  count: number,
  sectors: Sector[],
): Promise<Service[]> {
  const repository = dataSource.getRepository(Service);

  // ✅ Récupérer les noms existants en base
  const existingNames = await repository
    .createQueryBuilder('s')
    .select('s.serviceName')
    .getMany();

  const existingNamesSet = new Set(
    existingNames
      .filter((s) => isValidString(s.serviceName)) // ✅ Filtrage avec type guard
      .map((s) => s.serviceName!.toLowerCase()), // ✅ Safe après validation
  );

  const serviceBar = new cliProgress.SingleBar(
    { format: '{bar} | {name} | {value}/{total}' },
    cliProgress.Presets.shades_classic,
  );

  const services: Service[] = [];
  let attempts = 0;
  const maxAttempts = count * 3; // Limite pour éviter une boucle infinie

  serviceBar.start(count, 0, { name: 'Services' });

  const serviceFactory = factoryManager.get(Service);

  while (services.length < count && attempts < maxAttempts) {
    attempts++;

    try {
      // ✅ Générer un nouveau service avec un secteur aléatoire
      const service = await serviceFactory.make({
        sector: sectors[Math.floor(Math.random() * sectors.length)],
      });

      // ✅ Vérifier que serviceName est valide
      if (!isValidString(service.serviceName)) {
        console.warn('⚠️  Generated service with invalid name, skipping...');
        continue;
      }

      const nameToCheck = service.serviceName.toLowerCase();

      // ✅ Vérifier l'unicité
      if (!existingNamesSet.has(nameToCheck)) {
        services.push(service);
        existingNamesSet.add(nameToCheck); // Ajouter à l'ensemble pour éviter les doublons dans ce batch
        serviceBar.update(services.length);
      }
    } catch (factoryError) {
      console.warn('⚠️  Error generating service:', factoryError);
    }
  }

  if (services.length < count) {
    console.warn(
      `⚠️  Could only generate ${services.length} unique services out of ${count} requested after ${attempts} attempts`,
    );
  }

  // ✅ Sauvegarder en base
  await repository.save(services);
  serviceBar.stop();

  console.log(`✅ Created ${services.length} unique Services`);
  return services;
}
