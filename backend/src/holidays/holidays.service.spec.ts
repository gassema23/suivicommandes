import { Test, TestingModule } from '@nestjs/testing';
import { HolidaysService } from './holidays.service';

describe('HolidaysService', () => {
  let service: HolidaysService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HolidaysService],
    }).compile();

    service = module.get<HolidaysService>(HolidaysService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a holiday', async () => {
      // Arrange
      const dto = { holidayName: 'Test', holidayDate: '2025-01-01' };
      jest.spyOn(service, 'create').mockResolvedValue({ id: 1, ...dto } as any);

      // Act
      const result = await service.create(dto as any);

      // Assert
      expect(result).toMatchObject(dto);
    });
  });

  describe('findAll', () => {
    it('should return an array of holidays', async () => {
      const holidays = [{ id: 1, holidayName: 'Test', holidayDate: '2025-01-01' }];
      jest.spyOn(service, 'findAll').mockResolvedValue(holidays as any);

      const result = await service.findAll();

      expect(result).toEqual(holidays);
    });
  });

  describe('findOne', () => {
    it('should return a holiday by id', async () => {
      const holiday = { id: 1, holidayName: 'Test', holidayDate: '2025-01-01' };
      jest.spyOn(service, 'findOne').mockResolvedValue(holiday as any);

      const result = await service.findOne(1);

      expect(result).toEqual(holiday);
    });
  });

  describe('update', () => {
    it('should update a holiday', async () => {
      const dto = { holidayName: 'Updated', holidayDate: '2025-01-02' };
      jest.spyOn(service, 'update').mockResolvedValue({ id: 1, ...dto } as any);

      const result = await service.update(1, dto as any);

      expect(result).toMatchObject(dto);
    });
  });

  describe('remove', () => {
    it('should remove a holiday', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue({ deleted: true } as any);

      const result = await service.remove(1);

      expect(result).toEqual({ deleted: true });
    });
  });
});