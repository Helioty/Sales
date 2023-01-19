import { TestBed } from '@angular/core/testing';
import { PedidoListaService } from './pedido-lista.service';

describe('PedidoListaService', () => {
  let service: PedidoListaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PedidoListaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
