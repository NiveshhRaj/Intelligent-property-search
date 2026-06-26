import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitPropertySchema1719326400000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Enable extensions
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto;`);
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS pg_trgm;`);

    // 2. Create the properties table using native PostgreSQL uuid generator gen_random_uuid()
    await queryRunner.query(`
      CREATE TABLE "properties" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "houseNumber" integer,
        "streetName" character varying(255) NOT NULL,
        "streetSuffix" character varying(50),
        "fullAddress" character varying(500) NOT NULL,
        "normalizedAddress" character varying(500) NOT NULL,
        "city" character varying(100) NOT NULL,
        "county" character varying(100),
        "state" character varying(100) NOT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_properties_id" PRIMARY KEY ("id")
      );
    `);

    // 3. Standard B-tree indexes for numeric or exact lookups
    await queryRunner.query(
      `CREATE INDEX "IDX_PROPERTIES_HOUSE_NUMBER" ON "properties" ("houseNumber");`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_PROPERTIES_FULL_ADDRESS" ON "properties" ("fullAddress");`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_PROPERTIES_STATE" ON "properties" ("state");`,
    );

    // 4. GIN indexes using pg_trgm for efficient similarity / fuzzy searching
    await queryRunner.query(
      `CREATE INDEX "IDX_PROPERTIES_NORMALIZED_ADDRESS_TRGM" ON "properties" USING GIN ("normalizedAddress" gin_trgm_ops);`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_PROPERTIES_STREET_NAME_TRGM" ON "properties" USING GIN ("streetName" gin_trgm_ops);`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_PROPERTIES_CITY_TRGM" ON "properties" USING GIN ("city" gin_trgm_ops);`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the indexes and table
    await queryRunner.query(`DROP INDEX "IDX_PROPERTIES_CITY_TRGM";`);
    await queryRunner.query(`DROP INDEX "IDX_PROPERTIES_STREET_NAME_TRGM";`);
    await queryRunner.query(
      `DROP INDEX "IDX_PROPERTIES_NORMALIZED_ADDRESS_TRGM";`,
    );
    await queryRunner.query(`DROP INDEX "IDX_PROPERTIES_STATE";`);
    await queryRunner.query(`DROP INDEX "IDX_PROPERTIES_FULL_ADDRESS";`);
    await queryRunner.query(`DROP INDEX "IDX_PROPERTIES_HOUSE_NUMBER";`);

    await queryRunner.query(`DROP TABLE "properties";`);
  }
}
