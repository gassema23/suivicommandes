import { SubdivisionClient } from '../../subdivision-clients/entities/subdivision-client.entity';
import { setSeederFactory } from 'typeorm-extension';

const usedNumbers = new Set<number>();

export const SubdivisionClientFactory = setSeederFactory(
  SubdivisionClient,
  (faker) => {
    const subdivisionClient = new SubdivisionClient();
    subdivisionClient.subdivisionClientName = faker.company.name();
    // Génère un numéro unique entre 1 et 9999
    let number: number;
    do {
      number = faker.number.int({ min: 1, max: 9999 });
    } while (usedNumbers.has(number));
    usedNumbers.add(number);

    subdivisionClient.subdivisionClientNumber = number.toString();
    return subdivisionClient;
  },
);
