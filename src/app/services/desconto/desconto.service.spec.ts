import { TestBed } from '@angular/core/testing';

import { DescontoService } from './desconto.service';

describe('DescontoService', () => {
  let service: DescontoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DescontoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
