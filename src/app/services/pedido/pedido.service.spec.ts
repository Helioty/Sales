import { TestBed } from '@angular/core/testing';

import { PedidoService } from './pedido.service';

describe('PedidoServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PedidoService = TestBed.inject(PedidoService);
    expect(service).toBeTruthy();
  });
});
