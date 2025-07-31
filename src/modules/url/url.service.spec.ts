import { Test, TestingModule } from '@nestjs/testing';
import { UrlService } from './url.service';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from 'src/database/database.service';
import { UidService } from 'src/services/uid/uid.service';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import {
  generateUrlArray,
  generateUrlPayload,
  host,
  uid,
} from './__tests__/test-utils';
describe('UrlService', () => {
  let urlService: UrlService;
  let uidService: DeepMocked<UidService>;
  let configService: DeepMocked<ConfigService>;
  let databaseService: DeepMockProxy<DatabaseService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlService,
        {
          provide: UidService,
          useValue: createMock<UidService>(),
        },
        {
          provide: ConfigService,
          useValue: createMock<ConfigService>(),
        },
        {
          provide: DatabaseService,
          useValue: mockDeep<DatabaseService>(),
        },
      ],
    }).compile();

    const app = module.createNestApplication();

    urlService = module.get<UrlService>(UrlService);
    uidService = module.get(UidService);
    configService = module.get(ConfigService);
    databaseService = module.get(DatabaseService);

    configService.getOrThrow.mockReturnValue(host);
    await app.init();
  });

  it('should be defined', () => {
    expect(urlService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new URL', async () => {
      //arrange
      const payload = generateUrlPayload({});
      uidService.generateUid.mockReturnValueOnce(uid);
      databaseService.url.create.mockResolvedValueOnce(payload);

      //act
      const result = await urlService.create({
        redirect: payload.redirect,
        title: payload.title,
        ...(payload.description && { description: payload.description }),
      });
      //assert
      expect(result).toEqual(payload);
    });
  });

  describe('delete', () => {
    it('should return a removed URL', async () => {
      // arrange
      const payload = generateUrlPayload({});
      databaseService.url.delete.mockResolvedValueOnce(payload);

      // act
      const result = await urlService.remove(payload.id);

      // assert
      expect(result).toEqual(payload);
    });
  });

  describe('update', () => {
    it('should update a URL', async () => {
      // arrange
      const original = generateUrlPayload({});
      const updated = { ...original, title: 'Updated Title' };
      databaseService.url.update.mockResolvedValueOnce(updated);

      // act
      const result = await urlService.update(original.id, {
        title: 'Updated Title',
      });

      // assert
      expect(result).toEqual(updated);
    });
  });

  describe('find one', () => {
    it('should return a single URL if the uid is valid', async () => {
      //arrange
      const payload = generateUrlPayload({});
      const uidLookup = uid;
      databaseService.url.findUnique.mockResolvedValueOnce(
        payload.url === `${host}/${uidLookup}` ? payload : null,
      );
      //act
      const result = await urlService.findOne(uidLookup);
      //assert
      expect(result).toEqual(payload);
    });

    it(`should return null when url record not found`, async () => {
      // Arrange
      const uidLookup = `random url`;
      const payload = generateUrlPayload({});
      databaseService.url.findUnique.mockResolvedValueOnce(
        payload.url === `${host}/${uidLookup}` ? payload : null,
      );

      // Act
      const url = await urlService.findOne(uidLookup);

      // Asserts
      expect(url).toEqual(null);
    });
  });

  describe('find all', () => {
    it('should return an array of urls', async () => {
      //arrange
      const urls = generateUrlArray();
      databaseService.url.findMany.mockResolvedValueOnce(urls);
      databaseService.url.count.mockResolvedValueOnce(urls.length);

      //act
      const result = await urlService.findAll({});

      // asert
      expect(result.urls).toEqual(urls);
    });
    it('should return an empty array if no urls exists', async () => {
      databaseService.url.findMany.mockResolvedValueOnce([]);
      databaseService.url.count.mockResolvedValueOnce(0);

      //act
      const result = await urlService.findAll({});

      // asert
      expect(result.urls).toEqual([]);
    });
  });
});
