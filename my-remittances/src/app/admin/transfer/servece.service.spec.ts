import { TestBed } from '@angular/core/testing';

import { ServeceService } from './servece.service';

describe('ServeceService', () => {
  let service: ServeceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServeceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
