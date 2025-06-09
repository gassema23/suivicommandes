import { Test, TestingModule } from '@nestjs/testing';
import { APP_GUARD } from '@nestjs/core';
import { v4 as uuidv4 } from 'uuid';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { HolidaysController } from './holidays.controller';
import { HolidaysService } from '../services/holidays.service';

jest.mock('../../auth/guards/authorizations.guard', () => ({
  AuthorizationsGuard: { canActivate: () => true },
}));

describe('HolidaysController', () => {
  let controller: HolidaysController;
  let service: HolidaysService;

  const userId = uuidv4();
  const uuid = uuidv4();

  const mockHoliday = {
    id: uuid,
    holidayName: 'Holiday name',
    holidayDate: new Date('2025-01-01'),
    holidayDescription: 'Une description',
  };

  const createDto = {
    holidayName: 'Holiday name',
    holidayDate: new Date('2025-01-01'),
    holidayDescription: 'Une description',
  };

  const mockService = {
    create: jest.fn().mockResolvedValue(mockHoliday),
    findAll: jest.fn().mockResolvedValue([mockHoliday]),
    findOne: jest.fn().mockResolvedValue(mockHoliday),
    update: jest.fn().mockResolvedValue({
      ...mockHoliday,
      holidayName: 'Updated',
    }),
    remove: jest.fn().mockResolvedValue({ deleted: true }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HolidaysController],
      providers: [
        { provide: HolidaysService, useValue: mockService },
        { provide: APP_GUARD, useValue: { canActivate: () => true } },
      ],
    }).compile();

    controller = module.get<HolidaysController>(HolidaysController);
    service = module.get<HolidaysService>(HolidaysService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a holiday', async () => {
    expect(await controller.create(createDto, { id: userId } as any)).toEqual(
      mockHoliday,
    );
    expect(service.create).toHaveBeenCalledWith(createDto, userId);
  });

  it('should return all holidays', async () => {
    expect(await controller.findAll({})).toEqual([mockHoliday]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return a holiday by id', async () => {
    expect(await controller.findOne(uuid)).toEqual(mockHoliday);
    expect(service.findOne).toHaveBeenCalledWith(uuid);
  });

  it('should update a holiday', async () => {
    expect(
      await controller.update(uuid, { holidayName: 'Updated' }, {
        id: userId,
      } as any),
    ).toEqual({
      ...mockHoliday,
      holidayName: 'Updated',
    });
    expect(service.update).toHaveBeenCalledWith(
      uuid,
      { holidayName: 'Updated' },
      userId,
    );
  });

  it('should remove a holiday', async () => {
    expect(await controller.remove(uuid, { id: userId } as any)).toEqual({
      deleted: true,
    });
    expect(service.remove).toHaveBeenCalledWith(uuid, userId);
  });

  // Error handling tests
  it('should throw NotFoundException if holiday not found', async () => {
    mockService.findOne.mockRejectedValueOnce(
      new NotFoundException('Not found'),
    );
    await expect(controller.findOne(uuidv4())).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw BadRequestException on invalid create', async () => {
    mockService.create.mockRejectedValueOnce(
      new BadRequestException('Invalid data'),
    );
    await expect(
      controller.create(
        { holidayName: '', holidayDate: new Date(), holidayDescription: '' },
        {
          id: userId,
        } as any,
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw NotFoundException on update if not found', async () => {
    mockService.update.mockRejectedValueOnce(
      new NotFoundException('Not found'),
    );
    await expect(
      controller.update(uuidv4(), { holidayName: 'X' }, {
        id: userId,
      } as any),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw BadRequestException on invalid update', async () => {
    mockService.update.mockRejectedValueOnce(
      new BadRequestException('Invalid data'),
    );
    await expect(
      controller.update(uuidv4(), { holidayName: '' }, {
        id: userId,
      } as any),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw NotFoundException on remove if not found', async () => {
    mockService.remove.mockRejectedValueOnce(
      new NotFoundException('Not found'),
    );
    await expect(
      controller.remove(uuidv4(), { id: userId } as any),
    ).rejects.toThrow(NotFoundException);
  });
});
