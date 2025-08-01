import { app } from 'test/setup';
import { UrlService } from './url.service';
import {
  generateCreateUrlPayload,
  generateUrlArray,
} from './__tests__/test-utils';
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
      expect(result).toEqual(savedUrl);
    });
  });

  describe('get', () => {
    it('should find a URL by its unique identifier', async () => {
      const payload = generateCreateUrlPayload();
      const savedUrl = await urlService.create(payload);

      const uid = savedUrl.url.split('/').pop();
      const findUrl = await urlService.findOne(uid!);

      expect(findUrl).toEqual(savedUrl);
    });

    it('should return an empty array when no URLs exist in the database', async () => {
      const urls = await urlService.findAll({});
      expect(urls.urls).toEqual([]);
    });

    it('should correctly indicate the first page', async () => {
      const payload = generateUrlArray();
      const meta = {
        page: 1,
        limit: 3,
      };
      await databaseService.url.createMany({
        data: payload,
      });

      const result = await urlService.findAll(meta);
      expect(result.meta).toEqual({
        currentPage: 1,
        perPage: 3,
        totalCount: 3,
        totalPages: 1,
        nextPage: '',
        prevPage: '',
      });
    });
  });
  describe('delete', () =>{
    it('should delete an existing url', async () => {
      const payload = generateCreateUrlPayload();
      const result = await urlService.create(payload);
      

      const deletedUrl = await urlService.remove(result.id);
      expect(deletedUrl).toEqual(result);
    });
  })
});
