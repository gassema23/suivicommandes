import { Holiday } from '../../holidays/entities/holiday.entity';
import { setSeederFactory } from 'typeorm-extension';

const usedDates = new Set<string>();

function capitalizeWords(str: string) {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
}

export const HolidayFactory = setSeederFactory(Holiday, (faker) => {
    
  const holiday = new Holiday();
  holiday.holidayName = capitalizeWords(faker.word.words(2));

  let date: Date;
  let dateStr: string;
  do {
    date = faker.date.future();
    dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
  } while (usedDates.has(dateStr));
  usedDates.add(dateStr);

  holiday.holidayDate = date;
  return holiday;
});