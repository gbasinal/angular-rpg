import { TestBed } from '@angular/core/testing';

import { PreloaderServiceService } from './preloader-service.service';

describe('PreloaderServiceService', () => {
  let service: PreloaderServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreloaderServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
