import { TestBed } from '@angular/core/testing';

import { ProdutoPesquisaService } from './produto-pesquisa.service';

describe('ProdutoPesquisaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProdutoPesquisaService = TestBed.inject(ProdutoPesquisaService);
    expect(service).toBeTruthy();
  });
});
