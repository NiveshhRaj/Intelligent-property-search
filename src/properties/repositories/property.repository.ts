import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Property } from '../entities/property.entity';

@Injectable()
export class PropertyRepository extends Repository<Property> {
  constructor(private dataSource: DataSource) {
    super(Property, dataSource.createEntityManager());
  }

  async findExactMatches(
    normalizedAddress: string,
    limit: number,
  ): Promise<Property[]> {
    return this.createQueryBuilder('property')
      .where('property.normalizedAddress LIKE :query', {
        query: `${normalizedAddress}%`,
      })
      .limit(limit)
      .getMany();
  }
  async findFuzzyMatches(
    normalizedAddress: string,
    limit: number,
  ): Promise<Property[]> {
    return this.createQueryBuilder('property')
      .addSelect(
        `
      (
        similarity(property."normalizedAddress", :query) * 0.6 +
        similarity(property."streetName", :query) * 0.3 +
        similarity(property."city", :query) * 0.1
      )
      `,
        'rank_score',
      )
      .where(
        `
      property."normalizedAddress" % :query
      OR property."streetName" % :query
      OR property."city" % :query
      `,
        { query: normalizedAddress },
      )
      .orderBy('rank_score', 'DESC')
      .limit(limit)
      .getMany();
  }
}
