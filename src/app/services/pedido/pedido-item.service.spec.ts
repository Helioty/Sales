import { TestBed } from '@angular/core/testing';

import { PedidoItemService } from './pedido-item.service';

describe('PedidoItemService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PedidoItemService = TestBed.get(PedidoItemService);
    expect(service).toBeTruthy();
  });
});
