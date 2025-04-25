import { Test, TestingModule } from '@nestjs/testing';
import { CloudinarynpmController } from './cloudinarynpm.controller';

describe('CloudinarynpmController', () => {
  let controller: CloudinarynpmController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CloudinarynpmController],
    }).compile();

    controller = module.get<CloudinarynpmController>(CloudinarynpmController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
