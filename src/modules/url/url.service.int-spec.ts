import { app } from 'test/setup';
import { UrlService } from './url.service';
import { generateCreateUrlPayload } from './__tests__/test-utils';
import { DatabaseService } from 'src/database/database.service';

describe('URL Service Integration Tests', () => {
  let urlService: UrlService;
  let databaseService: DatabaseService;

  beforeEach(() => {
    urlService = app.get(UrlService);
    databaseService = app.get(DatabaseService);
  });
  describe('create', () => {
    it('should create a new URL and return it', async () => {
      const payload = generateCreateUrlPayload();
      const result = await urlService.create(payload);
      const savedUrl = await databaseService.url.findUnique({
        where: { id: result.id },
      });
      console.log('Result:', result);
      console.log('Saved URL:', savedUrl);
      expect(result).toEqual(savedUrl);
    });
  });
});
