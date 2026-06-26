import { Test, TestingModule } from '@nestjs/testing';
import { AddressParserService } from './address-parser.service';

describe('AddressParserService', () => {
  let service: AddressParserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AddressParserService],
    }).compile();

    service = module.get<AddressParserService>(AddressParserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should extract house number, street name, and suffix correctly', () => {
    const result = service.parse('123 Main St');
    expect(result).toEqual({
      houseNumber: 123,
      streetName: 'Main',
      streetSuffix: 'St',
    });
  });

  it('should handle missing house numbers', () => {
    const result = service.parse('Broadway Ave');
    expect(result).toEqual({
      houseNumber: null,
      streetName: 'Broadway',
      streetSuffix: 'Ave',
    });
  });

  it('should handle missing suffixes', () => {
    const result = service.parse('123 Broadway');
    expect(result).toEqual({
      houseNumber: 123,
      streetName: 'Broadway',
      streetSuffix: null,
    });
  });

  it('should handle multi-word street names', () => {
    const result = service.parse('404 Not Found Blvd');
    expect(result).toEqual({
      houseNumber: 404,
      streetName: 'Not Found',
      streetSuffix: 'Blvd',
    });
  });

  it('should handle empty or null strings', () => {
    expect(service.parse('')).toEqual({
      houseNumber: null,
      streetName: '',
      streetSuffix: null,
    });
    // @ts-expect-error
    expect(service.parse(null)).toEqual({
      houseNumber: null,
      streetName: '',
      streetSuffix: null,
    });
  });

  it('should ignore commas and extra spaces', () => {
    const result = service.parse('  555   Some   Street,  ');
    expect(result).toEqual({
      houseNumber: 555,
      streetName: 'Some',
      streetSuffix: 'Street',
    });
  });
});
