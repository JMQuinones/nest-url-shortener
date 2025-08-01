import e from 'express';
import * as request from 'supertest';
import { server } from 'test/setup';
import { CreateUrlDto } from './dto/create-url.dto';
import { Url } from '@prisma/client';
describe('UrlController E2E test', () => {
  describe('POST /url', () => {
    //invalid API
    it('should return 401 if no API key is provided', async () => {
      await request(server).post('/url').expect(401);
    });

    it('should return 401 if an invalid API key is provided', async () => {
      await request(server)
        .post('/url')
        .set('x-api-key', 'INVALID')
        .expect(401);
    });
    //Invalid JSON
    it('should return 400 ifthe request body is empty', async () => {
      await request(server).post('/url').set('x-api-key', 'secret').expect(400);
    });
    it('should return 400 if the request body is not valid', async () => {
      await request(server)
        .post('/url')
        .set('x-api-key', 'secret')
        .send({ title: 123, description: 321, redirect: 'Invalid' })
        .expect(400);
    });
    //happy path
    it('should return 201 if the API key and the request body are valid', async () => {
      await request(server)
        .post('/url')
        .set('x-api-key', 'secret')
        .send({ title: "AirBnb", description: "A hotel site", redirect: 'https://www.airbnb.com' })
        .expect(201)
        .expect(({body}) => {
            const { data }  = body;

            expect(data.redirect).toEqual('https://www.airbnb.com');
            expect(data.title).toEqual('AirBnb');
            expect(data.description).toEqual('A hotel site');
            expect(data.id).toBeDefined();
        });
    });
  });
});
