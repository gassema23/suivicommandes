import { Service } from '../../services/entities/service.entity';
import { SeederFactoryManager } from 'typeorm-extension';
import * as cliProgress from 'cli-progress';
import { DataSource } from 'typeorm';
import { ServiceCategory } from '../../service-categories/entities/service-category.entity';

/**
 * ✅ Fonction utilitaire pour vérifier si une chaîne est valide
 */
function isValidString(value: string | null | undefined): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export async function serviceCategorySeed(
  dataSource: DataSource,
  factoryManager: SeederFactoryManager,
  count: number,
  services: Service[],
): Promise<ServiceCategory[]> {
  const repository = dataSource.getRepository(ServiceCategory);

  // ✅ Récupérer les noms existants en base
  const existingNames = await repository
    .createQueryBuilder('sc')
    .select('sc.serviceCategoryName')
    .getMany();

  const existingNamesSet = new Set(
    existingNames
      .filter((sc) => isValidString(sc.serviceCategoryName)) // ✅ Filtrage avec type guard
      .map((sc) => sc.serviceCategoryName!.toLowerCase()), // ✅ Safe après validation
  );

  const serviceCategoryBar = new cliProgress.SingleBar(
    { format: '{bar} | {name} | {value}/{total}' },
    cliProgress.Presets.shades_classic,
  );

  const serviceCategories: ServiceCategory[] = [];
  let attempts = 0;
  const maxAttempts = count * 3; // Limite pour éviter une boucle infinie

  serviceCategoryBar.start(count, 0, { name: 'Services Categories' });

  const serviceCategoryFactory = factoryManager.get(ServiceCategory);

  while (serviceCategories.length < count && attempts < maxAttempts) {
    attempts++;

    try {
      // ✅ Générer une nouvelle catégorie de service avec un service aléatoire
      const serviceCategory = await serviceCategoryFactory.make({
        service: services[Math.floor(Math.random() * services.length)],
      });

      // ✅ Vérifier que serviceCategoryName est valide
      if (!isValidString(serviceCategory.serviceCategoryName)) {
        console.warn(
          '⚠️  Generated service category with invalid name, skipping...',
        );
        continue;
      }

      const nameToCheck = serviceCategory.serviceCategoryName.toLowerCase();

      // ✅ Vérifier l'unicité
      if (!existingNamesSet.has(nameToCheck)) {
        serviceCategories.push(serviceCategory);
        existingNamesSet.add(nameToCheck); // Ajouter à l'ensemble pour éviter les doublons dans ce batch
        serviceCategoryBar.update(serviceCategories.length);
      }
    } catch (factoryError) {
      console.warn('⚠️  Error generating service category:', factoryError);
    }
  }

  if (serviceCategories.length < count) {
    console.warn(
      `⚠️  Could only generate ${serviceCategories.length} unique service categories out of ${count} requested after ${attempts} attempts`,
    );
  }

  // ✅ Sauvegarder en base
  await repository.save(serviceCategories);
  serviceCategoryBar.stop();

  console.log(
    `✅ Created ${serviceCategories.length} unique Service Categories`,
  );
  return serviceCategories;
}
