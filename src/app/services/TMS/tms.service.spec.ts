import { TestBed } from '@angular/core/testing';

import { TMSService } from './tms.service';

describe('TMSService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TMSService = TestBed.inject(TMSService);
    expect(service).toBeTruthy();
  });
});
