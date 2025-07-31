import { Url } from '@prisma/client';
import { UrlService } from '../../url.service';
import { UrlExistsPipe } from './url-exists.pipe';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { NotFoundException } from '@nestjs/common';

describe('UrlExistsPipe', () => {
  let urlExistsPipe: UrlExistsPipe;
  let urlService = createMock<UrlService>();


  beforeEach(() => {
    urlExistsPipe = new UrlExistsPipe(urlService);
  });
  it('should be defined', () => {
    expect(urlExistsPipe).toBeDefined();
  });

  it('should return the url object if its found', async () => {
    
    let url: Url ={
      id: '123',
      url: 'http://localhost:3000/123',
      title: 'Example Title',
      description: 'Example Description',
      redirect: 'http://redirect.example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    urlService.findOne.mockResolvedValueOnce(url) ;
    const result = await urlExistsPipe.transform('123');
    expect(result).toEqual(url);
  });

  it(`should return an exception if the url object if it's not found`, async () => {
    urlService.findOne.mockResolvedValueOnce(null) ;
    const result = () =>  urlExistsPipe.transform('12345');
    expect(result).rejects.toThrow(NotFoundException);
  });
});
