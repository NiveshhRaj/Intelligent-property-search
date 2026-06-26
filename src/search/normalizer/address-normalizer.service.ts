import { Injectable } from '@nestjs/common';

@Injectable()
export class AddressNormalizerService {
  private readonly abbreviationMap: Record<string, string> = {
    st: 'street',
    ave: 'avenue',
    rd: 'road',
    dr: 'drive',
    blvd: 'boulevard',
    ln: 'lane',
    ct: 'court',
    cir: 'circle',
    pl: 'place',
    ter: 'terrace',
    n: 'north',
    s: 'south',
    e: 'east',
    w: 'west',
    ne: 'northeast',
    nw: 'northwest',
    se: 'southeast',
    sw: 'southwest',
    apt: 'apartment',
    ste: 'suite',
  };

  normalize(address: string): string {
    if (!address) return '';

    // 1. Convert to lowercase
    let normalized = address.toLowerCase();

    // 2. Remove punctuation (e.g., ,, or ..)
    normalized = normalized.replace(/[.,]/g, '');

    // 3. Collapse multiple spaces and trim
    normalized = normalized.replace(/\s+/g, ' ').trim();

    // 4. Normalize abbreviations
    const tokens = normalized.split(' ');
    const normalizedTokens = tokens.map(
      (token) => this.abbreviationMap[token] || token,
    );

    return normalizedTokens.join(' ');
  }
}
