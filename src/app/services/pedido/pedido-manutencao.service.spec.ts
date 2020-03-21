import { TestBed } from '@angular/core/testing';

import { PedidoManutencaoService } from './pedido-manutencao.service';

describe('PedidoManutencaoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PedidoManutencaoService = TestBed.get(PedidoManutencaoService);
    expect(service).toBeTruthy();
  });
});
