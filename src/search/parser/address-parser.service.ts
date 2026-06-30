import { Injectable } from '@nestjs/common';

@Injectable()
export class AddressParserService {
  private readonly streetSuffixes = new Set([
    'street',
    'st',
    'avenue',
    'ave',
    'road',
    'rd',
    'drive',
    'dr',
    'boulevard',
    'blvd',
    'lane',
    'ln',
    'court',
    'ct',
    'circle',
    'cir',
    'place',
    'pl',
    'terrace',
    'ter',
  ]);

  parse(shortAddress: string): {
    houseNumber: number | null;
    streetName: string;
    streetSuffix: string | null;
  } {
    if (!shortAddress)
      return { houseNumber: null, streetName: '', streetSuffix: null };

    // Remove punctuation like commas and split by space
    const parts = shortAddress.trim().replace(/,/g, '').split(/\s+/);
    if (parts.length === 0)
      return { houseNumber: null, streetName: '', streetSuffix: null };

    let houseNumber: number | null = null;
    let streetSuffix: string | null = null;
    const streetNameParts = [...parts];

    // Attempt to extract house number from the first token
    const firstPart = streetNameParts[0];
    const parsedHouseNumber = parseInt(firstPart, 10);
    if (!isNaN(parsedHouseNumber)) {
      houseNumber = parsedHouseNumber;
      streetNameParts.shift();
    }

    // Attempt to extract street suffix from the last token
    if (streetNameParts.length > 0) {
      const lastPart = streetNameParts[streetNameParts.length - 1];
      const normalizedLastPart = lastPart.toLowerCase().replace(/[^a-z]/g, '');
      if (this.streetSuffixes.has(normalizedLastPart)) {
        streetSuffix = lastPart;
        streetNameParts.pop();
      }
    }

    const streetName = streetNameParts.join(' ');

    return { houseNumber, streetName, streetSuffix };
  }
}
