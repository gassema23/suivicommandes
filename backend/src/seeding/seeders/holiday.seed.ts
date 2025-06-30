import { SeederFactoryManager } from 'typeorm-extension';
import * as cliProgress from 'cli-progress';
import { DataSource } from 'typeorm';
import { Holiday } from '../../holidays/entities/holiday.entity';
import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'csv-parser';

interface HolidayCSVRow {
  Mois: string;
  'Jours fériés': string;
  Date: string;
  'Jour de la semaine': string;
}

export async function holidaySeed(
  dataSource: DataSource,
  factoryManager: SeederFactoryManager,
  years: number[] = [2024, 2025, 2026], // ✅ Paramètre pour les années au lieu du count
): Promise<Holiday[]> {
  console.log('🌱 Seeding holidays from CSV...');

  try {
    // ✅ Charger les holidays depuis le CSV
    const holidaysFromCSV = await loadHolidaysFromCSV();

    // ✅ Calculer le total d'opérations pour la progress bar
    const totalOperations = years.length * holidaysFromCSV.length;

    const holidayBar = new cliProgress.SingleBar(
      { format: '{bar} | {name} | {value}/{total}' },
      cliProgress.Presets.shades_classic,
    );
    holidayBar.start(totalOperations, 0, { name: 'Holiday' });

    const allHolidays: Holiday[] = [];
    let progress = 0;

    // ✅ Générer les holidays pour chaque année
    for (const year of years) {
      for (const holidayTemplate of holidaysFromCSV) {
        const holiday = new Holiday();
        holiday.holidayName = holidayTemplate.holidayName;

        // Adapter la date pour l'année spécifiée
        const originalDate = new Date(holidayTemplate.holidayDate);
        holiday.holidayDate = new Date(
          year,
          originalDate.getMonth(),
          originalDate.getDate(),
        );

        allHolidays.push(holiday);

        // Mise à jour de la progress bar
        progress++;
        holidayBar.update(progress);
      }
    }

    // ✅ Sauvegarder tous les holidays en base
    await dataSource.getRepository(Holiday).save(allHolidays);

    holidayBar.stop();
    console.log(
      `✅ Successfully seeded ${allHolidays.length} holidays for years: ${years.join(', ')}`,
    );

    // Afficher un résumé
    logSeedingSummary(allHolidays);

    return allHolidays;
  } catch (error) {
    console.error('❌ Error seeding holidays:', error);
    throw error;
  }
}

/**
 * ✅ Charge les jours fériés depuis le fichier CSV
 */
async function loadHolidaysFromCSV(): Promise<Holiday[]> {
  const csvFilePath = path.join(__dirname, '../../database/data/holidays.csv');

  if (!fs.existsSync(csvFilePath)) {
    throw new Error(
      `CSV file not found: ${csvFilePath}. Please create the file with holiday data.`,
    );
  }

  console.log(`📂 Loading holidays from: ${csvFilePath}`);
  const holidays: Holiday[] = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (row: HolidayCSVRow) => {
        try {
          const holiday = new Holiday();
          holiday.holidayName = row['Jours fériés']?.trim();
          holiday.holidayDate = new Date(row.Date?.trim());

          // Validation basique
          if (holiday.holidayName && !isNaN(holiday.holidayDate.getTime())) {
            holidays.push(holiday);
          } else {
            console.warn('⚠️  Invalid holiday data skipped:', row);
          }
        } catch (error) {
          console.warn('⚠️  Error parsing holiday row:', row, error);
        }
      })
      .on('end', () => {
        console.log(`📋 Loaded ${holidays.length} holiday templates from CSV`);
        resolve(holidays);
      })
      .on('error', (error) => {
        console.error('❌ Error reading CSV file:', error);
        reject(error);
      });
  });
}

/**
 * ✅ Affiche un résumé du seeding
 */
function logSeedingSummary(holidays: Holiday[]): void {
  const groupedByYear = holidays.reduce(
    (acc, holiday) => {
      const year = holiday.holidayDate.getFullYear();
      if (!acc[year]) acc[year] = 0;
      acc[year]++;
      return acc;
    },
    {} as Record<number, number>,
  );

  console.log('📊 Holiday Summary:');
  Object.entries(groupedByYear).forEach(([year, count]) => {
    console.log(`   📅 ${year}: ${count} holidays`);
  });

  // Afficher quelques exemples
  console.log('🎉 Sample holidays:');
  holidays.slice(0, 3).forEach((holiday) => {
    const dateStr = holiday.holidayDate.toISOString().split('T')[0];
    console.log(`   • ${dateStr} - ${holiday.holidayName}`);
  });
}
