import { TestBed } from '@angular/core/testing';

import { PedidoServiceService } from './pedido-service.service';

describe('PedidoServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PedidoServiceService = TestBed.get(PedidoServiceService);
    expect(service).toBeTruthy();
  });
});
