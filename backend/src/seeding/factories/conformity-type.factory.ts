import { ConformityType } from '../../conformity-types/entities/conformity-type.entity';
import { setSeederFactory } from 'typeorm-extension';

export const ConformityTypeFactory = setSeederFactory(
  ConformityType,
  (faker) => {
    const conformityType = new ConformityType();
    conformityType.conformityTypeName = faker.animal.bird();
    return conformityType;
  },
);
