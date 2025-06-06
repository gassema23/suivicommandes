import { Client } from '../../clients/entities/client.entity';
import { setSeederFactory } from 'typeorm-extension';

const usedNumbers = new Set<number>();

export const ClientFactory = setSeederFactory(Client, (faker) => {
  const client = new Client();
  client.clientName = faker.company.name();

  // Génère un numéro unique entre 1 et 9999
  let number: number;
  do {
    number = faker.number.int({ min: 1, max: 9999 });
  } while (usedNumbers.has(number));
  usedNumbers.add(number);

  client.clientNumber = number.toString();
  return client;
});
