import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ApiService } from './api.service';
import { ErrorService } from './error.service';
import { Fighter } from '../model/fighter.model';

describe('FighterApiService', () => {
  let service: ApiService;
  let httpTestingController: HttpTestingController;
  let errorService: jasmine.SpyObj<ErrorService>;

  beforeEach(() => {
    const errorServiceSpy = { ...jasmine.createSpyObj('ErrorService', ['clearErrorMessage']), errorMessage$: of('') };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: ErrorService, useValue: errorServiceSpy },
      ]
    });
    service = TestBed.inject(ApiService);
  });

  beforeEach(() => {
    httpTestingController = TestBed.inject(HttpTestingController);
    errorService = TestBed.inject(ErrorService) as jasmine.SpyObj<ErrorService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('check getFighter', () => {
    const mockRes = {
      message: 'test message',
      result: {
        description: 'test description',
        properties: { mass: '44' }
      }
    };

    service.getFighter(12).subscribe(res => {
      expect(res).toEqual(<Fighter>{ description: 'test description', properties: { mass: '44' } });
    });
    const mockReq = httpTestingController.expectOne('https://www.swapi.tech/api/people/12');

    expect(mockReq.cancelled).toBeFalsy();
    expect(mockReq.request.responseType).toEqual('json');
    mockReq.flush(mockRes);
  });

  afterEach(() => {
    httpTestingController.verify();
  });
});
