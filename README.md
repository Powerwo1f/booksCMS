### Migration Commands

```bash
npm run migration:generate -- src/database/migrations/CreateAclSchema -d src/config/typeorm.datasource.ts
```

Creates a new migration file using TypeORM CLI.

---

### DynamoDB Local

```bash
docker-compose up -d
docker-compose down
```

Starts and stops DynamoDB Local using Docker Compose.

---

### E2E Tests

To run all E2E tests **except** the throttler tests:

```bash
npm run test:e2e
```

To run throttler test only:
```bash
npm run test:throttler
```
> ℹ️ **Throttling tests are separated to avoid affecting global request counters during other tests.**
