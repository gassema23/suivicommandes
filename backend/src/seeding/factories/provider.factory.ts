import { Provider } from '../../providers/entities/provider.entity';
import { setSeederFactory } from 'typeorm-extension';

const usedProviderCodes = new Set<number>();

export const ProviderFactory = setSeederFactory(Provider, (faker) => {
  const provider = new Provider();

  provider.providerName = faker.company.name();

  // Génère un code unique entre 1 et 9999
  let code: number;
  do {
    code = faker.number.int({ min: 1, max: 9999 });
  } while (usedProviderCodes.has(code));
  usedProviderCodes.add(code);

  provider.providerCode = code.toString();
  return provider;
});
