import { Test, TestingModule } from '@nestjs/testing';
import { AddressNormalizerService } from './address-normalizer.service';

describe('AddressNormalizerService', () => {
  let service: AddressNormalizerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AddressNormalizerService],
    }).compile();

    service = module.get<AddressNormalizerService>(AddressNormalizerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should lowercase and trim addresses', () => {
    const result = service.normalize('  123 MAIN STREET  ');
    expect(result).toBe('123 main street');
  });

  it('should collapse multiple spaces', () => {
    const result = service.normalize('123   main     street');
    expect(result).toBe('123 main street');
  });

  it('should normalize abbreviations', () => {
    const result = service.normalize('123 Main St., N.E.');
    expect(result).toBe('123 main street northeast');
  });

  it('should remove duplicate punctuation and normalize', () => {
    const result = service.normalize('123 Main St,,  Apt 4B..');
    expect(result).toBe('123 main street apartment 4b');
  });

  it('should handle empty or null inputs', () => {
    expect(service.normalize('')).toBe('');
    // @ts-expect-error
    expect(service.normalize(null)).toBe('');
  });
});
