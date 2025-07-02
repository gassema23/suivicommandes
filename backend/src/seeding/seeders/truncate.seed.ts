import * as cliProgress from 'cli-progress';
import { DataSource } from 'typeorm';

export async function truncateSeed(dataSource: DataSource): Promise<void> {
  // Progress bar simulée pour le truncate
  const truncateBar = new cliProgress.SingleBar(
    { format: '{bar} | {name} | {value}/{total}' },
    cliProgress.Presets.shades_classic,
  );
  truncateBar.start(1, 0, { name: 'Truncate' });

  await dataSource.query(
    'TRUNCATE TABLE "service_categories", "services", "sectors", "provider_service_categories","providers", "subdivision_clients","clients", "holidays", "request_types", "request_type_service_categories", "flows", "deliverables", "conformity_types", "deliverable_delay_request_types", "deliverable_delay_flows" RESTART IDENTITY CASCADE;',
  );
  // Petite pause pour l'effet visuel (optionnel)
  await new Promise((resolve) => setTimeout(resolve, 300));
  truncateBar.update(1);
  truncateBar.stop();
}
