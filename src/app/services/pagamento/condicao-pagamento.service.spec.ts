import { TestBed } from '@angular/core/testing';

import { CondicaoPagamentoService } from './condicao-pagamento.service';

describe('CondicaoPagamentoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CondicaoPagamentoService = TestBed.get(CondicaoPagamentoService);
    expect(service).toBeTruthy();
  });
});
