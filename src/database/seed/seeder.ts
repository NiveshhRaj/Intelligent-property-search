import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { DataSource } from 'typeorm';
import * as fs from 'fs';
import csv from 'csv-parser';
import * as path from 'path';
import { Property } from '../../properties/entities/property.entity';
import { AddressParserService } from '../../search/parser/address-parser.service';
import { AddressNormalizerService } from '../../search/normalizer/address-normalizer.service';
import { LoggerService } from '../../common/logger/logger.service';

interface CsvRow {
  shortAddress: string;
  address: string;
  city: string;
  countyOrParish: string;
  stateOrProvince: string;
}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const dataSource = app.get(DataSource);
  const parserService = app.get(AddressParserService);
  const normalizerService = app.get(AddressNormalizerService);
  const logger = app.get(LoggerService);

  logger.setContext('Seeder');

  // const csvFilePath = path.join(__dirname, '../../../../address-table2.csv');
  const csvFilePath = path.join(process.cwd(), 'address-table2.csv');

  if (!fs.existsSync(csvFilePath)) {
    logger.error(`CSV file not found at path: ${csvFilePath}`);
    await app.close();
    process.exit(1);
  }

  const batchSize = 1000;
  let batch: Partial<Property>[] = [];
  let totalRows = 0;
  let importedRows = 0;
  let skippedRows = 0;
  let failedRows = 0;

  logger.log('Starting CSV Import...');
  const startTime = Date.now();

  const processBatch = async (currentBatch: Partial<Property>[]) => {
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into(Property)
        .values(currentBatch)
        .orIgnore() // Prevents duplicates since fullAddress is unique (if constrained) or handles constraint violations
        .execute();

      // Number of actually inserted rows (orIgnore skips conflicting ones)
      const insertedCount = result.raw.length || result.identifiers.length;
      importedRows += insertedCount;
      skippedRows += currentBatch.length - insertedCount;

      await queryRunner.commitTransaction();
    } catch (error: unknown) {
      await queryRunner.rollbackTransaction();

      const message = error instanceof Error ? error.message : 'Unknown error';

      logger.error(`Batch insert failed: ${message}`);

      failedRows += currentBatch.length;
    }
  };

  return new Promise<void>((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', async (row: CsvRow) => {
        totalRows++;

        try {
          const { houseNumber, streetName, streetSuffix } = parserService.parse(
            row.shortAddress || '',
          );
          const normalizedAddress = normalizerService.normalize(
            row.address || '',
          );

          const property = {
            houseNumber,
            streetName,
            streetSuffix,
            fullAddress: row.address,
            normalizedAddress,
            city: row.city,
            county: row.countyOrParish,
            state: row.stateOrProvince,
          };

          batch.push(property);

          if (batch.length >= batchSize) {
            // Pause the stream while processing the batch
            const currentBatch = [...batch];
            batch = [];
            // Assuming stream auto-pauses/resumes isn't perfect for async iteration inside on('data'),
            // it's better to manage it carefully, but TypeORM handles async batch insert quickly.
            // For a perfectly safe backpressure handling, one would use async iterators or pause()/resume().
            await processBatch(currentBatch);
          }
        } catch {
          failedRows++;
        }
      })
      .on('end', async () => {
        if (batch.length > 0) {
          await processBatch(batch);
        }

        const duration = (Date.now() - startTime) / 1000;
        logger.log('--- Import Statistics ---');
        logger.log(`Total rows processed: ${totalRows}`);
        logger.log(`Imported rows: ${importedRows}`);
        logger.log(`Skipped rows (duplicates): ${skippedRows}`);
        logger.log(`Failed rows: ${failedRows}`);
        logger.log(`Total execution time: ${duration.toFixed(2)}s`);

        await app.close();
        resolve();
      })
      .on('error', (err) => {
        logger.error('Error reading CSV:', err.message);
        reject(err);
      });
  });
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
