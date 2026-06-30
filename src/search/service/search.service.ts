import { Injectable } from '@nestjs/common';
import { AddressParserService } from '../parser/address-parser.service';
import { AddressNormalizerService } from '../normalizer/address-normalizer.service';
import { PropertyRepository } from '../../properties/repositories/property.repository';
import { Property } from '../../properties/entities/property.entity';

export interface SearchResult {
  exactMatch: boolean;
  results: Property[];
}

@Injectable()
export class SearchService {
  constructor(
    private readonly addressParserService: AddressParserService,
    private readonly addressNormalizerService: AddressNormalizerService,
    private readonly propertyRepository: PropertyRepository,
  ) {}

  async exactSearch(
    rawAddress: string,
    limit: number = 5,
  ): Promise<SearchResult> {
    const { houseNumber, streetName, streetSuffix } =
      this.addressParserService.parse(rawAddress);

    if (!houseNumber && !streetName) {
      return { exactMatch: false, results: [] };
    }

    const reconstructedAddress = [houseNumber, streetName, streetSuffix]
      .filter(Boolean)
      .join(' ');

    const normalizedAddress =
      this.addressNormalizerService.normalize(reconstructedAddress);

    if (!normalizedAddress) {
      return { exactMatch: false, results: [] };
    }

    const exactResults = await this.propertyRepository.findExactMatches(
      normalizedAddress,
      limit,
    );

    if (exactResults.length > 0) {
      return { exactMatch: true, results: exactResults };
    }

    const fuzzyResults = await this.propertyRepository.findFuzzyMatches(
      normalizedAddress,
      limit,
    );

    const rankedResults = this.rankResults(
      { houseNumber, streetName, streetSuffix },
      fuzzyResults,
    );

    return { exactMatch: false, results: rankedResults };
  }

  private calculateScore(
    parsedInput: {
      houseNumber: number | null;
      streetName: string;
      streetSuffix: string | null;
    },
    property: Property,
  ): number {
    let score = 0;

    if (parsedInput.houseNumber !== null && property.houseNumber !== null) {
      if (parsedInput.houseNumber === property.houseNumber) {
        score += 30;
      } else if (
        Math.abs(parsedInput.houseNumber - property.houseNumber) <= 1
      ) {
        score += 20;
      }
    }

    if (
      parsedInput.streetName &&
      property.streetName &&
      parsedInput.streetName.toLowerCase() === property.streetName.toLowerCase()
    ) {
      score += 40;
    }

    if (
      parsedInput.streetSuffix &&
      property.streetSuffix &&
      parsedInput.streetSuffix.toLowerCase() ===
        property.streetSuffix.toLowerCase()
    ) {
      score += 10;
    }

    return score;
  }

  private rankResults(
    parsedInput: {
      houseNumber: number | null;
      streetName: string;
      streetSuffix: string | null;
    },
    results: Property[],
  ): Property[] {
    return results
      .map((property) => ({
        property,
        score: this.calculateScore(parsedInput, property),
      }))
      .sort((a, b) => b.score - a.score)
      .map((item) => item.property);
  }
}
