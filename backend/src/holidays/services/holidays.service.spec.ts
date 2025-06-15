import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { Holiday } from '../entities/holiday.entity';
import { HolidaysService } from './holidays.service';

const mockHoliday = {
  id: 'uuid-holiday',
  holidayName: 'Test holiday',
  holidayDate: new Date('2025-01-01'),
  holidayDescription: 'Description of test holiday',
};

describe('HolidaysService', () => {
  let service: HolidaysService;
  let repo: Repository<Holiday>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HolidaysService,
        {
          provide: getRepositoryToken(Holiday),
          useValue: {
            findAndCount: jest.fn().mockResolvedValue([[mockHoliday], 1]),
            find: jest.fn().mockResolvedValue([mockHoliday]),
            findOne: jest.fn(),
            create: jest.fn().mockImplementation((dto) => dto),
            save: jest.fn().mockImplementation((holiday) => holiday),
            softDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<HolidaysService>(HolidaysService);
    repo = module.get<Repository<Holiday>>(getRepositoryToken(Holiday));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return paginated holidays', async () => {
    const result = await service.findAll({ page: 1, limit: 10 });
    expect(result.data).toEqual([mockHoliday]);
    expect(result.meta.total).toBe(1);
  });

  it('should create a holiday', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(undefined);
    const dto = {
      holidayName: 'Test holiday',
      holidayDate: new Date('2025-01-01'),
      holidayDescription: 'Description of test holiday',
    };
    const created = await service.create(dto, 'user-holiday');
    expect(created.holidayName).toBe('Test holiday');
    expect(repo.create).toHaveBeenCalled();
    expect(repo.save).toHaveBeenCalled();
  });

  it('should throw if holiday already exists on create', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(mockHoliday);
    await expect(
      service.create(
        {
          holidayName: 'Test holiday',
          holidayDate: new Date('2025-01-01'),
          holidayDescription: 'Description of test holiday',
        },
        'user-holiday',
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should find one holiday', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(mockHoliday);
    const holiday = await service.findOne('uuid-holiday');
    expect(holiday).toEqual(mockHoliday);
  });

  it('should throw if holiday not found', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(undefined);
    await expect(service.findOne('not-exist')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should update a holiday', async () => {
    (repo.findOne as jest.Mock)
      .mockResolvedValueOnce(mockHoliday) // findOne for findOne(id)
      .mockResolvedValueOnce(undefined); // findOne for duplicate check
    const updated = await service.update(
      'uuid-holiday',
      {
        holidayName: 'New Name',
        holidayDate: new Date('2025-01-02'),
        holidayDescription: 'desc',
      },
      'user-holiday',
    );
    expect(updated.holidayName).toBe('New Name');
    expect(repo.save).toHaveBeenCalled();
  });

  it('should throw if updated holiday name/date already exists', async () => {
    (repo.findOne as jest.Mock)
      .mockResolvedValueOnce(mockHoliday) // findOne for findOne(id)
      .mockResolvedValueOnce(mockHoliday); // findOne for duplicate check
    await expect(
      service.update(
        'uuid-holiday',
        {
          holidayName: 'Test holiday',
          holidayDate: new Date('2025-01-01'),
          holidayDescription: 'desc',
        },
        'user-holiday',
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should remove a holiday', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(mockHoliday);
    await expect(
      service.remove('uuid-holiday', 'user-holiday'),
    ).resolves.toBeUndefined();
    expect(repo.save).toHaveBeenCalled();
    expect(repo.softDelete).toHaveBeenCalledWith('uuid-holiday');
  });

  it('should throw if holiday not found on remove', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(undefined);
    await expect(service.remove('not-exist', 'user-holiday')).rejects.toThrow(
      BadRequestException,
    );
  });
});
